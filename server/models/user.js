const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  userType: { type: String, enum: ["customer", "farmer", "business"], required: true },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
