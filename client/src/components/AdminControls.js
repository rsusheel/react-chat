import React, { useEffect, useRef } from "react";
import "./AdminControls.css";
import {useSelector} from 'react-redux'

function Controls(props) {
  const socket = props.socket;
  const data = useSelector((state) => state.personal);
  const uniData = useSelector((state) => state.universal);

  const toggleMuteAllBtn = (e) => {
    socket.emit("toggle_mute_all", data.room);
  };

  const toggleDrawBtn = (e) => {
    socket.emit("toggle_draw_all", data.room);
  };

  const toggleChatBtn = (e) => {
    socket.emit("toggle_chat_all", data.room);
  };

  const endCallForAll = (e) => {
    socket.emit("end_call_all", data.room);
  };

  const singleEffect = useRef(true);
  useEffect(() => {
    if (singleEffect.current) {
      socket.on("dend_call_all", (info)=>{
        socket.emit("leave_room", {room: info.room, username: data.username})
      })
      singleEffect.current = false;
    }
  }, [socket]);

  return (
    <div>
      <div className="admin-controls">
        Admin Controls
        <div className="admin-ctrl-btn">
          {uniData.allMute ? (
            <svg
              onClick={toggleMuteAllBtn}
              className="all-control-btn all-control-btn-dis"
              height="21"
              viewBox="0 0 29 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.75049 13.9853V16C8.75049 17.4918 9.34312 18.9226 10.398 19.9775C11.4529 21.0324 12.8836 21.625 14.3755 21.625C14.9001 21.625 15.4172 21.5517 15.9131 21.4108L8.75049 13.9853ZM17.3394 22.8895C16.412 23.2885 15.4046 23.5 14.3755 23.5C12.3864 23.5 10.4787 22.7098 9.07219 21.3033C7.66566 19.8968 6.87549 17.9891 6.87549 16V14.125C6.87549 13.8764 6.77672 13.6379 6.6009 13.4621C6.42509 13.2863 6.18663 13.1875 5.93799 13.1875C5.68935 13.1875 5.45089 13.2863 5.27508 13.4621C5.09926 13.6379 5.00049 13.8764 5.00049 14.125V16C5.00046 18.3241 5.86371 20.5654 7.42276 22.289C8.98182 24.0126 11.1255 25.0957 13.438 25.3281V29.125H7.81299C7.56435 29.125 7.32589 29.2238 7.15008 29.3996C6.97426 29.5754 6.87549 29.8139 6.87549 30.0625C6.87549 30.3111 6.97426 30.5496 7.15008 30.7254C7.32589 30.9012 7.56435 31 7.81299 31H20.938C21.1866 31 21.4251 30.9012 21.6009 30.7254C21.7767 30.5496 21.8755 30.3111 21.8755 30.0625C21.8755 29.8139 21.7767 29.5754 21.6009 29.3996C21.4251 29.2238 21.1866 29.125 20.938 29.125H15.313V25.3281C16.5103 25.2078 17.6625 24.8594 18.7116 24.3121L17.3394 22.8895ZM22.6952 20.3214L21.3018 18.8768C21.677 17.9736 21.8755 16.997 21.8755 16V14.125C21.8755 13.8764 21.9743 13.6379 22.1501 13.4621C22.3259 13.2863 22.5643 13.1875 22.813 13.1875C23.0616 13.1875 23.3001 13.2863 23.4759 13.4621C23.6517 13.6379 23.7505 13.8764 23.7505 14.125V16C23.7505 17.5159 23.3833 18.9966 22.6952 20.3214ZM19.8347 17.3558L8.79587 5.91171C8.95293 4.68295 9.51267 3.53287 10.398 2.64752C11.4529 1.59263 12.8836 1 14.3755 1C15.8673 1 17.2981 1.59263 18.353 2.64752C19.4079 3.70242 20.0005 5.13316 20.0005 6.625V16C20.0005 16.4609 19.9439 16.9159 19.8347 17.3558Z"
              />
              <line
                x1="1.28964"
                y1="1.96892"
                x2="27.7896"
                y2="29.9689"
                stroke="rgba(160, 141, 235, 0.63)"
                stroke-width="3"
              />
            </svg>
          ) : (
            <svg
              onClick={toggleMuteAllBtn}
              className="all-control-btn"
              height="21"
              viewBox="0 0 19 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3.75 5.625C3.75 4.13316 4.34263 2.70242 5.39752 1.64752C6.45242 0.592632 7.88316 0 9.375 0C10.8668 0 12.2976 0.592632 13.3525 1.64752C14.4074 2.70242 15 4.13316 15 5.625V15C15 16.4918 14.4074 17.9226 13.3525 18.9775C12.2976 20.0324 10.8668 20.625 9.375 20.625C7.88316 20.625 6.45242 20.0324 5.39752 18.9775C4.34263 17.9226 3.75 16.4918 3.75 15V5.625Z" />
              <path d="M0.9375 12.1875C1.18614 12.1875 1.4246 12.2863 1.60041 12.4621C1.77623 12.6379 1.875 12.8764 1.875 13.125V15C1.875 16.9891 2.66518 18.8968 4.0717 20.3033C5.47822 21.7098 7.38588 22.5 9.375 22.5C11.3641 22.5 13.2718 21.7098 14.6783 20.3033C16.0848 18.8968 16.875 16.9891 16.875 15V13.125C16.875 12.8764 16.9738 12.6379 17.1496 12.4621C17.3254 12.2863 17.5639 12.1875 17.8125 12.1875C18.0611 12.1875 18.2996 12.2863 18.4754 12.4621C18.6512 12.6379 18.75 12.8764 18.75 13.125V15C18.75 17.3241 17.8868 19.5654 16.3277 21.289C14.7687 23.0126 12.625 24.0957 10.3125 24.3281V28.125H15.9375C16.1861 28.125 16.4246 28.2238 16.6004 28.3996C16.7762 28.5754 16.875 28.8139 16.875 29.0625C16.875 29.3111 16.7762 29.5496 16.6004 29.7254C16.4246 29.9012 16.1861 30 15.9375 30H2.8125C2.56386 30 2.3254 29.9012 2.14959 29.7254C1.97377 29.5496 1.875 29.3111 1.875 29.0625C1.875 28.8139 1.97377 28.5754 2.14959 28.3996C2.3254 28.2238 2.56386 28.125 2.8125 28.125H8.4375V24.3281C6.12503 24.0957 3.98133 23.0126 2.42227 21.289C0.86322 19.5654 -2.91969e-05 17.3241 7.40637e-10 15V13.125C7.40637e-10 12.8764 0.0987722 12.6379 0.274588 12.4621C0.450403 12.2863 0.68886 12.1875 0.9375 12.1875Z" />
            </svg>
          )}
          {uniData.drawEnabled ? (
            <svg
              onClick={toggleDrawBtn}
              className="all-control-btn"
              height="21"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M23.4375 13.1701L11.5826 25.0199L9.85921 23.2966L10.0371 23.1187H7.69361C7.24625 23.1187 6.88023 22.7527 6.88023 22.3053V19.9618L6.70281 20.1397C6.46236 20.3837 6.28596 20.6786 6.18988 21.0039L5.02167 24.9793L8.995 23.81C9.2746 23.7135 9.6152 23.5355 9.85921 23.2966L11.5826 25.0199C11.0539 25.5486 10.3981 25.9401 9.68129 26.1485L3.56421 27.9481C3.13617 28.0752 2.67305 27.9583 2.35736 27.5973C2.04167 27.3279 1.92363 26.8653 2.0496 26.4332L3.84889 20.3176C4.06037 19.6008 4.44824 18.945 4.97744 18.4164L16.8288 6.56346L23.4375 13.1701ZM27.0468 4.95756C28.3177 6.22794 28.3177 8.28985 27.0468 9.56074L24.5864 12.0212L17.9777 5.41355L20.4382 2.9531C21.7091 1.6823 23.773 1.6823 25.0439 2.9531L27.0468 4.95756V4.95756Z" />
            </svg>
          ) : (
            <svg
              onClick={toggleDrawBtn}
              className="all-control-btn all-control-btn-dis"
              height="20.7"
              viewBox="0 0 26 27"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7.52799 12.8652L2.97744 17.4164C2.44824 17.945 2.06037 18.6008 1.84889 19.3176L0.0496027 25.4332C-0.0763686 25.8653 0.0416723 26.3279 0.357363 26.5973C0.673054 26.9583 1.13617 27.0752 1.56421 26.9481L7.68129 25.1485C8.39808 24.9401 9.05386 24.5486 9.58255 24.0199L14.0145 19.5899L7.52799 12.8652ZM18.0025 15.6036L21.4375 12.1701L14.8288 5.56346L11.5148 8.87785L18.0025 15.6036ZM8.03714 22.1187L7.85921 22.2966C7.6152 22.5355 7.2746 22.7135 6.995 22.81L3.02167 23.9793L4.18988 20.0039C4.28596 19.6786 4.46236 19.3837 4.70281 19.1397L4.88023 18.9618V21.3053C4.88023 21.7527 5.24625 22.1187 5.69361 22.1187H8.03714ZM25.0468 8.56074C26.3177 7.28985 26.3177 5.22794 25.0468 3.95756L23.0439 1.9531C21.773 0.682301 19.7091 0.682301 18.4382 1.9531L15.9777 4.41355L22.5864 11.0212L25.0468 8.56074Z"
              />
              <line
                x1="1.08298"
                y1="1.96214"
                x2="24.083"
                y2="25.9621"
                stroke="rgba(160, 141, 235, 0.63)"
                stroke-width="3"
              />
            </svg>
          )}
          {uniData.chatEnabled ? (
            <svg
              onClick={toggleChatBtn}
              className="all-control-btn"
              height="21"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M30 15C30 22.2487 23.2838 28.125 15 28.125C13.5143 28.127 12.0349 27.9341 10.5994 27.5513C9.50437 28.1063 6.99 29.1713 2.76 29.865C2.385 29.925 2.1 29.535 2.24813 29.1862C2.91188 27.6187 3.51187 25.53 3.69187 23.625C1.395 21.3188 0 18.3 0 15C0 7.75125 6.71625 1.875 15 1.875C23.2838 1.875 30 7.75125 30 15ZM9.375 15C9.375 14.5027 9.17746 14.0258 8.82582 13.6742C8.47419 13.3225 7.99728 13.125 7.5 13.125C7.00272 13.125 6.52581 13.3225 6.17417 13.6742C5.82254 14.0258 5.625 14.5027 5.625 15C5.625 15.4973 5.82254 15.9742 6.17417 16.3258C6.52581 16.6775 7.00272 16.875 7.5 16.875C7.99728 16.875 8.47419 16.6775 8.82582 16.3258C9.17746 15.9742 9.375 15.4973 9.375 15V15ZM16.875 15C16.875 14.5027 16.6775 14.0258 16.3258 13.6742C15.9742 13.3225 15.4973 13.125 15 13.125C14.5027 13.125 14.0258 13.3225 13.6742 13.6742C13.3225 14.0258 13.125 14.5027 13.125 15C13.125 15.4973 13.3225 15.9742 13.6742 16.3258C14.0258 16.6775 14.5027 16.875 15 16.875C15.4973 16.875 15.9742 16.6775 16.3258 16.3258C16.6775 15.9742 16.875 15.4973 16.875 15V15ZM22.5 16.875C22.9973 16.875 23.4742 16.6775 23.8258 16.3258C24.1775 15.9742 24.375 15.4973 24.375 15C24.375 14.5027 24.1775 14.0258 23.8258 13.6742C23.4742 13.3225 22.9973 13.125 22.5 13.125C22.0027 13.125 21.5258 13.3225 21.1742 13.6742C20.8225 14.0258 20.625 14.5027 20.625 15C20.625 15.4973 20.8225 15.9742 21.1742 16.3258C21.5258 16.6775 22.0027 16.875 22.5 16.875V16.875Z" />
            </svg>
          ) : (
            <svg
              onClick={toggleChatBtn}
              className="all-control-btn all-control-btn-dis"
              height="21"
              viewBox="0 0 30 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.55001 5.52092C1.33552 7.80812 0 10.7676 0 14C0 17.3 1.395 20.3188 3.69187 22.625C3.51187 24.53 2.91188 26.6187 2.24813 28.1863C2.1 28.535 2.385 28.925 2.76 28.865C6.99 28.1713 9.50437 27.1063 10.5994 26.5513C12.0349 26.9341 13.5143 27.127 15 27.125C17.7862 27.125 20.395 26.4602 22.6306 25.3021L3.55001 5.52092ZM27.0745 21.7885C28.9131 19.6099 30 16.916 30 14C30 6.75125 23.2838 0.875 15 0.875C12.573 0.875 10.2805 1.37943 8.25206 2.27501L27.0745 21.7885ZM8.82582 12.6742C9.17746 13.0258 9.375 13.5027 9.375 14C9.375 14.4973 9.17746 14.9742 8.82582 15.3258C8.47419 15.6775 7.99728 15.875 7.5 15.875C7.00272 15.875 6.52581 15.6775 6.17417 15.3258C5.82254 14.9742 5.625 14.4973 5.625 14C5.625 13.5027 5.82254 13.0258 6.17417 12.6742C6.52581 12.3225 7.00272 12.125 7.5 12.125C7.99728 12.125 8.47419 12.3225 8.82582 12.6742ZM23.8258 15.3258C23.4742 15.6775 22.9973 15.875 22.5 15.875C22.0027 15.875 21.5258 15.6775 21.1742 15.3258C20.8225 14.9742 20.625 14.4973 20.625 14C20.625 13.5027 20.8225 13.0258 21.1742 12.6742C21.5258 12.3225 22.0027 12.125 22.5 12.125C22.9973 12.125 23.4742 12.3225 23.8258 12.6742C24.1775 13.0258 24.375 13.5027 24.375 14C24.375 14.4973 24.1775 14.9742 23.8258 15.3258Z"
              />
              <line
                x1="4.08125"
                y1="1.96034"
                x2="29.0812"
                y2="27.9603"
                stroke="rgba(160, 141, 235, 0.63)"
                stroke-width="3"
              />
            </svg>
          )}
          <svg
            onClick={endCallForAll}
            className="end-call-btn"
            height="31"
            viewBox="0 0 37 37"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M33.8398 20.0293L33.5346 21.628C33.2494 23.125 31.8495 24.1302 30.2647 23.9775L27.1104 23.6723C25.7353 23.5397 24.5636 22.5623 24.2136 21.258L23.2408 17.6274C21.7994 17.037 20.2115 16.7672 18.4771 16.818C16.8068 16.854 15.1607 17.2246 13.6363 17.908L13.0335 21.3074C12.8038 22.5962 11.7416 23.5567 10.3941 23.6923L7.25839 24.0068C5.6936 24.1641 4.19202 23.1682 3.74802 21.6789L3.2701 20.0802C2.79681 18.4892 3.21922 16.815 4.38318 15.6849C7.12735 13.0178 11.7061 11.6797 18.1148 11.6704C24.5328 11.6627 29.2518 12.9932 32.2735 15.6602C33.5454 16.7826 34.1389 18.4445 33.8383 20.0293H33.8398Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default Controls;
