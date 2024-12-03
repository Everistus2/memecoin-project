import mongoose from "mongoose";

const tokenListSchema = new mongoose.Schema({
  latestTokens: []
});

export default mongoose.model("Token", tokenListSchema);
