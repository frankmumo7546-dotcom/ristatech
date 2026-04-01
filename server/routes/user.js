const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middleware/authMiddleware");

// GET CURRENT USER
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ AUTO-EXPIRE PACKAGE
    if (user.expiryDate && user.expiryDate < new Date()) {
      user.activePackage = false;
      user.packageName = "";
      user.expiryDate = null;
      await user.save();
    }

    res.json({
      name: user.name,
      email: user.email,
      activePackage: user.activePackage,
      packageName: user.packageName,
      expiryDate: user.expiryDate,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;