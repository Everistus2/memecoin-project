const mongoose = require("mongoose");

const depositSchema = new Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: {
    type: String,
    required: true,
  },
  amount: {
    type: mongoose.Decimal128,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const Deposit = mongoose.model("Deposit", depositSchema);
