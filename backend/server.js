const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const fs = require("fs");
const userRoutes = require("./routes/users");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./middleware/logger");

const app = express();
const PORT = 5000;
const USERS_FILE = path.join(__dirname, "../public/users.json");

// Middleware
app.use(express.json()); // Body parser
app.use(cors()); // Enable CORS
app.use(morgan("dev")); // Logging
app.use(helmet()); // Security headers
app.use(logger); // Custom logger middleware

// Serving static files
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use("/api", userRoutes);

// User Registration Endpoint
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        let users = [];
        if (fs.existsSync(USERS_FILE)) {
            users = JSON.parse(fs.readFileSync(USERS_FILE));
        }
        if (users.find(user => user.email === email)) {
            return res.status(400).json({ message: "User already exists" });
        }
        const newUser = { name, email, password };
        users.push(newUser);
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        console.log("User registered:", newUser);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// User Login Endpoint
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    try {
        if (!fs.existsSync(USERS_FILE)) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const users = JSON.parse(fs.readFileSync(USERS_FILE));
        const user = users.find(user => user.email === email && user.password === password);
        if (user) {
            res.status(200).json({ user: { name: user.name, email: user.email }, role: "user", token: "fake-jwt-token" });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
