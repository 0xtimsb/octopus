var express = require("express");
var app = express();

var http = require("http").createServer(app);

var io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("message", (msg) => {
    console.log("message: " + msg);
    socket.broadcast.emit("message", msg);
  });
});

http.listen(4000, () => {
  console.log("listening on *:4000");
});
