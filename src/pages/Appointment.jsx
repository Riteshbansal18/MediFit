import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Appointment = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    doctor: "",
    message: "",
  });

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch logged-in user details
  useEffect(() => {
    fetch("http://localhost:5000/api/auth/me", {
      credentials: "include", // Important for sending session cookies
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        } else {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        navigate("/login");
      });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          email: user.email, // ✅ fixed: removed extra comma after this line
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Appointment Requested Successfully!");
        navigate("/appointments");
      } else {
        alert(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <section className="py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-headingColor">
          Request an Appointment
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            className="w-full px-4 py-2 border rounded"
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            className="w-full px-4 py-2 border rounded"
            onChange={handleChange}
          />
          <input
            type="date"
            name="date"
            required
            className="w-full px-4 py-2 border rounded"
            onChange={handleChange}
          />
          <input
            type="time"
            name="time"
            required
            className="w-full px-4 py-2 border rounded"
            onChange={handleChange}
          />
          <input
            type="text"
            name="doctor"
            placeholder="Doctor's Name"
            required
            className="w-full px-4 py-2 border rounded"
            onChange={handleChange}
          />
          <textarea
            name="message"
            rows="4"
            placeholder="Additional Message (optional)"
            className="w-full px-4 py-2 border rounded"
            onChange={handleChange}
          ></textarea>
          <button
            type="submit"
            className="btn w-full bg-primaryColor text-white py-2 rounded hover:bg-opacity-90 transition"
          >
            Submit Request
          </button>
        </form>
      </div>
    </section>
  );
};

export default Appointment;
