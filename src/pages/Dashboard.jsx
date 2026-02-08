import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/api";
import { Link } from "react-router-dom"; 

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [priceError, setPriceError] = useState("");
  const [images, setImages] = useState([]); // <-- new state for images



 
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;


const fetchProducts = async () => {
  try {
    setLoading(true);

    const res = await api.get(
      `/products?page=${page}&limit=${limit}`
    );

    setProducts(res.data.products);
    setTotalPages(res.data.totalPages);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  fetchProducts();
}, [page]); // re-fetch when page changes




  // OPEN ADD MODAL
  const openAddModal = () => {
    setIsEdit(false);
    setName("");
    setPrice("");
    setDescription("");
    setImages([]); // clear images
    setShowModal(true);
  };

  // OPEN EDIT MODAL
  const openEditModal = (product) => {
    setIsEdit(true);
    setSelectedProduct(product);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setImages([]); // reset images for new upload
    setShowModal(true);
  };

  // SAVE PRODUCT (with images)
  const saveProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);

      // Append multiple images
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      if (isEdit) {
        await api.put(`/products/${selectedProduct._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    }
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Product Dashboard</h1>
        <button className="btn btn-success" onClick={openAddModal}>
          + Add Product
        </button>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
      <>
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
               <th>Desciption</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr key={product._id}>
                  <td>{(page - 1) * limit + index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>₹{product.price}</td>
                  <td>

                   <Link
                    className="btn btn-sm btn-info me-2"
                    to={`/product/${product._id}`}
                  >
                    View
                  </Link>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => openEditModal(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteProduct(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      {/* Pagination Buttons */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{
              margin: "0 5px",
              backgroundColor: page === p ? "blue" : "gray",
              color: "white",
            }}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
      </>


      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEdit ? "Edit Product" : "Add Product"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className={`form-control ${priceError ? "is-invalid" : ""}`}
                    value={price}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPrice(value);
                      if (!value) setPriceError("Price is required");
                      else if (Number(value) <= 0)
                        setPriceError("Price must be greater than 0");
                      else setPriceError("");
                    }}
                  />
                  {priceError && (
                    <div className="invalid-feedback">{priceError}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <input
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Multiple Images Input */}
                <div className="mb-3">
                  <label className="form-label">Images</label>
                  <input
                    type="file"
                    multiple
                    className="form-control"
                    onChange={(e) => setImages(e.target.files)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={saveProduct}
                  disabled={!!priceError || !price}
                >
                  {isEdit ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
