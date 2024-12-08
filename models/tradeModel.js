const mongoose = require("mongoose");

const TradeModel = new Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  baseToken: {
    type: String,
    required: true,
  },
  baseAmount: {
    type: String,
    required: true,
  },
  quoteToken: {
    type: String,
    rquired: true,
  },
  quoteAmount: {
    type: String,
    required: true,
  },
  wallet: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const Trade = mongoose.model("Swap", TradeModel);
