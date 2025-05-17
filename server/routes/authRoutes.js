const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user"); // Ensure the correct path

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, contact, address, userType } = req.body;

    if (!name || !email || !password || !contact || !address || !userType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      contact,
      address,
      userType,
    });

    // Save user to database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
