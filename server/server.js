const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/user", require("./routes/user"));

// test route
app.get("/", (req, res) => {
  res.send("Full Auth + Payment System Running 🚀");
});

const PORT = process.env.PORT || 3000;

// ✅ START SERVER ONLY AFTER DB CONNECTS
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on ${PORT}`);
    });

  } catch (err) {
    console.log("❌ DB CONNECTION ERROR:", err.message);
  }
};

startServer();