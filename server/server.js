const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());
app.use(cors());

/* =========================
   CORS CONFIG (PRODUCTION SAFE)
========================= */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://ristatechhub.netlify.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow tools like Postman (no origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("❌ Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

/* =========================
   ROUTES
========================= */
app.use("/auth", require("./routes/auth"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/user", require("./routes/user"));

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("🚀 RistaTech API Running Successfully");
});

/* =========================
   DATABASE + SERVER START
========================= */
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ DB CONNECTION ERROR:", err.message);
  }
};

startServer();