import { useEffect, useState } from "react";
import { db, collection, getDocs } from "../firebase";
import "../styles/farmerOrders.css";

function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const farmer = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const snapshot = await getDocs(collection(db, "orders"));
        const allOrders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const farmerOrders = allOrders
          .map((order) => {
            const matchingItems = order.items.filter(
              (item) => item.farmer_id === farmer.id
            );
            return matchingItems.length > 0
              ? { ...order, items: matchingItems }
              : null;
          })
          .filter((o) => o !== null);

        setOrders(farmerOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [farmer]);

  return (
    <div className="farmer-orders-container">
      <h2 className="section-title">📦 Orders for Your Products</h2>
      {loading ? (
        <p className="loading-text">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="no-orders">No orders found for your products.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span className="order-id">Order ID: <strong>{order.id}</strong></span>
              <span className="order-date">
                Delivery Date: <strong>{new Date(order.delivery_date?.seconds * 1000).toLocaleDateString()}</strong>
              </span>
            </div>

            <div className="order-body">
              <p><strong>Customer:</strong> {order.user_name}</p>
              <p><strong>Address:</strong> {order.user_address}</p>
              <p><strong>Slot:</strong> {order.delivery_slot} at {order.delivery_time || "Scheduled Time"}</p>

              <table className="items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Weight</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td>{item.weightLabel}</td>
                      <td>{item.quantity}</td>
                      <td>₹{(item.price * item.quantity * item.weightFactor).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="total-amount"><strong>Total Paid:</strong> ₹{order.total_price}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default FarmerOrders;
