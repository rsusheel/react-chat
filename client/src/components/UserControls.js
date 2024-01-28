import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./UserControls.css";
import { toggleLockRoom, leaveRoom, leaveRoomUpdateInfo } from "../redux";

function UserControls(props) {
  const data = useSelector((state) => state.personal);
  const uniData = useSelector((state) => state.universal);
  const dispatch = useDispatch();

  const socket = props.socket;

  const singleEffect = useRef(true);
  useEffect(() => {
    if (singleEffect.current) {
      socket.on("dtoggle_lock_room", () => {
        dispatch(toggleLockRoom());
      });

      socket.on("dleave_room", (info)=>{
        var username=info.username
        dispatch(leaveRoom({username}))
        socket.emit("leave_room_final", info)
      })

      socket.on("dleave_room_final", info=>{
        var exitRoom = info.exitRoom
        dispatch(leaveRoomUpdateInfo({exitRoom}))
        socket.emit("leave_exit_room_end_call", info)
      })
      singleEffect.current = false;
    }
  }, [socket]);

  const lockRoomBtn = (e) => {
    socket.emit("toggle_lock_room", {room: data.room, roomLocked: uniData.locked});
  };

  const leaveCallBtn = (e) => {
    socket.emit("leave_room", {room: data.room, username: data.username})
  }

  const hideMenu = (e) => {
    document.getElementsByClassName("users-bar")[0].style.right = "-330px";
    document.getElementsByClassName("main-form")[0].style.width = "100%";
    document.getElementsByClassName("main-form")[0].style.right = "0px";
  }

  return (
    <div className="user-controls">
      <div>React Chat</div>
      <div className="user-controls-btns">

      {data.creator ? (
          uniData.locked ? (
            <div onClick={lockRoomBtn} className="user-controls-btn">
              <svg
                height="19"
                viewBox="0 0 14 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.8 7H11V4.6C11 1.703 9.665 0 7 0C4.334 0 3 1.703 3 4.6V7H1C0.447 7 0 7.646 0 8.199V16C0 16.549 0.428 17.139 0.951 17.307L2.148 17.694C2.7829 17.8791 3.43892 17.9819 4.1 18H9.9C10.5608 17.9821 11.2166 17.8789 11.851 17.693L13.047 17.306C13.571 17.139 14 16.549 14 16V8.199C14 7.646 13.352 7 12.8 7ZM9 7H5V4.199C5 2.754 5.797 2 7 2C8.203 2 9 2.754 9 4.199V7Z"
                  fill="red"
                />
              </svg>
            </div>
          ) : (
            <div onClick={lockRoomBtn} className="user-controls-btn">
              <svg
                height="19"
                viewBox="0 0 14 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.8 7H11V4.6C11 1.703 9.665 0 7 0C4.334 0 3 1.703 3 4.6V5H5V4.199C5 2.754 5.797 2 7 2C8.203 2 9 2.754 9 4.199V7H1C0.447 7 0 7.646 0 8.199V16C0 16.549 0.428 17.139 0.951 17.307L2.148 17.694C2.7829 17.8791 3.43892 17.9819 4.1 18H9.9C10.5608 17.9821 11.2166 17.8789 11.851 17.693L13.047 17.306C13.571 17.139 14 16.549 14 16V8.199C14 7.646 13.352 7 12.8 7Z"
                  fill="rgb(160, 141, 235)"
                />
              </svg>
            </div>
          )
        ) : uniData.locked ? (
          <div className="user-controls-btn">
            <svg
              height="19"
              viewBox="0 0 14 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.8 7H11V4.6C11 1.703 9.665 0 7 0C4.334 0 3 1.703 3 4.6V7H1C0.447 7 0 7.646 0 8.199V16C0 16.549 0.428 17.139 0.951 17.307L2.148 17.694C2.7829 17.8791 3.43892 17.9819 4.1 18H9.9C10.5608 17.9821 11.2166 17.8789 11.851 17.693L13.047 17.306C13.571 17.139 14 16.549 14 16V8.199C14 7.646 13.352 7 12.8 7ZM9 7H5V4.199C5 2.754 5.797 2 7 2C8.203 2 9 2.754 9 4.199V7Z"
                fill="rgb(160, 141, 235)"
              />
            </svg>
          </div>
        ) : (
          <div></div>
        )}

        <div onClick={leaveCallBtn} className="user-controls-btn">
          <svg
            height="31"
            viewBox="0 0 37 37"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M33.8398 20.0293L33.5346 21.628C33.2494 23.125 31.8495 24.1302 30.2647 23.9775L27.1104 23.6723C25.7353 23.5397 24.5636 22.5623 24.2136 21.258L23.2408 17.6274C21.7994 17.037 20.2115 16.7672 18.4771 16.818C16.8068 16.854 15.1607 17.2246 13.6363 17.908L13.0335 21.3074C12.8038 22.5962 11.7416 23.5567 10.3941 23.6923L7.25839 24.0068C5.6936 24.1641 4.19202 23.1682 3.74802 21.6789L3.2701 20.0802C2.79681 18.4892 3.21922 16.815 4.38318 15.6849C7.12735 13.0178 11.7061 11.6797 18.1148 11.6704C24.5328 11.6627 29.2518 12.9932 32.2735 15.6602C33.5454 16.7826 34.1389 18.4445 33.8383 20.0293H33.8398Z"
              fill="red"
            />
          </svg>
        </div>

        <div onClick={hideMenu} className="user-controls-btn hide-menu-btn">
          <svg 
            fill="rgb(160, 141, 235)"
            width="24px" 
            height="24px" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16.707,18.707a1,1,0,0,1-1.414-1.414L19.586,13H2a1,1,0,0,1,0-2H19.586L15.293,6.707a1,1,0,0,1,1.414-1.414l6,6a1,1,0,0,1,0,1.414Z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default UserControls;
