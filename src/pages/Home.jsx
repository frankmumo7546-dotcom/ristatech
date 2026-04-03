import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>


      <h1 style={styles.title}>Ristatech Data Solutions</h1>

      <h2 style={styles.subtitle}>Welcome back! <br/>Your one stop shop for reliable data services.Fast,secure and reliable</h2> 

      <p style={styles.text}>
        Login or create account if you don’t have one
      </p>

      <div style={styles.buttons}>
        <button style={styles.btn} onClick={() => navigate("/login")}>
          Login
        </button>

        <button style={styles.btnOutline} onClick={() => navigate("/register")}>
          Create Account
        </button>

        <button style={styles.btnOutline} onClick={() => navigate("/packages")}>
          Available Packages
        </button>
      </div>

      <section>Contact us</section>
      <p>Have questions or need assistance? Reach out to us!</p>
      <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
        <button style={styles.btn} onClick={() => window.location.href = "mailto:info@ristatech.com"}> 
          Email Us
        </button>
        <button style={styles.btn} onClick={() => window.location.href = "tel:+254792690598"}>
          Call Us
        </button>
        <button style={styles.btn} onClick={() => window.location.href = "https://wa.me/254792690598"}>
          WhatsApp Us
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#0b1c2c",
    color: "white",
    textAlign: "center",
  },
  title: {
    fontSize: "40px",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "24px",
    marginBottom: "10px",
    color: "#4fc3f7",
  },
  text: {
    marginBottom: "20px",
    color: "#ccc",
  },
  buttons: {
    display: "flex",
    gap: "15px",
  },
  btn: {
    padding: "10px 20px",
    background: "#4fc3f7",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
  btn: {
  padding: "10px 20px",
  background: "#4fc3f7",
  border: "none",
  cursor: "pointer",
  borderRadius: "5px",
  fontWeight: "bold",
  transition: "0.3s",
},
  btnOutline: {
    padding: "10px 20px",
    background: "transparent",
    border: "1px solid #4fc3f7",
    color: "white",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default Home;