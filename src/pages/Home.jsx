import { useEffect, useState } from "react";
import "../styles/home.css";
import { Link } from "react-router-dom";
import { db } from "../firebase"; // make sure this path is correct
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";

function Home() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsWithFarmer = await Promise.all(
          querySnapshot.docs.map(async (docSnap) => {
            const productData = docSnap.data();
            const farmerRef = productData.farmer_id;
            let farmerName = "Unknown Farmer";

            try {
              const farmerDoc = await getDoc(doc(db, "users", farmerRef));
              if (farmerDoc.exists()) {
                const farmerData = farmerDoc.data();
                farmerName = farmerData.name || farmerName;
              }
            } catch (err) {
              console.warn("Failed to fetch farmer", err);
            }

            return {
              id: docSnap.id,
              ...productData,
              farmerName,
            };
          })
        );

        setProducts(productsWithFarmer);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
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
  
    const itemIndex = existingCart.findIndex(
      (item) => item.id === product.id && item.weightLabel === quantityLabel
    );
  
    if (itemIndex !== -1) {
      alert("Item already in cart with the same quantity");
    } else {
      existingCart.push({ 
        ...product, 
        quantity, 
        weightLabel: quantityLabel 
      });
      localStorage.setItem(cartKey, JSON.stringify(existingCart));
      alert("Added to cart!");
    }
  }; 

  const handleQuantityChange = (productId, value) => {
    setQuantities((prev) => ({ ...prev, [productId]: value }));
  };


  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <h1>Fresh & Organic Produce, Direct from Farmers</h1>
        <p>FarmFresh connects farmers, customers, and businesses to provide fresh vegetables and fruits at the best prices.</p>
        <Link to="/register" className="cta-button">Get Started</Link>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Our Key Features</h2>
        <div className="feature-grid">
          <div className="feature-item">
            <img src="/images/farmer.png" alt="Farmers" />
            <h3>For Farmers</h3>
            <p>Register, list, and manage your products easily.</p>
          </div>
          <div className="feature-item">
            <img src="/images/customer.png" alt="Customers" />
            <h3>For Customers</h3>
            <p>Browse and order fresh vegetables and fruits.</p>
          </div>
          <div className="feature-item">
            <img src="/images/bulkOrder.png" alt="Businesses & Hotels" />
            <h3>Bulk Orders</h3>
            <p>Special discounts for businesses and hotels.</p>
          </div>
          <div className="feature-item">
            <img src="/images/chopped.png" alt="Chopped Vegetables" />
            <h3>Pre-Chopped Veggies</h3>
            <p>Save time with pre-chopped vegetables.</p>
          </div>
          <div className="feature-item">
            <img src="/images/delivery.png" alt="Scheduled Delivery" />
            <h3>Scheduled Delivery</h3>
            <p>Plan and schedule your deliveries in advance.</p>
          </div>
          <div className="feature-item">
            <img src="/images/forum.png" alt="Community Forum" />
            <h3>Community Forum</h3>
            <p>Farmers & experts share knowledge and tips.</p>
          </div>
        </div>
      </section>

      {/* Product Listing Section */}
      <section className="product-listing">
        <h2>Fresh Produce From Our Farmers</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="product-slider">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <img src={product.image_url} alt={product.name} />
                <h3>{product.name}</h3>
                <p className="price">Price: ₹{product.price} /Kg</p>
                <p className="farmer-name">By {product.farmerName}</p>
                <label>
                  Quantity:
                  <select
                    value={quantities[product.id] || "1 kg"}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                  >
                    <option value="500 gm">500 gm</option>
                    <option value="1 kg">1 kg</option>
                    <option value="2 kg">2 kg</option>
                  </select>
                </label>
                <button className="add-to-cart" onClick={() => handleAddToCart(product, quantities[product.id])}>
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>1. Sign Up</h3>
            <p>Farmers, customers & businesses create accounts.</p>
          </div>
          <div className="step">
            <h3>2. List & Browse</h3>
            <p>Farmers list products, and customers browse.</p>
          </div>
          <div className="step">
            <h3>3. Place Orders</h3>
            <p>Customers and businesses place their orders.</p>
          </div>
          <div className="step">
            <h3>4. Secure Payment</h3>
            <p>Pay via UPI, Card, or Cash on Delivery.</p>
          </div>
          <div className="step">
            <h3>5. Delivery</h3>
            <p>Get fresh produce delivered to your doorstep.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section
      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-grid">
          <div className="testimonial">
            <p>"FarmFresh has helped me reach more customers and sell my produce efficiently!"</p>
            <h4>- Ramesh, Farmer</h4>
          </div>
          <div className="testimonial">
            <p>"Ordering fresh vegetables has never been easier. I love the scheduled delivery option!"</p>
            <h4>- Priya, Customer</h4>
          </div>
          <div className="testimonial">
            <p>"As a restaurant owner, I save a lot by ordering in bulk. Great service!"</p>
            <h4>- Raj, Business Owner</h4>
          </div>
        </div>
      </section> */}

      {/* Call to Action */}
      <section className="cta">
        <h2>Join FarmFresh Today</h2>
        <p>Support local farmers and get fresh, organic produce delivered to you.</p>
        <Link to="/register" className="cta-button">Sign Up Now</Link>
      </section>
    </div>
  );
}

export default Home;
