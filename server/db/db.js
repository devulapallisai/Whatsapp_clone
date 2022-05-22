const mongoose = require("mongoose");

const connectDB = () => {
  try {
    const conn = mongoose.connect(process.env.MONGODB);
    console.log("Mongoose connected");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
