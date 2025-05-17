import { Link } from "react-router-dom";
import "../styles/navbar.css";

function BusinessNavbar() {
  return (
    <nav className="navbar">
      <h2 className="navbar-logo">FarmFresh Business</h2>
      <div className="navbar-links">
        <Link to="/business-dashboard">Home</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default BusinessNavbar;
