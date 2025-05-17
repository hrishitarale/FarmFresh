import { useEffect, useState } from "react";
import { db, collection, getDocs } from "../firebase";
import "../styles/dashboard.css";

function BusinessDashboard() {
  const [products, setProducts] = useState([]);
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((product) => product.category?.toLowerCase() === "vegetable"); // ✅ Only vegetables
        
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const handleWeightChange = (productId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const addToCart = (product) => {
    const selectedWeight = quantities[product.id] || "5 kg"; // Default weight
    const weightFactor =
      selectedWeight === "1 kg"
        ? 1
        : selectedWeight === "5 kg"
        ? 5
        : selectedWeight === "10 kg"
        ? 10
        : 1;

    const existingCart = JSON.parse(localStorage.getItem(`cart_${user.uid}`)) || [];
    const existingItem = existingCart.find((item) => item.id === product.id && item.weight === selectedWeight);

    const updatedCart = existingItem
      ? existingCart.map((item) =>
          item.id === product.id && item.weight === selectedWeight
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...existingCart, { ...product, quantity: 1, weight: selectedWeight, weightLabel: selectedWeight, weightFactor }];

    localStorage.setItem(`cart_${user.uid}`, JSON.stringify(updatedCart));
    alert("Added to cart");
  };

  return (
    <div className="dashboard-container">
      <h2>Bulk Buy from Farmers</h2>
      <div className="product-list">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image_url} alt={product.name} />
            <h4>{product.name}</h4>
            <p>₹{product.price} /kg</p>

            {/* ✅ Bulk quantity options */}
            <label>Choose Quantity:</label>
            <select
              value={quantities[product.id] || "5 kg"}
              onChange={(e) => handleWeightChange(product.id, e.target.value)}
            >
              <option value="1 kg">1 kg</option>
              <option value="5 kg">5 kg</option>
              <option value="10 kg">10 kg</option>
              <option value="20 kg">20 kg</option>
            </select>

            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BusinessDashboard;
