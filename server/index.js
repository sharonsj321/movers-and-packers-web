require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDb = require("./src/config/Db");

const app = express();
connectDb();

app.use(
  cors({
    origin: [
      "http://localhost:5173", // Frontend in development mode
      "https://movers-and-packers-webfrontend.vercel.app", // Frontend in production
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // ✅ Allow credentials (cookies, authorization headers)
  })
);

// ✅ Allow preflight requests
app.options("*", cors());

// ✅ Middleware to parse JSON requests
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Hello World - Backend is Working!");
});

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



// ✅ Routes
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
