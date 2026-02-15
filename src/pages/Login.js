import { useState } from "react";
import api from "../api/api";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

  if (!email || !password) {
      setError("Email and password are required");
      return;
    }


    if (!email.includes("@")) {
      setError("Invalid email format");
      return;
    }

        if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await api.post("/react/auth/login", { email, password });
      login(res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card shadow" style={{ width: "400px" }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Login</h3>

          {error && (
            <div className="alert alert-danger text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}               
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
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>

          <div className="text-center mt-3">
            <small>
              Don’t have an account?{" "}
              <a href="/register" className="text-decoration-none"> Register
              </a>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
