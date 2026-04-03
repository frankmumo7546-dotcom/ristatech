import { useState } from "react";
import api from "../api";

function Packages() {
  const [phone, setPhone] = useState("");

  const buyPackage = async (price) => {
    if (!phone) {
      alert("Enter phone number");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to pay");
        return;
      }

      const response = await api.post(
        "/api/payment/stkpush",
        {
          phone,
          amount: price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("STK response", response.data);
      alert("STK Push sent ✅");
    } catch (err) {
      const message =
        err.response?.data?.error || err.response?.data?.message || err.message;
      alert("Payment failed ❌ " + message);
      console.error("Payment error", err.response?.data || err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Packages</h2>
      <p>Select a package to subscribe. Payments via M-Pesa.</p>

      {/* PHONE INPUT */}
      <input
        placeholder="Enter phone (2547XXXXXXXX)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={styles.input}
      />

      {/* DATA BUNDLES */}
      <h3>Data Bundles</h3>
      <div style={styles.grid}>
        <Card price={19} text="1 GB — 1 hour" onBuy={buyPackage} />
        <Card price={20} text="250 MB — 24 hours" onBuy={buyPackage} />
        <Card price={49} text="350 MB — 7 days" onBuy={buyPackage} />
        <Card price={50} text="1.5 GB — 3 hours" onBuy={buyPackage} />
        <Card price={55} text="1.25 GB — till midnight" onBuy={buyPackage} />
        <Card price={99} text="1 GB — 24 hours" onBuy={buyPackage} />
        <Card price={300} text="2.5 GB — 7 days" onBuy={buyPackage} />
        <Card price={700} text="6 GB — 7 days" onBuy={buyPackage} />
      </div>

      {/* MINUTES */}
      <h3>Minutes Deals</h3>
      <div style={styles.grid}>
        <Card price={22} text="45 mins — 3 hours" onBuy={buyPackage} />
        <Card price={51} text="50 mins — till midnight" onBuy={buyPackage} />
        <Card price={100} text="100 mins — 7 days" onBuy={buyPackage} />
        <Card price={250} text="200 mins — 7 days" onBuy={buyPackage} />
        <Card price={500} text="500 mins — 7 days" onBuy={buyPackage} />
      </div>

      {/* SMS */}
      <h3>SMS Deals</h3>
      <div style={styles.grid}>
        <Card price={5} text="20 SMS — 24 hours" onBuy={buyPackage} />
        <Card price={10} text="200 SMS — 1 day" onBuy={buyPackage} />
        <Card price={30} text="1000 SMS — 7 days" onBuy={buyPackage} />
        <Card price={101} text="1500 SMS — 30 days" onBuy={buyPackage} />
        <Card price={200} text="3500 SMS — 30 days" onBuy={buyPackage} />
      </div>

      {/* MONTHLY */}
      <h3>Monthly Deals</h3>
      <div style={styles.grid}>
        <Card price={249} text="1.2 GB — 30 days" onBuy={buyPackage} />
        <Card price={500} text="2.5 GB — 30 days" onBuy={buyPackage} />
        <Card price={500} text="300 mins — 30 days" onBuy={buyPackage} />
        <Card price={999} text="8 GB + 400 mins — 30 days" onBuy={buyPackage} />
        <Card price={1000} text="800 mins — 30 days" onBuy={buyPackage} />
        <Card price={1001} text="10 GB — 30 days" onBuy={buyPackage} />
      </div>
      <section style={{ textAlign: "center", marginTop: "20px", color: "#555",fontSize:"25px" }}>
        Need any assistance?Reach out to us through our contact page.
      </section>
      <div style={{ display: "flex",background: "#4fc3f7", gap: "20px", justifyContent: "center" }}>
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

/* CARD COMPONENT */
function Card({ price, text, onBuy }) {
  return (
    <div style={styles.card}>
      <h3>Ksh {price}</h3>
      <p>{text}</p>
      <button onClick={() => onBuy(price)} style={styles.button}>
        Buy
      </button>
    </div>
  );
}

/* STYLES */
const styles = {
  input: {
    padding: "10px",
    width: "100%",
    marginBottom: "20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "15px",
    marginBottom: "30px",
  },

  card: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    textAlign: "center",
  },

  button: {
    marginTop: "10px",
    padding: "8px 12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Packages;