const mongoose = require('mongoose')
const masterSchema = require('./mastermodel')

const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ["admin", "customer", "mover"],
        default: "customer",
      },
    },
    { timestamps: true }
  );


  const User = mongoose.model("User", userSchema);
  module.exports = User;