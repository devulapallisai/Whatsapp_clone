const mongoose = require("mongoose");

const chatModalSchema = mongoose.Schema({
  chatName: {
    type: String,
    trim: true,
  },
  isGroupchat: Boolean,
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
  groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  grpImage: {
    type: String,
    default:
      "https://imgs.search.brave.com/EK02tuos8b2SxHpUpDI4XnqIQKvn6DRXe2UVykEMpDY/rs:fit:900:900:1/g:ce/aHR0cDovL3d3dy5l/bW1lZ2kuY28udWsv/d3AtY29udGVudC91/cGxvYWRzLzIwMTkv/MDEvVXNlci1JY29u/LmpwZw",
  },
});

chatModalSchema.set("timestamps", true);

const Chat = mongoose.model("Chat", chatModalSchema);
module.exports = Chat;
