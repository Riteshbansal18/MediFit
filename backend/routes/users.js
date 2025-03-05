const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const usersFile = path.join(__dirname, "../../public/users.json");

// Read users.json file
const readUsers = () => {
    if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, "[]");
    return JSON.parse(fs.readFileSync(usersFile, "utf8"));
};

// Write to users.json file
const writeUsers = (users) => {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

// Register User
router.post("/Signup", (req, res) => {
    const { name, email, password } = req.body;
    let users = readUsers();

    if (users.find(user => user.email === email)) {
        return res.status(400).json({ message: "User already exists!" });
    }

    users.push({ name, email, password });
    writeUsers(users);

    res.json({ message: "User registered successfully!" });
});

// Get User by Email
router.get("/user/:email", (req, res) => {
    const { email } = req.params;
    const users = readUsers();
    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
});

module.exports = router;
