import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import AdminLayout from "../components/AdminLayout";

function AdminDashboard() {
  const [totals, setTotals] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalFarmers: 0,
    totalBusinesses: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [ordersSnap, usersSnap] = await Promise.all([
        getDocs(collection(db, "orders")),
        getDocs(collection(db, "users")),
      ]);

      let revenue = 0;
      ordersSnap.forEach((doc) => {
        const order = doc.data();
        revenue += parseFloat(order.total_price || 0);
      });

      let customers = 0, farmers = 0, businesses = 0;
      usersSnap.forEach((doc) => {
        const user = doc.data();
        if (user.userType === "customer") customers++;
        else if (user.userType === "farmer") farmers++;
        else if (user.userType === "business") businesses++;
      });
      setTotals({
        totalOrders: ordersSnap.size,
        totalRevenue: revenue,
        totalCustomers: customers,
        totalFarmers: farmers,
        totalBusinesses: businesses,
      });
    };

    fetchStats();
  }, []);

  return (
  
    <div className="admin-dashboard">
      <h2>Dashboard Overview</h2>
      <div className="stats-grid">
        <div className="stat-card">📦 Total Orders: {totals.totalOrders}</div>
        <div className="stat-card">💰 Total Revenue: ₹{totals.totalRevenue}</div>
        <div className="stat-card">👥 Customers: {totals.totalCustomers}</div>
        <div className="stat-card">👨‍🌾 Farmers: {totals.totalFarmers}</div>
        <div className="stat-card">🏢 Businesses: {totals.totalBusinesses}</div>
      </div>
    </div>
  
  );
}

export default AdminDashboard;
