import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import AdminLayout from "../components/AdminLayout";
import "../styles/admin.css";

const CustomerManagement = () => {
  const [users, setUsers] = useState([]);
  const [ordersMap, setOrdersMap] = useState({});

  useEffect(() => {
    const fetchCustomersAndOrders = async () => {
      // Fetch users
      const userSnapshot = await getDocs(collection(db, "users"));
      const usersData = userSnapshot.docs
        .filter((doc) => {
          const type = doc.data().userType;
          return type === "customer" || type === "business";
        })
        .map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);

      // Fetch orders
      const ordersSnapshot = await getDocs(collection(db, "orders"));
      const orders = ordersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Group orders by email (used as userId in orders)
      const groupedOrders = {};
      orders.forEach((order) => {
        const email = order.user_id; // this is the email of the user
        if (!groupedOrders[email]) groupedOrders[email] = [];
        groupedOrders[email].push(order);
      });

      setOrdersMap(groupedOrders);
    };

    fetchCustomersAndOrders();
  }, []);

  const deleteUser = async (id) => {
    await deleteDoc(doc(db, "users", id));
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <AdminLayout>
      <div className="admin-content">
        <h2>👥 Customers & Businesses</h2>
        <div className="card-container">
          {users.map((user) => (
            <div className="admin-card" key={user.id}>
              <h3>{user.name}</h3>
              <p>{user.userType.toUpperCase()}</p>
              <p>{user.email}</p>

              <h4>🧾 Orders:</h4>
              {ordersMap[user.email]?.length ? (
                <ul>
                  {ordersMap[user.email].map((order) => (
                    <li key={order.id}>
                      <strong>Order ID:</strong> {order.id}<br />
                      <strong>Total:</strong> ₹{order.total_price || "N/A"}<br />
                      {/* <strong>Date:</strong>{order.order_date} <br /> */}
                      {/* {order.timestamp?.seconds
                        ? new Date(order.timestamp.seconds * 1000).toLocaleString()
                        : "N/A"} */}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No orders found</p>
              )}

              <div className="card-buttons">
                <button className="delete-btn" onClick={() => deleteUser(user.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CustomerManagement;
