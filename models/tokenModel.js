const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  latestTokens: []
});

module.exports = mongoose.model("Token", tokenSchema);
