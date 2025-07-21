const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // frontend URL
    methods: ["GET", "POST"],
  },
});

let documentContent = "";

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.emit("receive-changes", documentContent);

  socket.on("send-changes", (newContent) => {
    documentContent = newContent;
    socket.broadcast.emit("receive-changes", newContent);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
