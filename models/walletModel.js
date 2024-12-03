import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  privateKey: {type: String, required: true},
  address: {type: String, requried: true}, 
  balances: [
    {
      currencyType: { type: String }, 
      amount: { type: mongoose.Decimal128},
    },
  ],
});

export default mongoose.model("Wallet", walletSchema);
