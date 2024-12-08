const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  chainId: {type: String, required: true},
  name: {type: String},
  symbol: {type: String},
  tokenAddress: {type: String, required: true},
  timeStamp: {type: Date, required: true}
});

module.exports = mongoose.model("Token", tokenSchema);
