const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* =========================
   REGISTER USER
========================= */
exports.register = async (req, res) => {
  console.log("🟢 REGISTER CONTROLLER STARTED");

  const { email, password } = req.body;

  try {
    console.log("📩 REGISTER DATA:", { email });

    // check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("❌ USER ALREADY EXISTS");
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    console.log("✅ USER CREATED:", user.email);

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        email: user.email,
      },
    });

  } catch (err) {
    console.log("🔥 REGISTER ERROR FULL:", err);
    console.log("🔥 REGISTER ERROR MESSAGE:", err.message);

    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};


/* =========================
   LOGIN USER
========================= */
exports.login = async (req, res) => {
  console.log("🟡 LOGIN CONTROLLER STARTED");

  const { email, password } = req.body;

  try {
    console.log("📩 LOGIN DATA:", { email });

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ USER NOT FOUND");
      return res.status(400).json({ message: "User not found" });
    }

    console.log("👤 USER FOUND:", user.email);

    // check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("❌ INVALID PASSWORD");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("🔐 PASSWORD MATCHED");

    // check JWT secret
    if (!process.env.JWT_SECRET) {
      console.log("❌ JWT_SECRET NOT FOUND IN ENV");
      return res.status(500).json({
        message: "JWT secret missing in environment",
      });
    }

    // create token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("🔐 JWT CREATED SUCCESSFULLY");

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });

  } catch (err) {
    console.log("🔥 LOGIN ERROR FULL:", err);
    console.log("🔥 LOGIN ERROR MESSAGE:", err.message);
    console.log("🔥 LOGIN STACK:", err.stack);

    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};