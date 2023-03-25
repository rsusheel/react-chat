import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Home.css";
import { useSelector, useDispatch } from "react-redux";
import {
  joinRoom,
  leaveRoom,
  updateRoomInfo,
  createRoom,
  updateAllState,
} from "../redux";

import { usePeer } from "./WebRTC/Peer";

function Home(props) {
  const socket = props.socket;

  const dispatch = useDispatch();
  const users = useSelector((state) => state.universal.users);
  const creator = useSelector((state) => state.personal.creator);
  const uniData = useSelector((state) => state.universal);
  const pdata = useSelector((state) => state.personal);

  const [username, setUsername] = useState("");
  const [newRoom, setNewRoom] = useState("");
  const [newRoomTitle, setNewRoomTitle] = useState("");
  const [room, setRoom] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  const { peer, createOffer, createAnswer, setRemoteAnswer, sendStream, remoteStream } = usePeer()

  const singleEffect = useRef(true);

  useEffect(() => {
    if (singleEffect.current) {
      socket.on("new_joinee", (data) => {
        dispatch(updateRoomInfo({ username: data.username }));
      });

      socket.on("update_all_state", (data) => {
        dispatch(updateAllState(data));
      });

      socket.on("create_room_valid", (data) => {
        dispatch(createRoom({ username: data.username, room: data.room, roomTitle: data.roomTitle }));
      });

      socket.on("room_locked", (data)=>{
        setErrorMsg("The room is locked!");
      })

      socket.on("join_room_valid", (data) => {
        dispatch(joinRoom({ username: data.username, room: data.room }));
        socket.emit("control_to_exit_room", data);
      });

      socket.on("exit_room_user", (data) => {
        socket.emit("leave_exit_room", data);
      });

      socket.on("invalid_new_room", () => {
        setErrorMsg("Room already exist!");
      });

      socket.on("invalid_join_room", () => {
        setErrorMsg("Room doesn't exist!");
      });

      socket.on("username_already_exist", (data) => {
        setErrorMsg("Username already exist!");
        socket.emit("invalid_leave_exit_room", data);
      });





      socket.on("incoming-call", async data => {
        const ans = await createAnswer(data.offer)
        console.log('remote and local desc is set')
        console.log(data)
        socket.emit("call-accepted", {...data, answer: ans})
      })

      socket.on("call-accepted-res", async data => {
        console.log('setting remote desc')
        await setRemoteAnswer(data.answer)
        console.log("call got accepted")
      })







      singleEffect.current = false;
    }
  }, [socket]);

  useEffect(() => {
    pdata.room === ""
      ? (document.getElementsByClassName("homepage")[0].style.display = "block")
      : (document.getElementsByClassName("homepage")[0].style.display = "none");
  }, [pdata.room]);

  useEffect(() => {
    if (pdata.creator) {
      const func = (data) => {
        var vun = true;
        for (let i = 0; i < uniData.users.length; i++) {
          if (data.username === uniData.users[i]) {
            vun = false;
            break;
          }
        }
        socket.emit("userCheck", {
          exitRoom: data.exitRoom,
          vun: vun,
          room: data.room,
          username: data.username,
          locked: uniData.locked,
        });
      };
      socket.on("get_users_list", func);
      return () => socket.off("get_users_list", func);
    }
  }, [socket, uniData]);

  useEffect(() => {
    if (creator) {
      socket.emit("update_all", uniData);
    }
  }, [users]);

  const changeUsername = (e) => {
    setUsername(e.target.value);
  };

  const changeNewRoom = (e) => {
    setNewRoom(e.target.value);
  };

  const changeNewRoomTitle = (e) => {
    setNewRoomTitle(e.target.value);
  };

  const changeRoom = (e) => {
    setRoom(e.target.value);
  };

  const createRoomBtn = (e) => {
    if (newRoom === "" && username === "") {
      setErrorMsg("Please enter valid details");
    } else if (username === "") {
      setErrorMsg("Username cannot be empty!");
    } else if (newRoom === "") {
      setErrorMsg("Please enter room name!");
    } else {
      socket.emit("new_room", { username: username, room: newRoom, roomTitle: newRoomTitle });
    }

    // dispatch(createRoom({ username: username, room: newRoom }));
    setUsername("");
    setNewRoom("");
    setNewRoomTitle("");
    setRoom("");
  };

  const joinRoomBtn = async (e) => {
    e.preventDefault();
    if (username === "" && room === "") {
      setErrorMsg("Please enter valid details!");
    } else if (room === "") {
      setErrorMsg("Please enter room name!");
    } else if (username === "") {
      setErrorMsg("Username cannot be empty!");
    } else {
      socket.emit("join_room", { username: username, room: room });
      const offer = await createOffer()
      socket.emit("call-room", { room: room, offer: offer})
      console.log('local desc is set')
    }

    // dispatch(joinRoom({ username, room }));
    setUsername("");
    setNewRoom("");
    setNewRoomTitle("");
    setRoom("");
  };

  const handleNegotation = () => {
    const localOffer = peer.localDescription
    socket.emit("call-room", {room: room, offer: localOffer})
  }

  useEffect(()=>{
    peer.addEventListener('negotiationneeded', handleNegotation)

    return () => {
      peer.removeEventListener('negotiationneeded', handleNegotation)
    }
  }, [peer, handleNegotation])

  return (
    <div className="homepage">
      <div className="homepage-inner">
        <div className="home-title">Collab</div>
        <div className="enter-username">
          <div className="home-username-title">Username</div>
          <input
            className="home-username home-input"
            type="text"
            onChange={changeUsername}
            placeholder="Enter your name..."
            value={username}
          />
        </div>

        <div className="enter-joinroom">
          <div className="home-joinroom-title room-input-title">Join Room</div>
          <input
            className="home-joinroom home-input"
            type="text"
            onChange={changeRoom}
            placeholder="Room Name"
            value={room}
          />
          <button
            className="home-joinroom-btn home-btn"
            type="submit"
            onClick={joinRoomBtn}
          >
            Join
          </button>
        </div>

        <div className="enter-createroom">
          <div className="home-createroom-title room-input-title">
            Create Room
          </div>
          <div className="createroom-outer">
            <div className="createroom-inner">
              <input
                className="home-createroom home-input"
                type="text"
                onChange={changeNewRoom}
                placeholder="Room Name"
                value={newRoom}
              />
              <input
                className="home-createroom-title home-input"
                type="text"
                onChange={changeNewRoomTitle}
                placeholder="Room Title (Optional)"
                value={newRoomTitle}
              />
            </div>
            <button
              className="home-createroom-btn home-btn"
              type="submit"
              onClick={createRoomBtn}
            >
              Create
            </button>
          </div>
        </div>

        {errorMsg === "" ? (
          <div></div>
        ) : (
          <div className="home-error-msg">
            <div></div>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.0996 4.89998C15.1996 0.999976 8.79961 0.999976 4.89961 4.89998C0.999609 8.79998 0.999609 15.2 4.89961 19.1C8.79961 23 15.0996 23 18.9996 19.1C22.8996 15.2 22.9996 8.79998 19.0996 4.89998V4.89998ZM14.7996 16.2L11.9996 13.4L9.19961 16.2L7.79961 14.8L10.5996 12L7.79961 9.19998L9.19961 7.79998L11.9996 10.6L14.7996 7.79998L16.1996 9.19998L13.3996 12L16.1996 14.8L14.7996 16.2V16.2Z"
                fill="rgba(255, 22, 22, 0.7)"
              />
            </svg>
            {errorMsg}
            <div></div>
          </div>
        )}
      </div>
    </div>
    
  );
}

export default Home;
