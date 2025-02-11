const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const cors = require("cors");
const fetchAndSaveLatestTokens = require('./app.js');

const authRoutes = require('./routes/authRoutes.js')
const userRoutes = require('./routes/userRoutes.js')

dotenv.config();
connectDB();
fetchAndSaveLatestTokens();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT}`
  );
});