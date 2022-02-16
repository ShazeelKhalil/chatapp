const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const PORT = process.env.PORT || 5000;
var cors = require("cors");
// var corsOptions = {
//   origin: "http//:localhost:5000",
//   optionsSuccessStatus: 200,
// };

const router = require("./router");
const { addUser, removeUser, getUser, getUserInRoom } = require("./users");
const { isPromise } = require("util/types");

const app = express(); // to run the app

const server = http.createServer(app); //creating server
const io = socketio(server, {
  cors: {
    origin: "*",
  },
}); // intializing io objct for server

io.on("connection", (socket) => {
  console.log("connection is on !!!!");

  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) return callback(error);

    socket.join(user.room);

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to the room ${user.room}`,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined!!` });

    socket.join(user.room);

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUserInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUserInRoom(user.room),
    });
    callback();
  });
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    console.log("user had left");

    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left.`,
      });
    }
  });
});

app.use(router);

server.listen(PORT, () => console.log(`server is running on port: ${PORT}`));
