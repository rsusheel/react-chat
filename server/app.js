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

  socket.on("transfer_chat", (data) => {
    io.to(data.newUser).emit("set_old_chat", data)
  })

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
  });

  socket.on("toggle_lock_room", (data) => {
    io.to(data.room).emit("dtoggle_lock_room", data);
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

  socket.on('send_offer_to_users', (data) => {
    socket.to(data.target).emit('set_remote_offer_send_answer', data)
  })
  
  socket.on('send_answer_to_user', (data)=>{
    socket.to(data.source).emit('set_remote_answer', data)
  })

});

server.listen(3001, () => {
  console.log("server is running on 3001");
});
