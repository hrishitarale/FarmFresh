import { useEffect, useState } from "react";
import { db, collection, query, where, getDocs, addDoc } from "../firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

import { Cloudinary } from "@cloudinary/url-gen/index";
import "../styles/farmerHome.css";

function FarmerHome() {
    const [farmerDetails, setFarmerDetails] = useState(null);
    const [products, setProducts]= useState([]);
    const [orders, setOrders] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [imageFile, setImageFile] = useState(null); // ✅ Store uploaded image
    const [editingProductId, setEditingProductId] = useState(null);
const [editProductData, setEditProductData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    image_url: ""
});

    const cloudName = "dd6czd3md";
    const cloudinary = new Cloudinary({
        cloud: {
            cloudName: cloudName
        }
    });
    //upload image to cloudinary
    const showUploadWidget = () => {
        window.cloudinary.openUploadWidget(
          {
            cloudName: cloudName,
            uploadPreset: "product-image",
            sources: ["local", "camera", "url"],
            cropping: false,
            multiple: false,
          },
          (error, result) => {
            if (!error && result && result.event === "success") {
              console.log("Upload Success:", result.info.secure_url);
              setNewProduct({ ...newProduct, image_url: result.info.secure_url });
              alert("Image uploaded successfully!");
            } else if (error) {
              console.error("Upload Error:", error);
              alert("Failed to upload image.");
            }
          }
        );
      };
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        stock: "",
        category: "",
        description: ""
    });
    const handleEditClick = (product) => {
        setEditingProductId(product.id);
        setEditProductData({ ...product });
    };
    
    const handleEditInputChange = (e) => {
        setEditProductData({
            ...editProductData,
            [e.target.name]: e.target.value
        });
    };
    
    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            const productRef = doc(db, "products", editingProductId);
            await updateDoc(productRef, {
                ...editProductData,
                price: Number(editProductData.price),
                stock: Number(editProductData.stock)
            });
    
            const updatedProducts = products.map((p) =>
                p.id === editingProductId ? { ...editProductData, id: editingProductId } : p
            );
            setProducts(updatedProducts);
            setEditingProductId(null);
            alert("Product updated successfully!");
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Failed to update product.");
        }
    };
    const handleDeleteProduct = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this product?");
        if (!confirm) return;
    
        try {
            await deleteDoc(doc(db, "products", id));
            setProducts(products.filter((p) => p.id !== id));
            alert("Product deleted successfully!");
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product.");
        }
    };

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!loggedInUser || loggedInUser.userType !== "farmer") return;

        setFarmerDetails(loggedInUser);

        const fetchProducts = async () => {
            const q = query(collection(db, "products"), where("farmer_id", "==", loggedInUser.id));
            const querySnapshot = await getDocs(q);
            const productData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productData);
        };

        const fetchOrders = async () => {
            const q = query(collection(db, "bulkOrders"), where("farmer_id", "==", loggedInUser.id));
            const querySnapshot = await getDocs(q);
            const orderData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setOrders(orderData);
        };

        fetchProducts();
        fetchOrders();
    }, []);

    const handleInputChange = (e) => {
        setNewProduct({
            ...newProduct,
            [e.target.name]: e.target.value,
        });
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();

        if (!newProduct.image_url) {
            alert("Please select an image!");
            return;
        }
        
        try {
            //add products        
            const docRef = await addDoc(collection(db, "products"), {
                ...newProduct,
                price: Number(newProduct.price),
                stock: Number(newProduct.stock),
                farmer_id: farmerDetails.id,
                image_url: newProduct.image_url, 
            });

            console.log("Product added with ID:", docRef.id);

            const addedProduct = { id: docRef.id, ...newProduct, image_url: newProduct.image_url };
            setProducts([...products, addedProduct]);

            // Reset form
            setShowAddForm(false);
            setNewProduct({ name: "", price: "", stock: "", category: "", image_url: "" });
            setImageFile(null);
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Failed to add product."+ error.message);
        }
    };

    if (!farmerDetails) return <p>Loading farmer dashboard...</p>;

    return (
        <div className="farmer-dashboard">
            <nav className="navbar">
                <h2>Farmer Dashboard</h2>
                <a href="/farmer-orders">Orders</a>
                <a href="/CommunityForum">Community Forum</a>
            </nav>

            <div className="dashboard-content">
                <section className="personal-details">
                    <h3>Personal Details</h3>
                    <p><strong>Name:</strong> {farmerDetails.name}</p>
                    <p><strong>Email:</strong> {farmerDetails.email}</p>
                    <p><strong>Contact:</strong> {farmerDetails.contact}</p>
                </section>

                <section className="product-section">
                    <h3>My Products</h3>
                    <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>
                        {showAddForm ? "Close Form" : "+ Add Product"}
                    </button>

                    {showAddForm && (
                        <form className="add-product-form" onSubmit={handleAddProduct}>
                            <input type="text" name="name" placeholder="Product Name" value={newProduct.name} onChange={handleInputChange} required />
                            <input type="number" name="price" placeholder="Price per Kg" value={newProduct.price} onChange={handleInputChange} required />
                            <input type="number" name="stock" placeholder="Stock (in Kg)" value={newProduct.stock} onChange={handleInputChange} required />
                            <input type="text" name="category" placeholder="Category" value={newProduct.category} onChange={handleInputChange} required />
                            <button type="button" onClick={showUploadWidget}>
                                Upload Product Image
                            </button>
                            {newProduct.image_url && (
      <img src={newProduct.image_url} alt="Product Preview" style={{ width: '100px', marginTop: '10px' }} />
    )}

                            <button type="submit">Submit</button>
                        </form>
                    )}

                    <div className="product-list">
                        {products.map((product) => (
                            <div key={product.id} className="product-card">
                                {editingProductId === product.id ? (
                                    <form onSubmit={handleUpdateProduct}>
                                        <input
                                            type="text"
                                            name="name"
                                            value={editProductData.name}
                                            onChange={handleEditInputChange}
                                            required
                                        />
                                        <input
                                            type="number"
                                            name="price"
                                            value={editProductData.price}
                                            onChange={handleEditInputChange}
                                            required
                                        />
                                        <input
                                            type="number"
                                            name="stock"
                                            value={editProductData.stock}
                                            onChange={handleEditInputChange}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="category"
                                            value={editProductData.category}
                                            onChange={handleEditInputChange}
                                            required
                                        />
                                        <button type="submit">Save</button>
                                        <button type="button" onClick={() => setEditingProductId(null)}>Cancel</button>
                                    </form>
                                ) : (
                                    <>
                                        <h4>{product.name}</h4>
                                        <p>Price: ₹{product.price}/kg</p>
                                        <p>Stock: {product.stock}kg</p>
                                        <p>Category: {product.category}</p>
                                        <img src={product.image_url} alt={product.name} style={{ width: "100px" }} />
                                        <button className="edit-btn" onClick={() => handleEditClick(product)}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                                    </>
                                )}
                    </div>
        ))}
</div>
                </section>

            </div>
        </div>
    );
}

export default FarmerHome;
