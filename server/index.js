const express = require("express");
const app = express();
const dotenv = require("dotenv");
app.use(express.json());
const cors = require("cors");
app.use(cors());
const connectDB = require("./db/db");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
connectDB();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("<h1>Hello</h1>");
});

app.get("/api", (req, res) => {
  res.send("<p>Here we are have api for whatsapp clone backend</p>");
});

app.use("/api/user", userRoutes);

app.listen(PORT, () =>
  console.log(`Your server is running on http://localhost:${PORT}`)
);
