const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment"); 

router.post("/", async (req, res) => {
  try {
    const { doctor, date, time, email } = req.body; 

    if (!doctor || !date || !time) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const newAppointment = new Appointment({
      doctor,
      date,
      time,
      email,
    });

    await newAppointment.save();

    res.status(201).json({ message: "Appointment booked successfully" });
  } catch (error) {
    console.error("Error reading/writing appointments:", error);
    res.status(500).json({ message: "Error reading appointments" });
  }
});

module.exports = router;
