const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  doctor: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  email: { type: String },
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
