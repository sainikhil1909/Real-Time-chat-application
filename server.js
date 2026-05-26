const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname)));
io.on("connection", function (socket) {

  socket.on("newuser", function (username) {
    // ✅ FIX: added space before "joined" and "left"
    socket.broadcast.emit("update", username + " joined the conversation");
    console.log(username + " joined the conversation");
  });

  socket.on("exituser", function (username) {
    socket.broadcast.emit("update", username + " left the conversation");
    console.log(username + " left the conversation");
  });

  socket.on("chat", function (message) {
    socket.broadcast.emit("chat", message);
    console.log("Chat from " + message.username + ": " + message.text);
  });

});

server.listen(5000, function () {
  console.log("Server running on http://localhost:5000");
});
