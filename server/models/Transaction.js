const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  phone: String,
  amount: Number,
  status: {
    type: String,
    default: "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Transaction", transactionSchema);