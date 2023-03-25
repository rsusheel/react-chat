var express = require("express");
var app = express();
var cors = require("cors");
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
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("user connected at " + socket.id);

  socket.on("join_room", (data) => {
    if (io.sockets.adapter.rooms.get(data.room)) {
      var exitRoom = Math.random().toString();
      socket.join(exitRoom);
      socket.to(data.room).emit("get_users_list", {
        username: data.username,
        room: data.room,
        exitRoom: exitRoom,
      });
    }else{
      var exitRoom = Math.random().toString();
      socket.join(exitRoom);
      io.to(exitRoom).emit("invalid_join_room")
      socket.leave(exitRoom)
    }
  });

  socket.on("disconnect", (data) => {
    var exitRoom = Math.random().toString();
    console.log("exitS")
    io.to(data.room).emit("dleave_room", {
      username: data.username,
      exitRoom: exitRoom,
    });
    socket.leave(data.room);
    socket.join(exitRoom);
  });

  socket.on("userCheck", (data) => {
    if(data.locked){
      io.to(data.exitRoom).emit("room_locked", data);
      return;
    }
    if (data.vun) {
      io.to(data.exitRoom).emit("join_room_valid", data);
    } if(!data.vun){
      io.to(data.exitRoom).emit("username_already_exist", data)
    }
  });

  socket.on("invalid_leave_exit_room", data=>{
    socket.leave(data.exitRoom)
  })

  socket.on("control_to_exit_room", (data) => {
    io.to(data.exitRoom).emit("exit_room_user", data);
  });

  socket.on("leave_exit_room", (data) => {
    socket.leave(data.exitRoom);
    socket.join(data.room);
    socket.to(data.room).emit("new_joinee", data);
  });

  socket.on("new_room", (data) => {
    if (!io.sockets.adapter.rooms.get(data.room)) {
      socket.join(data.room);
      io.to(data.room).emit("create_room_valid", data);
    }else{
      var exitRoom = Math.random().toString();
      socket.join(exitRoom)
      io.to(exitRoom).emit("invalid_new_room")
      socket.leave(exitRoom)
    }
  });

  socket.on("update_all", (data) => {
    socket.to(data.room).emit("update_all_state", data);
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

  socket.on("end_call_all", (data)=>{
    io.to(data.room).emit("dend_call_all", {data});
  });







  socket.on("call-room", (data)=>{
    io.to(data.room).emit("incoming-call", {...data, socketId: socket.id})
  })

  socket.on("call-accepted", (data) => {
    io.to(data.socketId).emit("call-accepted-res", data)
  })








});

server.listen(3001, () => {
  console.log("server is running on 3001");
});
