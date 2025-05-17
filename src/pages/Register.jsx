import { useState } from "react";
import "../styles/register.css"; 
import { FaUser, FaEnvelope, FaLock, FaMapMarkerAlt, FaPhone, FaUserTag } from "react-icons/fa"; 
import {db, collection, addDoc} from "../firebase";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    address: "",
    userType: "customer",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () =>{
    const {name, email, password, contact, address } = formData;
    if(name.length < 3){
      alert("Name should be at least 3 characters");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email format.");
      return false;
    }

    const passwordRegex = /^(?=.*[0-9]).{6,}$/;
    if (!passwordRegex.test(password)) {
      alert("Password must be at least 6 characters and include a number.");
      return false;
    }

    const contactRegex = /^[0-9]{10}$/;
    if (!contactRegex.test(contact)) {
      alert("Contact must be a 10-digit number.");
      return false;
    }

    if (address.trim() === "") {
      alert("Address cannot be empty.");
      return false;
    }

    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await addDoc(collection(db, "users"), formData);
      alert("Registration Successful !");
      console.log("user registered:", formData);
      navigate("/login");
    } catch (error) {
      console.error("Error adding document: ",error);
      alert("Failed to register. Please try again");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaUser className="icon" />
            <input 
              type="text" 
              name="name" 
              placeholder="Name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
        
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <FaLock className="icon" />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <FaPhone className="icon" />
            <input 
              type="text" 
              name="contact" 
              placeholder="Contact Number" 
              value={formData.contact} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <FaMapMarkerAlt className="icon" />
            <input 
              type="text" 
              name="address" 
              placeholder="Address" 
              value={formData.address} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <FaUserTag className="icon" />
            <select name="userType" value={formData.userType} onChange={handleChange}>
              <option value="customer">Customer</option>
              <option value="farmer">Farmer</option>
              <option value="business">Business</option>
            </select>
          </div>
          <button type="submit">Register</button>
        </form>
        <p>Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
}

export default Register;
