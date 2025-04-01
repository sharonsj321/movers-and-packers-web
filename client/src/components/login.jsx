import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert, Container, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://movers-and-packers-webfrontend.vercel.app/api/auth/login",
        formData
      );

      // ✅ Correctly destructure token and user
      const { token, user } = response.data;
      if (token && user) {
        console.log("Token:", token);
        console.log("User:", user);

        // ✅ Store token in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // ✅ Set authorization header globally
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // ✅ Call onLogin with correct params
        onLogin(user, token);
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to login.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="shadow-lg p-4 rounded-lg" style={{ width: "400px" }}>
        <Card.Body>
          <h2 className="text-center mb-4 fw-bold">🔐 Login</h2>

          {/* Error Alert */}
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Login Form */}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="rounded-pill"
                required
              />
            </Form.Group>

            <Form.Group controlId="password" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="rounded-pill"
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 rounded-pill mb-3"
            >
              Login
            </Button>
          </Form>

          {/* Forgot Password & Signup Links */}
          <div className="text-center mt-3">
            <Link to="/forgot-password" className="text-decoration-none">
              Forgot Password?
            </Link>
          </div>
          <div className="text-center mt-2">
            <span>Don't have an account? </span>
            <Link to="/register" className="text-primary fw-bold text-decoration-none">
              Sign Up
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
