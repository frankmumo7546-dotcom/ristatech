const express = require("express");
const axios = require("axios");
const moment = require("moment");
const Transaction = require("../models/Transaction");
const User = require("../models/user");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// ================= STK PUSH =================
router.post("/stkpush", auth, async (req, res) => {
  const { phone, amount } = req.body;
  const userId = req.user.id;

  // ✅ ADD THIS VALIDATION HERE
  if (!(phone.startsWith("2547") || phone.startsWith("25411"))) {
    return res.status(400).json({
      error: "Only Safaricom numbers are supported for M-Pesa",
    });
  }

  try {
    const timestamp = moment().format("YYYYMMDDHHmmss");

    const shortcode = "174379";
    const passkey = process.env.PASSKEY;

    console.log("SHORTCODE VALUE:", shortcode);
console.log("TYPE:", typeof shortcode);

    // password for STK
    const password = Buffer.from(
      shortcode + passkey + timestamp
    ).toString("base64");

    // ================= OAUTH TOKEN (FIXED) =================
    const tokenRes = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        auth: {
          username: process.env.CONSUMER_KEY,
          password: process.env.CONSUMER_SECRET,
        },
      }
    );

    const token = tokenRes.data.access_token;

        // callback URL
  const callbackURL =
  process.env.MPESA_CALLBACK_URL ||
  "https://your-default-url/api/payment/callback";

    console.log("TOKEN:", token);
console.log("SHORTCODE:", shortcode);
console.log("PASSKEY:", passkey);
console.log("CALLBACK URL:", callbackURL);


    // STK payload
    const stkData = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: callbackURL,
      AccountReference: "RistaTech Payment",
      TransactionDesc: "STK Push Payment",
    };

    // ================= SEND STK =================
    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      stkData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const checkoutId = response.data.CheckoutRequestID;

    // ================= SAVE TRANSACTION =================
    await Transaction.create({
      user: userId,
      phone,
      amount,
      checkoutId,
      status: "Pending",
    });

    return res.json(response.data);
  } catch (err) {
    console.log("STK ERROR:", err.response?.data || err.message);

    return res.status(500).json({
      error: "STK failed",
      details: err.response?.data || err.message,
    });
  }
});

// ================= CALLBACK =================
router.post("/callback", async (req, res) => {
  try {
    console.log("🔥 CALLBACK RECEIVED:");
    console.log(JSON.stringify(req.body, null, 2));

    const cb = req.body.Body.stkCallback;

    console.log("ResultCode:", cb.ResultCode);
    console.log("ResultDesc:", cb.ResultDesc);

    const checkoutId = cb.CheckoutRequestID;
    const resultCode = cb.ResultCode;

    const items = cb.CallbackMetadata?.Item || [];

    const phone = items.find((i) => i.Name === "PhoneNumber")?.Value;
    const amount = items.find((i) => i.Name === "Amount")?.Value;
    const receipt = items.find(
      (i) => i.Name === "MpesaReceiptNumber"
    )?.Value;

    const transaction = await Transaction.findOne({ checkoutId });

    if (!transaction) {
      return res.json({ message: "Transaction not found" });
    }

    transaction.phone = phone;
    transaction.amount = amount;
    transaction.receipt = receipt;
    transaction.status = resultCode === 0 ? "Success" : "Failed";

    await transaction.save();

    // activate user on success
    if (resultCode === 0) {
      const user = await User.findById(transaction.user);

      if (user) {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 1);

        user.activePackage = true;
        user.packageName = "1GB Daily";
        user.expiryDate = expiry;

        await user.save();
      }
    }

    return res.json({ message: "Callback processed" });
  } catch (err) {
    console.log("Callback error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// ================= TRANSACTION HISTORY =================
router.get("/history", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;