const mongoose = require("mongoose");

const DB_URL = process.env.VITE_DB_URL 

const mongoURI = DB_URL;
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

module.exports = mongoose;
