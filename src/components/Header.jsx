import { Link } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router-dom";

const Header = () => {

  const { logout } = useAuth();
  const navigate = useNavigate();

    const handleLogout = () => {
    logout();          // clear auth
    navigate("/login"); // redirect
  };

  
  return (
    <header style={styles.header}>
      <h2>My Dashboard</h2>
      <nav>
        <Link to="/dashboard">Dashboard</Link> |{" "}
        <Link to="/videos">Videos</Link> |{" "}
        <Link to="/upload">Upload</Link>
        <Link  onClick={handleLogout}>Logout</Link>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    padding: "15px",
    background: "#1e293b",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
  },
};

export default Header;
