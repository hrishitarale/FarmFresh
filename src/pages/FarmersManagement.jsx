import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import AdminLayout from "../components/AdminLayout";
import "../styles/admin.css";

const FarmersManagement = () => {
  const [farmers, setFarmers] = useState([]);

  useEffect(() => {
    const fetchFarmers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const data = querySnapshot.docs
        .filter((doc) => doc.data().userType === "farmer")
        .map((doc) => ({ id: doc.id, ...doc.data() }));
      setFarmers(data);
    };
    fetchFarmers();
  }, []);

  const deleteFarmer = async (id) => {
    await deleteDoc(doc(db, "users", id));
    setFarmers((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <AdminLayout>
      <div className="admin-content">
        <h2>🌱 Farmer Management</h2>
        <div className="card-container">
          {farmers.map((farmer) => (
            <div className="admin-card" key={farmer.id}>
              <h3>{farmer.name}</h3>
              <p>{farmer.email}</p>
              <div className="card-buttons">
                <button className="delete-btn" onClick={() => deleteFarmer(farmer.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default FarmersManagement;
