const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  privateKey: {type: String, required: true},
  address: {type: String, requried: true}, 
  balances: [
    {
      token: { type: mongoose.Schema.Types.ObjectId, ref: "Token", required: true  }, 
      amount: { type: Number},
    },
  ],
});

module.exports = mongoose.model("Wallet", walletSchema);
