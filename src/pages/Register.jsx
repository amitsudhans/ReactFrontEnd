import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("react/auth/register", {
        name,
        email,
        password,
      });

      setSuccess("Registration successful. Please login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card shadow" style={{ width: "420px" }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Register</h3>

          {error && (
            <div className="alert alert-danger text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                className="form-control"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button className="btn btn-success w-100">
              Register
            </button>
          </form>

          <div className="text-center mt-3">
            <small>
              Already have an account?{" "}
              <a href="/login" className="text-decoration-none">
                Login
              </a>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
