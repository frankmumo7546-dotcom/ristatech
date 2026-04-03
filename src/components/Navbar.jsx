import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
  return (
    <div style={styles.navbar}>
      
      <div style={styles.left}>
        <img src={logo} alt="logo" style={styles.logo} />
        <span style={styles.title}>Ristatech</span>
      </div>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/packages" style={styles.link}>Packages</Link>
        <Link to="/login" style={styles.link}>Login</Link>
          <Link to="/dashboard">Dashboard</Link>
        <Link to="/register">Register</Link>
      </div>

    </div>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    background: "#0b5ed7",
    color: "white"
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  logo: {
    width: "40px",
    height: "40px",
    objectFit: "cover"
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold"
  },
  links: {
    display: "flex",
    gap: "15px"
  },
  link: {
    color: "white",
    textDecoration: "none"
  }
};

export default Navbar;