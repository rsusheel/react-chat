import React, { useState, useEffect } from "react";
import "./Home.css";
import { useSelector, useDispatch } from "react-redux";
import {
  joinRoom,
  leaveRoom,
  updateRoomInfo,
  createRoom,
  updateAllState,
  updateSocketIds,
  userLeftSocketIds,
} from "../redux";
import peer from "./WebRTC/peer";

function Home(props) {
  const socket = props.socket;
  const dispatch = useDispatch();
  const users = useSelector((state) => state.universal.users);
  const creator = useSelector((state) => state.personal.creator);
  const uniData = useSelector((state) => state.universal);
  const pdata = useSelector((state) => state.personal);
  const socketIds = useSelector((state) => state.personal.socketIds)

  const [username, setUsername] = useState("");
  const [newRoom, setNewRoom] = useState("");
  const [newRoomTitle, setNewRoomTitle] = useState("");
  const [room, setRoom] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [peerConnections, setPeerConnections] = useState(new Map([]));
  const [socketId, setSocketId] = useState("");

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

  //Socket events functions - START

  const newJoinee = (data) => {
    dispatch(updateRoomInfo({ username: data.username }));
    dispatch(updateSocketIds({ socketId: data.socketId }));
    console.log("new joineee");
    console.log(data);
    socket.emit("set_socket_id_self", { socketId: data.socketId });
  };

  const updateAllStates = (data) => {
    dispatch(updateAllState(data));
  };

  const createRoomValid = (data) => {
    dispatch(
      createRoom({
        username: data.username,
        room: data.room,
        roomTitle: data.roomTitle,
      })
    );
    socket.emit("set_socket_id_self", { socketId: data.socketId });
  };

  const setSocketIdSelf = (data) => {
    console.log("setting socket id");
    setSocketId(data.socketId);
  };

  const roomLocked = (data) => {
    setErrorMsg("The room is locked!");
  };

  const joinRoomValid = (data) => {
    dispatch(joinRoom({ username: data.username, room: data.room }));
    socket.emit("control_to_exit_room", data);
  };

  const exitRoomUser = (data) => {
    socket.emit("leave_exit_room", data);
  };

  const invalidNewRoom = () => {
    setErrorMsg("Room already exist!");
  };

  const invalidJoinRoom = () => {
    setErrorMsg("Room doesn't exist!");
  };

  const usernameAlreadyExist = (data) => {
    setErrorMsg("Username already exist!");
    socket.emit("invalid_leave_exit_room", data);
  };

  const removeDisconnectedUser = (data) => {
    dispatch(leaveRoom({ username: data.username }));
    dispatch(userLeftSocketIds({ socketId: data.socketId }));
  };

  const getUsersList = (data) => {
    if (pdata.creator) {
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
    }
  };

  const socketIdRequest = (data) => {
    socket.emit("sent_socket_id", { ...data, socketId: socketId });
  };

  const setRemoteSocketIds = (data) => {
    dispatch(updateSocketIds({ socketId: data.data.socketId }));
    console.log("all socket ids receiveddd");
  };

  //Socket events functions - END

  useEffect(() => {
    socket.on("new_joinee", newJoinee);
    socket.on("update_all_states", updateAllStates);
    socket.on("create_room_valid", createRoomValid);
    socket.on("set_socket_id_self", setSocketIdSelf);
    socket.on("room_locked", roomLocked);
    socket.on("join_room_valid", joinRoomValid);
    socket.on("exit_room_user", exitRoomUser);
    socket.on("invalid_new_room", invalidNewRoom);
    socket.on("invalid_join_room", invalidJoinRoom);
    socket.on("username_already_exist", usernameAlreadyExist);
    socket.on("remove_disconnected_user", removeDisconnectedUser);
    socket.on("get_users_list", getUsersList);
    socket.on("socket_id_request", socketIdRequest);
    socket.on("set_remote_socket_ids", setRemoteSocketIds);

    return () => {
      socket.off("new_joinee", newJoinee);
      socket.off("update_all_states", updateAllStates);
      socket.off("create_room_valid", createRoomValid);
      socket.off("set_socket_id_self", setSocketIdSelf);
      socket.off("room_locked", roomLocked);
      socket.off("join_room_valid", joinRoomValid);
      socket.off("exit_room_user", exitRoomUser);
      socket.off("invalid_new_room", invalidNewRoom);
      socket.off("invalid_join_room", invalidJoinRoom);
      socket.off("username_already_exist", usernameAlreadyExist);
      socket.off("remove_disconnected_user", removeDisconnectedUser);
      socket.off("get_users_list", getUsersList);
      socket.off("socket_id_request", socketIdRequest);
      socket.off("set_remote_socket_ids", setRemoteSocketIds);
    };
  }, [
    socket,
    newJoinee,
    updateAllStates,
    createRoomValid,
    setSocketIdSelf,
    roomLocked,
    joinRoomValid,
    exitRoomUser,
    invalidNewRoom,
    invalidJoinRoom,
    usernameAlreadyExist,
    removeDisconnectedUser,
    getUsersList,
    socketIdRequest,
    setRemoteSocketIds,
  ]);

  useEffect(() => {
    pdata.room === ""
      ? (document.getElementsByClassName("homepage")[0].style.display = "block")
      : (document.getElementsByClassName("homepage")[0].style.display = "none");
  }, [pdata.room]);

  useEffect(() => {
    if (creator) {
      socket.emit("update_all", uniData);
    }
  }, [users]);

  useEffect(() => {
    socket.emit("get_remote_socket_id", {
      requestingUser: socketId,
      room: pdata.room,
    });
  }, [socketId]);

  const createRoomBtn = (e) => {
    if (newRoom === "" && username === "") {
      setErrorMsg("Please enter valid details");
    } else if (username === "") {
      setErrorMsg("Username cannot be empty!");
    } else if (newRoom === "") {
      setErrorMsg("Please enter room name!");
    } else {
      socket.emit("new_room", {
        username: username,
        room: newRoom,
        roomTitle: newRoomTitle,
      });
    }
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
      await socket.emit("join_room", { username: username, room: room });
      console.log("sending offer");
    }
    setUsername("");
    setNewRoom("");
    setNewRoomTitle("");
    setRoom("");
  };

  /* -----------------------------WebRTC------------------------------ */

  // creates a new RTCPeerConnection object and returns same
  const createRTCPeerConnection = () => {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478",
          ],
        },
      ],
    })
    return peer;
  }

  // create a offer from RTCPeerConnection object, sets local description with the offer created and returns the offer
  const createOfferAndSetLocalDescription = async (peer) => {
    const offer = await peer.createOffer()
    await peer.setLocalDescription(new RTCSessionDescription(offer))
    return offer
  }

  // sets the remote answer received from the user
  const setRemoteAnswer = async (peer, ans) => {
    await peer.setRemoteDescription(new RTCSessionDescription(ans))
  }

  // sets the remote description for the peer object, creates answer for it and returns the answer
  const setRemoteDescriptionAndCreateAnswer = async (offer, peer) => {
    await peer.setRemoteDescription(offer)
    const ans = await peer.createAnswer()
    return ans
  }

  const initiateRTCConnection = () => {
    console.log('logging socket ids')
    console.log(socketIds)
    socketIds.forEach(async function(value,index){
      const peer = createRTCPeerConnection()
      const peerMap = new Map(peerConnections)
      peerMap.set(value,peer)
      setPeerConnections(peerMap)
      const offer = await createOfferAndSetLocalDescription(peer)
      await socket.emit('send_offer_to_users', {offer, source: socketId, target: value})
    })
  }

  useEffect(()=>{
    initiateRTCConnection()
  },[socketIds])

  useEffect(()=>{
    socket.on('set_remote_offer_send_answer', async (data)=>{
      const peer = createRTCPeerConnection()
      const peerMap = new Map(peerConnections)
      peerMap.set(data.source,peer)
      setPeerConnections(peerMap)
      const ans = await setRemoteDescriptionAndCreateAnswer(data.offer, peer)
      socket.emit('send_answer_to_user', {...data, answer: ans})
    })
    socket.on('set_remote_answer', (data) => {
      setRemoteAnswer(peerConnections.get(data.target), data.answer)
    })
    return () => {
      socket.off('set_remote_ofer_send_answer')
      socket.off('set_remote_answer')
    }
  },[socket])

  /* ---------------------------WebRTC-END---------------------------- */

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
