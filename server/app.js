var express = require("express");
var app = express();
const cors = require("cors");
var http = require("http");
var { Server } = require("socket.io");
const { exit } = require("process");

app.use(cors());

const server = http.createServer(app);

app.get("/", (req, res) => {
  console.log("welcome to home now!");
  res.send("this is your answer");
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const socketIdToRoom = new Map();
const socketIdtoUsername = new Map();

io.on("connection", (socket) => {
  console.log("user connected at " + socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected: ", socketIdToRoom.get(socket.id));
    io.to(socketIdToRoom.get(socket.id)).emit("remove_disconnected_user", {
      room: socketIdToRoom.get(socket.id),
      socketId: socket.id,
      username: socketIdtoUsername.get(socket.id),
    });
  });

  socket.on("join_room", (data) => {
    if (io.sockets.adapter.rooms.get(data.room)) {
      var exitRoom = Math.random().toString();
      socket.join(exitRoom);
      socket.to(data.room).emit("get_users_list", {
        username: data.username,
        room: data.room,
        exitRoom: exitRoom,
      });
    } else {
      var exitRoom = Math.random().toString();
      socket.join(exitRoom);
      io.to(exitRoom).emit("invalid_join_room");
      socket.leave(exitRoom);
    }
  });

  socket.on("disconnect", (data) => {
    var exitRoom = Math.random().toString();
    console.log("exitS");
    io.to(data.room).emit("dleave_room", {
      username: data.username,
      exitRoom: exitRoom,
    });
    socket.leave(data.room);
    socket.join(exitRoom);
  });

  socket.on("userCheck", (data) => {
    if (data.locked) {
      io.to(data.exitRoom).emit("room_locked", data);
      return;
    }
    if (data.vun) {
      io.to(data.exitRoom).emit("join_room_valid", data);
    }
    if (!data.vun) {
      io.to(data.exitRoom).emit("username_already_exist", data);
    }
  });

  socket.on("invalid_leave_exit_room", (data) => {
    socket.leave(data.exitRoom);
  });

  socket.on("control_to_exit_room", (data) => {
    io.to(data.exitRoom).emit("exit_room_user", data);
  });

  socket.on("leave_exit_room", (data) => {
    socket.leave(data.exitRoom);
    socket.join(data.room);
    socketIdToRoom.set(socket.id, data.room);
    socketIdtoUsername.set(socket.id, data.username);
    socket.to(data.room).emit("new_joinee", { ...data, socketId: socket.id });
  });

  socket.on("new_room", (data) => {
    if (!io.sockets.adapter.rooms.get(data.room)) {
      socket.join(data.room);
      socketIdToRoom.set(socket.id, data.room);
      socketIdtoUsername.set(socket.id, data.username);
      console.log("socket id of the creator is: ", socket.id);
      io.to(data.room).emit("create_room_valid", {
        ...data,
        socketId: socket.id,
      });
    } else {
      var exitRoom = Math.random().toString();
      socket.join(exitRoom);
      io.to(exitRoom).emit("invalid_new_room");
      socket.leave(exitRoom);
    }
  });

  socket.on("set_socket_id_self", (data) => {
    console.log(data);
    io.to(data.socketId).emit("set_socket_id_self", data);
  });

  socket.on("update_all", (data) => {
    socket.to(data.room).emit("update_all_states", data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("recieve_message", data);
    // socket.broadcast.emit("recieve_message", data);
  });

  socket.on("start_drawing", (data) => {
    socket.to(data.room).emit("rstart_drawing", data);
  });

  socket.on("draw", (data) => {
    socket.to(data.room).emit("rdraw", data);
  });

  socket.on("toggle_mute_all", (room) => {
    io.to(room).emit("dtoggle_mute_all");
  });

  socket.on("toggle_draw_all", (room) => {
    io.to(room).emit("dtoggle_draw_all");
  });

  socket.on("toggle_chat_all", (room) => {
    io.to(room).emit("dtoggle_chat_all");
  });

  socket.on("toggle_lock_room", (room) => {
    io.to(room).emit("dtoggle_lock_room");
  });

  socket.on("leave_room", (data) => {
    var exitRoom = Math.random().toString();
    io.to(data.room).emit("dleave_room", {
      username: data.username,
      exitRoom: exitRoom,
    });
    socket.leave(data.room);
    socket.join(exitRoom);
  });

  socket.on("leave_room_final", (data) => {
    io.to(data.exitRoom).emit("dleave_room_final", data);
  });

  socket.on("leave_exit_room_end_call", (data) => {
    socket.leave(data.exitRoom);
  });

  socket.on("leave_room_check", (data) => {
    socket.leave(data.room);
    socket.leave(data.exitRoom);
  });

  socket.on("end_call_all", (data) => {
    io.to(data.room).emit("dend_call_all", { data });
  });

  socket.on("get_remote_socket_id", (data) => {
    socket.to(data.room).emit("socket_id_request", { data });
  });

  socket.on("sent_socket_id", (data) => {
    console.log(data);
    io.to(data.data.requestingUser).emit("set_remote_socket_ids", { data });
  });

  console.log(`Socket Connected`, socket.id);

  socket.on("user:call", ({ to, offer }) => {
    socket.broadcast.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });

  socket.on("send:offer", ({ offer, room }) => {
    socket.broadcast
      .to(room)
      .emit("set:remote:description", {
        newUserOffer: offer,
        newUser: socket.id,
      });
  });

  socket.on("set:remote:answer", ({ ans, newUser, username }) => {
    socket.to(newUser).emit("set:remote:answer", { ans, username });
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  });
});

server.listen(3001, () => {
  console.log("server is running on 3001");
});
