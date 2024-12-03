import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  balances: [
    {
      currencyType: { type: String, required: true }, 
      amount: { type: mongoose.Decimal128, required: true },
    },
  ],
});

export default mongoose.model("Wallet", walletSchema);
