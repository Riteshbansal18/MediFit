require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const fs = require("fs");
const connectDB = require("./db");

const userRoutes = require("./routes/users");
const appointmentRoutes = require("./routes/appointment");
const errorHandler = require("./middleware/errorHandler");
const createError = require("./utils/createError");
const authRoutes = require("./routes/auth");
const User = require("./models/User");

const app = express();
const PORT = 5000;

connectDB();

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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(helmet());
app.use(morganCombined);
app.use(express.static(path.join(__dirname, "../public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/appointments", appointmentRoutes);

const CONTACTS_FILE = path.join(__dirname, "../public/contact.json");

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.post("/contact", (req, res) => {
  const { email, subject, message } = req.body;
  console.log("📩 Contact form submitted:", { email, subject, message });

  let contacts = [];
  if (fs.existsSync(CONTACTS_FILE)) {
    const data = fs.readFileSync(CONTACTS_FILE, "utf-8");
    contacts = JSON.parse(data);
  }

  const newContact = {
    email,
    subject,
    message,
    timestamp: new Date().toISOString(),
  };

  contacts.push(newContact);
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));

  res.send("✅ Thank you for contacting us!");
});

app.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(createError(400, "All fields are required"));
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError(400, "User already exists"));
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    console.log("User registered:", newUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(createError(500, "Error while registering user"));
  }
});

app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createError(400, "Email and password are required"));
  }

  try {
    const user = await User.findOne({ email, password });
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

app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
