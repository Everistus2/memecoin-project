import mongoose from "mongoose";

const txSchema = new Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const depositSchema = new Schema({
  ...txSchema.obj,
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
});

const withdrawSchema = new Schema({
  ...txSchema.obj,
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
});

const tradeSchema = new Schema({
  ...txSchema.obj,
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
});

export const Deposit = mongoose.model("Deposit", depositSchema);
export const Withdraw = mongoose.model("Withdraw", withdrawSchema);
export const Trade = mongoose.model("Trade", tradeSchema);
