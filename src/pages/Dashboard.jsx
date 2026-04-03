import { useState, useEffect } from "react";
import api from "../api";

function Dashboard() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  // ================= FETCH USER =================
  const fetchUser = async () => {
    try {
      const res = await api.get("/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
    } catch (err) {
      console.log("User fetch error:", err);
    }
  };

  // ================= FETCH TRANSACTIONS =================
  const fetchTransactions = async () => {
    try {
      const res = await api.get("/payment/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTransactions(res.data);
    } catch (err) {
      console.log("Transaction error:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
      fetchTransactions();
    }
  }, []);

  // ================= SEND STK PUSH =================
  const pay = async () => {
    if (!phone || !amount) {
      return alert("Enter phone and amount");
    }

    try {
      await api.post(
        "/payment/stkpush",
        { phone, amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("📲 STK Push sent! Check your phone");

      setTimeout(() => {
        fetchTransactions();
        fetchUser(); // refresh status after payment
      }, 5000);
    } catch (err) {
      alert("Payment failed");
    }
  };

  return (
    <div style={styles.container}>
      {/* ================= NOT LOGGED IN ================= */}
      {!token ? (
        <div style={styles.centerBox}>
          <h2>🔐 Access Restricted</h2>

          <p>
            Login to your account or create one if you don’t have one in order
            to access the dashboard.
          </p>

          <div>
            <a href="/login" style={styles.linkButton}>
              Login
            </a>
            <a href="/register" style={styles.linkButton}>
              Register
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* ================= DASHBOARD ================= */}
          <h2 style={styles.header}>Dashboard</h2>

          <div style={styles.grid}>
            {/* ================= USER STATUS ================= */}
            <div style={styles.card}>
              <h3>User Status</h3>

              {!user ? (
                <p>Loading...</p>
              ) : user.activePackage ? (
                <>
                  <p style={styles.success}>✅ Active Package</p>
                  <p><strong>{user.packageName}</strong></p>
                  <p>Expires: {user.expiryDate}</p>
                </>
              ) : (
                <p style={styles.error}>❌ No Active Package</p>
              )}
            </div>

            {/* ================= PAYMENT ================= */}
            <div style={styles.card}>
              <h3>Make Payment</h3>

              <input
                style={styles.input}
                placeholder="Phone (2547XXXXXXXX)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <input
                style={styles.input}
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <button
                style={{
                  ...styles.button,
                  background: user?.activePackage ? "#999" : "#4fc3f7",
                  cursor: user?.activePackage ? "not-allowed" : "pointer",
                }}
                onClick={pay}
                disabled={user?.activePackage}
              >
                {user?.activePackage ? "Package Active" : "Pay Now"}
              </button>
            </div>

            {/* ================= HISTORY ================= */}
            <div style={styles.card}>
              <h3>Transaction History</h3>

              {transactions.length === 0 ? (
                <p>No transactions yet</p>
              ) : (
                <div style={styles.table}>
                  {transactions.map((t, i) => (
                    <div key={i} style={styles.row}>
                      <span>{t.phone}</span>
                      <span>Ksh {t.amount}</span>
                      <span
                        style={{
                          color:
                            t.status === "Success" ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ================= STYLES =================
const styles = {
  container: {
    padding: "30px",
    background: "#0b1c2c",
    minHeight: "100vh",
    color: "white",
  },

  header: {
    marginBottom: "20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "white",
    color: "#000",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },

  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  table: {
    marginTop: "10px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #eee",
  },

  success: {
    color: "green",
    fontWeight: "bold",
  },

  error: {
    color: "red",
    fontWeight: "bold",
  },

  centerBox: {
    textAlign: "center",
    marginTop: "120px",
  },

  linkButton: {
    display: "inline-block",
    margin: "10px",
    padding: "10px 20px",
    background: "#4fc3f7",
    color: "black",
    textDecoration: "none",
    borderRadius: "5px",
    fontWeight: "bold",
  },
};

export default Dashboard;