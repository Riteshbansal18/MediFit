// routes/auth.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const USERS_FILE = path.join(__dirname, "../../public/users.json");

router.get("/me", (req, res) => {
  try {
    // Example: get email from header
    const email = req.headers["x-user-email"];

    if (!email) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({ user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
