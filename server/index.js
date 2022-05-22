const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./db/db");

dotenv.config();
connectDB();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("<h1>Hello</h1>");
});

app.listen(PORT, () =>
  console.log(`Your server is running on http://localhost:${PORT}`)
);
