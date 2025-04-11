const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const appointmentsPath = path.join(__dirname, '../public/appointments.json');

router.post('/', (req, res) => {
  const newAppointment = req.body;

  fs.readFile(appointmentsPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading appointments' });

    let appointments = [];
    try {
      appointments = JSON.parse(data);
    } catch {
      return res.status(500).json({ message: 'Error parsing appointments' });
    }

    appointments.push(newAppointment);

    fs.writeFile(appointmentsPath, JSON.stringify(appointments, null, 2), (err) => {
      if (err) return res.status(500).json({ message: 'Error saving appointment' });

      res.status(201).json({ message: 'Appointment saved successfully' });
    });
  });
});

// GET: Get appointments for a specific user
router.get('/:email', (req, res) => {
  const email = req.params.email;

  fs.readFile(appointmentsPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading appointments' });

    let appointments = JSON.parse(data);
    const userAppointments = appointments.filter(app => app.email === email);

    res.json(userAppointments);
  });
});

module.exports = router;
