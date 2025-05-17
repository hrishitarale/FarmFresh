import { useEffect, useState } from "react";
import { db, collection, getDocs, doc, getDoc } from "../firebase";
import "../styles/farmersMarket.css";
import { useNavigate } from "react-router-dom";

function FarmersMarket() {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [quantityMap, setQuantityMap] = useState({});
  const navigate = useNavigate();

  const quantityOptions = ["500 gm", "1 kg", "2 kg"];

  const handleAddToCart = (product, quantityLabel) => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
      alert("Please login to add products to cart");
      navigate("/login");
      return;
    }
  
    const quantityMap = {
      "500 gm": 0.5,
      "1 kg": 1,
      "2 kg": 2
    };
  
    const quantity = quantityMap[quantityLabel] || 1;
    const cartKey = `cart_${user.uid}`;
    const existingCart = JSON.parse(localStorage.getItem(cartKey)) || [];
  
    const itemIndex = existingCart.findIndex((item) => item.id === product.id && item.weightLabel === quantityLabel);
    if (itemIndex !== -1) {
      existingCart[itemIndex].quantity += 1;
    } else {
      existingCart.push({ 
        ...product, 
        quantity: 1, 
        weightLabel: quantityLabel,
        weight: quantityLabel,
        weightFactor: quantity 
      });
      localStorage.setItem(cartKey, JSON.stringify(existingCart));
      alert("Added to cart!");
    }
  };
  

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const grouped = {};

        for (const docSnap of querySnapshot.docs) {
          const product = { id: docSnap.id, ...docSnap.data() };
          if(product.category?.toLowerCase() !== "vegetable") continue;

          const farmerRef = doc(db, "users", product.farmer_id);
          const farmerSnap = await getDoc(farmerRef);

          if (farmerSnap.exists()) {
            const farmerName = farmerSnap.data().name;
            if (!grouped[farmerName]) {
              grouped[farmerName] = [];
            }
            grouped[farmerName].push(product);
          }
        }

        setGroupedProducts(grouped);
        setLoading(false);
      } catch (error) {
        console.error("Error loading market data", error);
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  const handleQuantityChange = (productId, selectedQuantity) => {
    setQuantityMap((prev) => ({ ...prev, [productId]: selectedQuantity }));
  };

  return (
    <div className="farmers-market">
      <h2>🌾 Farmers Market</h2>
      {loading ? (
        <p>Loading fresh produce...</p>
      ) : (
        Object.keys(groupedProducts).map((farmerName, index) => (
          <div key={index} className="farmer-section">
            <h3>👨‍🌾 {farmerName}</h3>
            <div className="product-list-slider"> 
            <div className="product-list">
              {groupedProducts[farmerName].map((product) => (
                
                <div key={product.id} className="product-card">
                  <img
                    src={product.image_url || "https://via.placeholder.com/100"}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      console.warn("Image failed to load for:", product.name);
                      e.target.src = "https://via.placeholder.com/100"}} 
                    />
                  <h4>{product.name}</h4>
                  <p><strong>Price:</strong> ₹{product.price} /kg</p>

                  {/* Quantity Dropdown */}
                  <label>Quantity:</label>
                  <select
                    value={quantityMap[product.id] || ""}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    className="quantity-select"
                  >
                    <option value="" disabled>Select</option>
                    {quantityOptions.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  <button
                    className="buy-btn"
                    onClick={() => {
                      const loggedInUser = localStorage.getItem("loggedInUser");
                      if (!loggedInUser) {
                        alert("Please log in to add items to your cart.");
                        return; // Stop the function execution
                      }
                      handleAddToCart(product, quantityMap[product.id] || "1 kg");
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
              
            </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default FarmersMarket;
