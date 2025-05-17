import { useState } from "react";
import "../styles/scheduledDelivery.css";

function ScheduledDelivery() {
  const [scheduledDeliveries, setScheduledDeliveries] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [cart, setCart] = useState({});

  const products = [
    { id: 1, name: "Tomatoes", price: 30, image: "/images/tomatoes.jpg" },
    { id: 2, name: "Carrots", price: 50, image: "/images/carrots.jpg" },
    { id: 3, name: "Onions", price: 40, image: "/images/onions.jpg" },
    { id: 4, name: "Potatoes", price: 20, image: "/images/potatoes.jpg" },
  ];

  const timeSlots = ["10:00 AM - 12:00 PM", "2:00 PM - 4:00 PM", "6:00 PM - 8:00 PM"];

  const handleQuantityChange = (id, quantity) => {
    setCart({ ...cart, [id]: quantity });
  };

  const handleSchedule = () => {
    if (!selectedDate || !selectedTimeSlot || Object.keys(cart).length === 0) {
      alert("Please select products, date, and time slot before scheduling!");
      return;
    }

    const scheduledItems = products
      .filter((product) => cart[product.id] > 0)
      .map((product) => ({
        id: Date.now() + product.id,
        name: product.name,
        quantity: cart[product.id],
        date: selectedDate,
        time: selectedTimeSlot,
      }));

    setScheduledDeliveries([...scheduledDeliveries, ...scheduledItems]);
    setSelectedDate("");
    setSelectedTimeSlot("");
    setCart({});
  };

  const handleCancel = (id) => {
    setScheduledDeliveries(scheduledDeliveries.filter((item) => item.id !== id));
  };

  return (
    <div>
    <h2>Schedule Your Delivery</h2>
    <div className="product-catalog">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h4>{product.name}</h4>
            <p>₹{product.price}/kg</p>
            <input
              type="number"
              min="0"
              placeholder="Qty (kg)"
              value={cart[product.id] || ""}
              onChange={(e) => handleQuantityChange(product.id, e.target.value)}
            />
          </div>
        ))}
      </div>

    <div className="scheduled-delivery-container">

      <div className="schedule-options">
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        <select value={selectedTimeSlot} onChange={(e) => setSelectedTimeSlot(e.target.value)}>
          <option value="">Select Time Slot</option>
          {timeSlots.map((slot, index) => (
            <option key={index} value={slot}>{slot}</option>
          ))}
        </select>
        <button onClick={handleSchedule}>Schedule Delivery</button>
      </div>

      {scheduledDeliveries.length > 0 && (
        <div className="scheduled-list">
          <h3>Upcoming Deliveries</h3>
          {scheduledDeliveries.map((item) => (
            <div key={item.id} className="delivery-card">
              <p><strong>Product:</strong> {item.name}</p>
              <p><strong>Quantity:</strong> {item.quantity} kg</p>
              <p><strong>Date:</strong> {item.date}</p>
              <p><strong>Time Slot:</strong> {item.time}</p>
              <button className="cancel-btn" onClick={() => handleCancel(item.id)}>Cancel</button>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}

export default ScheduledDelivery;
