require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDb = require("./src/config/Db");

// ✅ Initialize Express App
const app = express();
connectDb();

// ✅ Correct CORS Setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",  // Development frontend
      "https://movers-and-packers-webfrontend.vercel.app", // Deployed frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // ✅ Allow credentials (important for authentication)
  })
);

// ✅ Ensure Preflight Requests Pass
app.options("*", cors());

// ✅ Middleware to parse JSON requests
app.use(express.json());

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Hello World - Backend is Working!");
});

// ✅ Import Routes
const authRoutes = require("./src/routes/authroutes");
const adminRoutes = require("./src/routes/adminroutes");
const serviceRoutes = require("./src/routes/serviceRoutes");
const userRoutes = require("./src/routes/userRoutes");
const bookingRoutes = require("./src/routes/bookingroutes");
const carShiftingRoutes = require("./src/routes/carShiftingRoutes");
const houseShiftingRoutes = require("./src/routes/houseShiftingRoutes");
const officeShiftingRoutes = require("./src/routes/officeShiftingRoutes");
const domesticShiftRoutes = require("./src/routes/domesticShiftRoutes");
const paymentRoutes = require("./src/routes/paymentroutes");

// ✅ Attach Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/car-shifting", carShiftingRoutes);
app.use("/api/house-shifting", houseShiftingRoutes);
app.use("/api/office-shifting", officeShiftingRoutes);
app.use("/api/domestic-shift", domesticShiftRoutes);
app.use("/api/payments", paymentRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
