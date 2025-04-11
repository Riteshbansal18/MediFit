const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const fs = require("fs");

const userRoutes = require("./routes/users");
const appointmentRoutes = require("./routes/appointment");
const errorHandler = require("./middleware/errorHandler");
const createError = require("./utils/createError");

const app = express();
const PORT = 5000;
const USERS_FILE = path.join(__dirname, "../public/users.json");

// ✅ Setup EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // create 'views' folder beside server.js

// ✅ Create write stream for logs.txt
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "middleware", "logs.txt"),
  { flags: "a" }
);

const morganCombined = morgan("combined", {
  stream: {
    write: (message) => {
      process.stdout.write(message);
      accessLogStream.write(message);
    },
  },
});

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to handle form POST data
app.use(cors());
app.use(helmet());
app.use(morganCombined);

// ✅ Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, "../public")));

// ✅ EJS Route - GET contact page
app.get("/contact", (req, res) => {
  res.render("contact"); // views/contact.ejs should exist
});

// ✅ EJS Route - POST form submission
app.post("/contact", (req, res) => {
  const { email, subject, message } = req.body;
  console.log("📩 Contact form submitted:", { email, subject, message });

  // You can optionally save this to a file or database
  res.send("✅ Thank you for contacting us!");
});

// ✅ Main API Routes
app.use("/api", userRoutes);
app.use("/api/appointments", appointmentRoutes);

// ✅ Register Route
app.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(createError(400, "All fields are required"));
  }

  try {
    let users = [];
    if (fs.existsSync(USERS_FILE)) {
      users = JSON.parse(fs.readFileSync(USERS_FILE));
    }

    if (users.find((user) => user.email === email)) {
      return next(createError(400, "User already exists"));
    }

    const newUser = { name, email, password };
    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    console.log("User registered:", newUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(createError(500, "Error while registering user"));
  }
});

// ✅ Login Route
app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createError(400, "Email and password are required"));
  }

  try {
    if (!fs.existsSync(USERS_FILE)) {
      return next(createError(401, "Invalid credentials"));
    }

    const users = JSON.parse(fs.readFileSync(USERS_FILE));
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      return next(createError(401, "Invalid credentials"));
    }

    res.status(200).json({
      user: { name: user.name, email: user.email },
      role: "user",
      token: "fake-jwt-token",
    });
  } catch (error) {
    next(createError(500, "Error while logging in"));
  }
});

// ✅ Global Error Handler
app.use(errorHandler);

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
