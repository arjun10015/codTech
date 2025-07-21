// server/index.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.get("/", (req, res) => {
  res.send("Socket.IO Chat Server is running...");
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    console.log(`Client says: ${data.message}`);

    // Send to other clients
    socket.broadcast.emit("receive_message", {
      message: data.message,
      from: "User"
    });

    // Send a reply from the server bot
    socket.emit("receive_message", {
      message: "🧠 Server received your message!",
      from: "Server Bot"
    });

    console.log("Server reply sent.");
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING ON http://localhost:3001");
});
