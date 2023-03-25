import React from "react";
import { useSelector } from "react-redux";
import "./UsersHead.css";

function UsersHead(props) {
  const uniData = useSelector((state) => state.universal);
  const data = useSelector((state) => state.personal);

  return (
    <div className="users-head">
      <svg
        height="33"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.894 2.01401L23.394 4.26401C23.5647 4.29741 23.7184 4.38908 23.829 4.52334C23.9395 4.6576 24 4.8261 24 5.00001V23C24 23.1739 23.9395 23.3424 23.829 23.4767C23.7184 23.611 23.5647 23.7026 23.394 23.736L11.894 25.986C11.7854 26.0073 11.6734 26.0042 11.5661 25.9771C11.4587 25.9499 11.3588 25.8993 11.2733 25.829C11.1879 25.7586 11.119 25.6702 11.0718 25.5701C11.0245 25.47 11 25.3607 11 25.25V2.75001C11 2.63932 11.0245 2.53 11.0718 2.4299C11.119 2.3298 11.1879 2.24139 11.2733 2.17104C11.3588 2.10068 11.4587 2.05012 11.5661 2.02297C11.6734 1.99582 11.7854 1.99276 11.894 2.01401V2.01401ZM15 13C14.7348 13 14.4804 13.1054 14.2929 13.2929C14.1054 13.4804 14 13.7348 14 14C14 14.2652 14.1054 14.5196 14.2929 14.7071C14.4804 14.8947 14.7348 15 15 15C15.2652 15 15.5196 14.8947 15.7071 14.7071C15.8946 14.5196 16 14.2652 16 14C16 13.7348 15.8946 13.4804 15.7071 13.2929C15.5196 13.1054 15.2652 13 15 13ZM10 4.50001V23.5H4.75C4.56876 23.5 4.39366 23.4344 4.25707 23.3152C4.12048 23.1961 4.03165 23.0316 4.007 22.852L4 22.75V5.25001C4.00001 5.06878 4.06564 4.89367 4.18477 4.75708C4.30389 4.6205 4.46845 4.53166 4.648 4.50701L4.75 4.50001H10Z"
          fill="#A08DEB"
        />
      </svg>
      <div className="users-head-status">
        <div className="users-head-status-one">
          {/* Chat :
          <br />
          Draw :
          <br />
          Mic : */}
          <span>Room :</span>
          <span>Chat :</span>
          <span>Board :</span>
          <span>Mic :</span>
        </div>
        <div className="users-head-status-two">
          <span>{uniData.locked ? <>Locked</> : <>Open</>}</span>
          <span>{uniData.chatEnabled ? <>Enabled</> : <>Disabled</>}</span>
          <span>{uniData.drawEnabled ? <>Enabled</> : <>Disabled</>}</span>
          <span>{uniData.allMute || data.selfMute ? <>Disabled</> : <>Enabled</>}</span>
          
          
          
          
          
        </div>
      </div>
    </div>
  );
}

export default UsersHead;
