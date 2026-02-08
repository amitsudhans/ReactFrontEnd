import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; 
import api from "../api/api";
import DashboardLayout from "../layouts/DashboardLayout";



const ViewProduct = () => {
  const { id } = useParams(); // product id from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);


// Async function defined outside useEffect
useEffect(() => {
  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
       setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  fetchProduct();
}, [id]); // only depends on id




  if (loading) return <div>Loading...</div>;
  if (!product) return <p>Product not found</p>;

  return (
     <DashboardLayout>
    <div style={{ maxWidth: "900px", margin: "20px auto", padding: "10px" }}>
      <Link to="/dashboard" className="btn btn-secondary mb-3">
        &larr; Back to Dashboard
      </Link>

      <h1>{product.name}</h1>
      <p>
        <strong>Price:</strong> ₹{product.price}
      </p>
      <p>
        <strong>Description:</strong>{" "}
        {product.description ? product.description : "No description available"}
      </p>

      <h4>Images</h4>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {product.images && product.images.length > 0 ? (
          product.images.map((img, i) => (
            <img
              key={i}
              src={`http://localhost:5000/${img.image.replaceAll("\\", "/")}`}
              alt={`product-${i}`}
              style={{ width: "200px", height: "200px", objectFit: "cover" }}
            />
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>
    </div>
     </DashboardLayout>
  );
};

export default ViewProduct;
