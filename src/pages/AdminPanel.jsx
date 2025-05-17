import React, { useState } from "react";
import Sidebar from "./Sidebar";
import AdminDashboard from "./AdminDashboard";
import FarmersManagement from "./FarmersManagement";
import CustomersManagement from "./CustomerManagement";
import ProductsManagement from "./ProductsManagement";
// import OrdersManagement from "./OrdersManagement";
import "../styles/admin.css";

function AdminPanel() {
  const [selectedSection, setSelectedSection] = useState("dashboard");

  const renderSection = () => {
    switch (selectedSection) {
      case "farmers": return <FarmersManagement />;
      case "customers": return <CustomersManagement />;
      case "products": return <ProductsManagement />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="admin-container">
      <Sidebar onSelect={setSelectedSection} />
      <div className="admin-content">{renderSection()}</div>
    </div>
  );
}

export default AdminPanel;
