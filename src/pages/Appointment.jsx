import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  max-width: 500px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background-color: #f9f9f9;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 14px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  margin-top: 15px;
  text-align: center;
  font-weight: bold;
`;

const SuccessMessage = styled.p`
  color: #28a745;
  margin-top: 15px;
  text-align: center;
  font-weight: bold;
`;

const LoginContainer = styled.div`
  text-align: center;
  padding: 30px;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin: 50px auto;
  max-width: 400px;
`;

const LoginTitle = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const LoginButton = styled(Button)`
  padding: 12px 25px;
`;

const Appointment = () => {
  const [user, setUser] = useState(null);
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate getting logged-in user info from localStorage/sessionStorage
    // Replace this with your actual user fetching logic or context
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
    } else {
      setUser(null);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("You must be logged in to book an appointment.");
      return;
    }

    if (!doctor || !date || !time) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          doctor,
          date,
          time,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Something went wrong.");
      } else {
        setSuccess("Appointment booked successfully!");
        setTimeout(() => navigate("/"), 1500); // Redirect to home after 1.5s
      }
    } catch (err) {
      console.error("Error submitting appointment:", err);
      setError("Failed to book appointment.");
    }
  };

  if (user === null) {
    return (
      <LoginContainer>
        <LoginTitle>Please log in to book an appointment.</LoginTitle>
        <LoginButton onClick={() => navigate("/login")}>
          Go to Login
        </LoginButton>
      </LoginContainer>
    );
  }

  return (
    <Container>
      <Title>Book an Appointment</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Doctor:</Label>
          <Input
            type="text"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Date:</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Time:</Label>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </FormGroup>
        <Button type="submit">Submit</Button>
      </Form>

      {error && <ErrorMessage>❌ {error}</ErrorMessage>}
      {success && <SuccessMessage>✅ {success}</SuccessMessage>}
    </Container>
  );
};

export default Appointment;