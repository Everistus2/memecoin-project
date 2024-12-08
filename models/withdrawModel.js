const mongoose = require("mongoose");

const withdrawSchema = new Schema({
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
  from: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const Withdraw = mongoose.model("Withdraw", withdrawSchema);
