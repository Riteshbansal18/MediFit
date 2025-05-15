const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment"); // Your Mongoose model for appointment

// POST /api/appointments - create a new appointment
router.post("/", async (req, res) => {
  try {
    const { doctor, date, time, email } = req.body; // email if you want to associate user

    if (!doctor || !date || !time) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Create a new appointment document
    const newAppointment = new Appointment({
      doctor,
      date,
      time,
      email, // optional: associate with user email
    });

    await newAppointment.save();

    res.status(201).json({ message: "Appointment booked successfully" });
  } catch (error) {
    console.error("Error reading/writing appointments:", error);
    res.status(500).json({ message: "Error reading appointments" });
  }
});

module.exports = router;
