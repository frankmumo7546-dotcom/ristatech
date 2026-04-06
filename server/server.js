const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* =========================
   CORS CONFIG (PRODUCTION SAFE)
========================= */

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://ristatechhub.netlify.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow server-to-server / postman requests
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      return callback(null, false);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

/* =========================
   MIDDLEWARE (ORDER IS IMPORTANT)
========================= */

// MUST be first
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options(/.*/, cors(corsOptions));

// Body parser
app.use(express.json());

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

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB CONNECTION ERROR:", err.message);
  });