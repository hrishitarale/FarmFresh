import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import AdminLayout from "../components/AdminLayout";
import "../styles/admin.css";

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [farmersMap, setFarmersMap] = useState({});

  useEffect(() => {
    const fetchProductsAndFarmers = async () => {
      // Fetch products
      const productSnapshot = await getDocs(collection(db, "products"));
      const productsData = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(productsData);

      // Fetch farmers
      const userSnapshot = await getDocs(collection(db, "users"));
      const farmersData = {};
      userSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.userType === "farmer") {
          farmersData[doc.id] = data.name;
        }
      });

      setFarmersMap(farmersData);
    };

    fetchProductsAndFarmers();
  }, []);

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };
  return (
    <AdminLayout>
      <div className="admin-content">
        <h2>📦 Product Management</h2>
        <div className="card-container">
          {products.map((product) => (
            <div className="admin-card" key={product.id}>
              <h3>{product.name}</h3>
              <p>Category: {product.category}</p>
              <p>Price: ₹{product.price}/kg</p>
              <p>Uploaded by: {farmersMap[product.farmer_id] || "Unknown"}</p>
              <div className="card-buttons">
                <button className="edit-btn" onClick={() => alert("Edit feature coming soon!")}>Edit</button>
                <button className="delete-btn" onClick={() => deleteProduct(product.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductsManagement;
