import React from "react";
import { useSelector } from "react-redux";
import "./Header.css";
import UserControls from "./UserControls";

function Header( props) {
    const socket = props.socket
  const data = useSelector((state) => state.personal);
  const uniData = useSelector(state=>state.universal)
  return (
    <div className="header-bar">
      <div className="header-info">
        <div className="header-info-inner">
          <div className="header-info-title">
            <div>Room : </div>
            <div>Username : </div>
          </div>
          <div className="header-info-values">
            <div>{data.room}</div>
            <div>{data.username}</div>
          </div>
        </div>
        <div className="header-room-title">
            <div className="header-room-title-head">Title</div>
            {uniData.roomTitle}
        </div>
      </div>
      <div className="header-controls">
        
      </div>
      <div className="header-empty"></div>
    </div>
  );
}

export default Header;
