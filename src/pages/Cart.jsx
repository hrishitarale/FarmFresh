import { useEffect, useState } from "react";
import { db, collection, addDoc } from "../firebase";
import "../styles/cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [deliverySlot, setDeliverySlot] = useState("Morning");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!storedUser) {
      alert("Please log in to see your cart");
      window.location.href="/login";
      return;
      
    }
    setUser(storedUser);
    const savedCart = (JSON.parse(localStorage.getItem(`cart_${storedUser.uid}`)) || []).map(item => {
      let weightFactor = 1;
      if (item.weight) {
        const match = item.weight.match(/(\d+)\s?kg/);
        if (match) {
          weightFactor = parseInt(match[1]);
        } else if (item.weight === "500 gm") {
          weightFactor = 0.5;
        }
      }
      return {
        ...item,
        weightFactor,
      };
    });
    setCartItems(savedCart);
  }, []);

  const updateQuantity = (productId, weightLabel, delta) => {
    const updatedItems = cartItems.map((item) => {
      if (item.id === productId && item.weightLabel === weightLabel) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updatedItems);
    localStorage.setItem(`cart_${user.uid}`, JSON.stringify(updatedItems));
  };

  const removeItem = (productId, weightLabel) => {
    const updatedItems = cartItems.filter(item => !(item.id === productId && item.weightLabel === weightLabel));
    setCartItems(updatedItems);
    localStorage.setItem(`cart_${user.uid}`, JSON.stringify(updatedItems));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.weightFactor * item.quantity, 0);

  const deliveryCharge = totalPrice >= 200 ? 0 : 20;
  const finalPrice = totalPrice + deliveryCharge;

  const handleCheckout = async () => {
    
    let finalDeliveryDate = deliveryDate;
    let finalDeliveryTime = deliveryTime;
    let finalSlot = deliverySlot;
  
    // If user has not selected a delivery date or time, auto-calculate
    if (!deliveryDate || !deliveryTime) {
      const now = new Date();
      const currentHour = now.getHours();
  
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
  
      const today = new Date(now);
  
      if (currentHour < 16) {
        // Today Evening
        finalDeliveryDate = today.toISOString().split("T")[0];
        finalDeliveryTime = "17:00"; // Default 5 PM
        finalSlot = "Evening";
      } else {
        // Tomorrow Morning
        finalDeliveryDate = tomorrow.toISOString().split("T")[0];
        finalDeliveryTime = "09:00"; // Default 9 AM
        finalSlot = "Morning";
      }
    }
  
    try {
      await addDoc(collection(db, "orders"), {
        user_id: user.email,
        user_name: user.name,
        user_address: user.address,
        items: cartItems,
        total_price: finalPrice,
        delivery_charge: deliveryCharge,
        order_date: new Date(),
        delivery_date: new Date(finalDeliveryDate),
        delivery_time: finalDeliveryTime,
        delivery_slot: finalSlot
      });
  
      localStorage.removeItem(`cart_${user.uid}`);
      setCartItems([]);
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order.");
    }
        
  };  

  return (
    <div className="cart-container-new">
      <div className="cart-left">
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="cart-card">
              <img src={item.image_url} alt={item.name} className="cart-img" />
              <div className="cart-details">
                <h4>{item.name}</h4>
                <p>₹{item.price} per kg</p>
                <div className="qty-controls">
                  <button onClick={() => updateQuantity(item.id, item.weightLabel, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.weightLabel, 1)}>+</button>
                </div>
                <p>Selected: {item.weightLabel || `${item.quantity} kg`}</p>
                <p>Subtotal: ₹{(item.price * item.weightFactor * item.quantity).toFixed(2)}</p>

                <button className="remove-btn" onClick={() => removeItem(item.id, item.weightLabel)}>Remove</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cart-right">
        <div className="cart-delivery">
          <h3>Schedule Delivery</h3>
          <p style={{ fontStyle: "italic", color: "gray" }}>
  (Optional – if skipped, system will auto-assign)
</p>
          <p><strong>Deliver to:</strong> {user?.address || "No address found"}</p>

          <label>Select Date:</label>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className="delivery-date-input"
          />

          <label>Select Slot:</label>
          <select value={deliverySlot} onChange={(e) => setDeliverySlot(e.target.value)}>
            <option value="Morning">Morning (8 AM – 12 PM)</option>
            <option value="Evening">Evening (4 PM – 8 PM)</option>
          </select>
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <p>Items Total: ₹{totalPrice}</p>
          <p>Delivery Charge: ₹{deliveryCharge} {deliveryCharge === 0 && <span>(Free)</span>}</p>
          <hr />
          <h4>Total Payable: ₹{finalPrice}</h4>
          <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
