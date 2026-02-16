import { Link } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

const Header = () => {

  const { logout } = useAuth();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {

    if (socket.connected) {
      socket.emit("logout", user._id);
      socket.disconnect();
    }

    
    logout();          // clear auth
    navigate("/"); // redirect
  };


 
  return (
    <header style={styles.header}>
      <h2>My Dashboard - {user.name}</h2>
     <nav>
  <Link to="/dashboard">Dashboard</Link> |{" "}
  <Link to="/videos">Videos</Link> |{" "}
  <Link to="/upload">Upload</Link> |{" "}
  <Link to="/chat">Chat</Link> |{" "}
   <Link to="/import">Upload big files</Link> |{" "}
   <Link to="/importcsv">Import CSV</Link> |{" "}
  <button onClick={handleLogout} style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}>
    Logout
  </button>
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
