import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {db, collection, getDocs, query, where } from "../firebase";
import '../styles/login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) =>{
    setFormData({...formData, [e.target.name]: e.target.value});
  };
  const validateForm = () => {
    const { email, password } = formData;
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return false;
    }
  
    if (password.trim() === "") {
      alert("Password cannot be empty.");
      return false;
    }
  
    return true;
  };
  //handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const q = query(collection(db, "users"), where("email", "==", formData.email));
      const querySnapshot = await getDocs(q);
      if(querySnapshot.empty){
        alert("User not found");
        return;
      }
      
      const doc = querySnapshot.docs[0];
      const userData = doc.data();
      userData.id = doc.id;
//get user data
      if(userData.password !== formData.password){
        alert("Incorrect password");
        return;
      }
      //store user in local storage
      localStorage.setItem("loggedInUser", JSON.stringify(userData));
      window.dispatchEvent(new Event("userChanged"));

       // Redirect based on userType
       if (userData.userType === "customer") {
        navigate("/");
      } else if (userData.userType === "farmer") {
        navigate("/farmer-home");
      } else if (userData.userType === "business") {
        navigate("/business-dashboard");
      }else if (userData.userType === "admin"){
        navigate("/AdminPanel");
      }
      
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Try again!");
    }
  };

    return (
      <div className="login-container" >
        <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password}
            onChange={handleChange} required />
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account ? <a href="/register">Register here</a> </p>
        </div>
      </div>
    );
  }
  
  export default Login;
  