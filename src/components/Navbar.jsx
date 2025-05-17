import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { FaShoppingCart, FaRegUser } from "react-icons/fa";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUser=() =>{
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    setUser(storedUser);
  }
  // Load user on component mount
  useEffect(() => {
    fetchUser();

    window.addEventListener("userChanged", fetchUser);
    
    return () => window.removeEventListener("userChanged", fetchUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    window.dispatchEvent(new Event("userChanged")); // trigger update
    navigate("/login");
  };

  const handleProfileClick = () => {
    if (!user) {
      navigate("/login");
    }
  };

  return (
    <nav>
      <h2>FarmFresh</h2>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/farmers-market">Farmer's Market</Link></li>
        <li><Link to="/CommunityForum">Farmer's Community</Link></li>
        <li><Link to="/choppedVegetables">Chopped Vegetables</Link></li>
        {/* <li><Link to="/AdminPanel">Admin</Link></li> */}
        {user?.userType === "business" && (
          <li><Link to="/business-dashboard">Bulk Order</Link></li>
        )}

        {user?.userType === "admin" &&(
          <li><Link to="/AdminPanel">Admin Dashboard</Link></li>
        )}

        <li className="cart-icon">
          <Link to="/cart">
            <FaShoppingCart size={24} />
          </Link>
        </li>

        <li className="profile-section">
          {user ? (
            <>
              <span className="greeting">Hello, {user.name}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <span onClick={handleProfileClick} style={{ cursor: "pointer" }}>
              <FaRegUser size={24} />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
