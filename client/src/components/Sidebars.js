import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./Sidebars.css";

function Sidebars() {
  const creator = useSelector((state) => state.personal.creator);
  const [sidebar, setSidebar] = useState(true);
  const displayConsoleBtn = (e) => {
    e.preventDefault();
    if (sidebar) {
      document.getElementsByClassName("users-bar")[0].style.right = "-305px";
      document.getElementsByClassName("main-form")[0].style.right = "30px";
      document.getElementsByClassName("sidebar-pointer")[0].style.rotate = "180deg";
      setSidebar(false);
    } else {
      document.getElementsByClassName("users-bar")[0].style.right = "30px";
      document.getElementsByClassName("main-form")[0].style.right = "362px";
      document.getElementsByClassName("sidebar-pointer")[0].style.rotate = "0deg";
      setSidebar(true);
    }
  };
  return (
    <div className="user-console">
      <div className="user-console-inner" onClick={displayConsoleBtn}>
        <div></div>
        {creator ? <>Admin Console</> : <>User Console</>}
        <svg height="18px" className="sidebar-pointer" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M12 1C5.925 1 1 5.925 1 12C1 18.075 5.925 23 12 23C18.075 23 23 18.075 23 12C23 5.925 18.075 1 12 1ZM9.793 8.707C9.61084 8.5184 9.51005 8.2658 9.51233 8.0036C9.5146 7.7414 9.61977 7.49059 9.80518 7.30518C9.99059 7.11977 10.2414 7.0146 10.5036 7.01233C10.7658 7.01005 11.0184 7.11084 11.207 7.293L15.207 11.293C15.3945 11.4805 15.4998 11.7348 15.4998 12C15.4998 12.2652 15.3945 12.5195 15.207 12.707L11.207 16.707C11.0184 16.8892 10.7658 16.99 10.5036 16.9877C10.2414 16.9854 9.99059 16.8802 9.80518 16.6948C9.61977 16.5094 9.5146 16.2586 9.51233 15.9964C9.51005 15.7342 9.61084 15.4816 9.793 15.293L13.086 12L9.793 8.707Z" fill="rgba(255,255,255,0.9)"/>
</svg><div></div>
      </div>
    </div>
  );
}

export default Sidebars;
