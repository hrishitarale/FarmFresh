import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/admin.css";

function Sidebar() {
  const location = useLocation();

  return (
    <div className="admin-sidebar">
      <h2>⚙️ Admin Panel</h2>
      <ul>
        <li className={location.pathname === "/AdminPanel" ? "active-link" : ""}>
          <Link to="/AdminPanel">📊 Dashboard</Link>
        </li>
        <li className={location.pathname === "/FarmersManagement" ? "active-link" : ""}>
          <Link to="/FarmersManagement">🌾 Farmer Management</Link>
        </li>
        <li className={location.pathname === "/CustomerManagement" ? "active-link" : ""}>
          <Link to="/CustomerManagement">👤 Customer Management</Link>
        </li>
        <li className={location.pathname === "/ProductsManagement" ? "active-link" : ""}>
          <Link to="/ProductsManagement">📦 Product Management</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
