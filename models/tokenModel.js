import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  latestTokens: []
});

export default mongoose.model("Token", tokenSchema);
