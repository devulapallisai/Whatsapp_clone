const express = require("express");
const app = express();
const dotenv = require("dotenv");
app.use(express.json());
const cors = require("cors");
app.use(cors());
const connectDB = require("./db/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

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

app.use("/api/chat", chatRoutes);

app.use("/api/message", messageRoutes);

const server = app.listen(PORT, () =>
  console.log(`Your server is running on http://localhost:${PORT}`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://whatsappwebclone2022.netlify.app",
    methods: ["GET", "POST"],
    credentials: true,
    "Access-Control-Allow-Origin": "https://whatsappwebclone2022.netlify.app",
    "Access-Control-Allow-Credentials": true,
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log(userData);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    // console.log("User Joined Room: " + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
});
