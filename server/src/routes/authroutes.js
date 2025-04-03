const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // ✅ Import JWT
const bcrypt = require("bcryptjs"); // ✅ Import bcrypt
const User = require("../models/usermodel"); // ✅ Import User model
const { register, login, logout, signup, signin } = require("../controllers/authcontroller");

// ✅ Auth Routes (Controller Methods)
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/signup", signup);
router.post("/signin", signin);

// ✅ Function to generate JWT Token
const generateAuthToken = (user) => {
  const payload = { id: user._id, email: user.email, role: user.role };
  return jwt.sign(payload, process.env.JWT_Secret, { expiresIn: "1h" });
};

// ✅ CORS Middleware (Should be in `server.js`, Not Here!)
// ❌ app.use(...) is incorrect in route files! Remove it!

// ✅ Signup Route (Move to Controller Instead!)
router.post("/register-user", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "customer",
    });

    await newUser.save();

    // Generate JWT token
    const token = generateAuthToken(newUser);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;
