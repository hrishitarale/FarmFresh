import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import "../styles/home.css"; // Use your farmersMarket style
import { toast } from "react-toastify";

function ChoppedVegetables() {
  const [choppedItems, setChoppedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChoppedVegetables = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const allProducts = querySnapshot.docs.map((doc) => doc.data());
        console.log("All Products from Firebase:", allProducts);
        
        const filtered = await Promise.all(
          querySnapshot.docs
            .filter((doc) => {
                const data = doc.data();
                console.log("Checking product", data);
                return data.category?.toLowerCase().trim() === "chopped";
            })
            .map(async (docSnap) => {
              const data = docSnap.data();
              const farmerId = data.farmer_id;
              let farmerName = "";
  
              if (farmerId) {
                try {
                  const farmerDocRef = doc(db, "users", farmerId); // document ID used directly
                  const farmerDoc = await getDoc(farmerDocRef);
                  if (farmerDoc.exists()) {
                    farmerName = farmerDoc.data().name || "";
                  }
                } catch (err) {
                  console.warn("Error fetching farmer name:", err);
                }
              }
  
              return {
                id: docSnap.id,
                ...data,
                farmerName,
                quantity: "500 gm",
              };
            })
        );
        console.log("Filtered Chopped Veggies:", filtered); 
  
        setChoppedItems(filtered);
      } catch (error) {
        console.error("Error fetching chopped veggies:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchChoppedVegetables();
  }, []);  

  const handleQuantityChange = (id, quantity) => {
    setChoppedItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const addToCart = (item) => {
    if (!user) {
      alert("Please login to add products to cart");
      navigate("/login");
      return;
    }
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItem = {
      id: item.id,
      name: item.name,
      image_url: item.image_url,
      price: item.price,
      quantity: item.quantity,
      farmerName: item.farmerName,
    };

    existingCart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(existingCart));
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="home-container">
      <h2>Chopped Vegetables</h2>
      {loading ? (
        <p>Loading chopped vegetables...</p>
      ) : (
        <div className="product-container">
          {choppedItems.map((item) => (
            <div className="product-card" key={item.id}>
              <img src={item.image_url} alt={item.name} />
              <h3>{item.name}</h3>
              <p className="price">Price: ₹{item.price} /Kg</p>
              <p className="farmer-name">By {item.farmerName}</p>
              <select
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
              >
                <option>250 gm</option>
                <option>500 gm</option>
                <option>1 kg</option>
              </select>
              <button onClick={() => addToCart(item)}>Add to Cart</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChoppedVegetables;
