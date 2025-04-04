// src/components/MyBookings.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Spinner,
  Alert,
  Form,
  InputGroup,
  Button,
} from "react-bootstrap";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: "", search: "" });

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (bookingId, amount) => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Failed to load Razorpay. Check your connection.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId, amount }),
      });

      const data = await response.json();
      if (!data.success) {
        alert(data.message);
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount * 100,
        currency: "INR",
        name: "Movers and Packers",
        description: "Booking Payment",
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await updateBookingStatus(bookingId);
            alert("✅ Payment successful!");
            // Refresh bookings
            fetchBookings();
          } catch (err) {
            alert("Payment succeeded, but failed to update booking status.");
          }
        },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "9876543210",
        },
        theme: { color: "#0d6efd" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error initiating payment:", error.message);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  const updateBookingStatus = async (bookingId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/update-status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "Completed" }),
    });

    if (!response.ok) {
      throw new Error("Failed to update booking status");
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(data.bookings || []);
      setFilteredBookings(data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  useEffect(() => {
    let filtered = bookings;

    if (filter.status) {
      filtered = filtered.filter((booking) => booking.status === filter.status);
    }

    if (filter.search) {
      filtered = filtered.filter((booking) =>
        booking.service?.title?.toLowerCase().includes(filter.search.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  }, [filter, bookings]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your bookings...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          ❌ {error}
        </Alert>
      </Container>
    );
  }

  if (!filteredBookings.length) {
    return (
      <Container className="mt-5 text-center">
        <Alert variant="info">📚 No matching bookings found.</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">📅 My Bookings</h2>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Select name="status" value={filter.status} onChange={handleFilterChange}>
            <option value="">Filter by Status</option>
            <option value="Pending">⏳ Pending</option>
            <option value="Completed">✅ Completed</option>
            <option value="Cancelled">❌ Cancelled</option>
          </Form.Select>
        </Col>
        <Col md={6}>
          <InputGroup>
            <Form.Control
              type="text"
              name="search"
              value={filter.search}
              onChange={handleFilterChange}
              placeholder="🔎 Search by service name..."
            />
            <Button
              variant="outline-secondary"
              onClick={() => setFilter({ status: "", search: "" })}
              title="Clear filters"
            >
              Clear
            </Button>
          </InputGroup>
        </Col>
      </Row>

      <Row>
        {filteredBookings.map((booking) => (
          <Col md={6} lg={4} key={booking._id} className="mb-4">
            <Card className="shadow-lg border-0 rounded-3">
              <Card.Body>
                <h5 className="text-primary fw-bold">
                  {booking?.service?.title || "Service Name"}
                </h5>
                <p className="text-muted mb-1">
                  <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
                </p>
                <p className="text-muted mb-1">
                  <strong>Address:</strong> {booking.address || "Not provided"}
                </p>
                <p className="text-muted mb-1">
                  <strong>Contact:</strong> {booking.contactNumber || "Not provided"}
                </p>
                <p className="text-muted mb-1">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`badge ${
                      booking.status === "Completed"
                        ? "bg-success"
                        : booking.status === "Pending"
                        ? "bg-warning"
                        : "bg-danger"
                    }`}
                  >
                    {booking.status}
                  </span>
                </p>

                {booking.status === "Pending" && (
                  <Button
                    variant="success"
                    size="sm"
                    className="mt-2"
                    onClick={() => handlePayment(booking._id, booking.amount)}
                    title="Pay and complete booking"
                  >
                    💳 Pay Now
                  </Button>
                )}

                <hr />
                <p
                  className={`fw-bold ${
                    booking.status === "Completed"
                      ? "text-success"
                      : booking.status === "Pending"
                      ? "text-warning"
                      : "text-danger"
                  }`}
                >
                  {booking.status === "Completed"
                    ? "✅ Booking Confirmed"
                    : booking.status === "Pending"
                    ? "⏳ Booking Pending"
                    : "❌ Booking Cancelled"}
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default MyBookings;
