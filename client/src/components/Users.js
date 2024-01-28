import React from "react";
import "./Users.css";
import { useSelector } from "react-redux";
import UserControls from "./UserControls";

function Users(props) {
  const socket = props.socket;

  const data = useSelector((state) => state.personal);
  const users = useSelector((state) => state.universal.users);

  return (
    <div className="users-bar">
      <UserControls socket={socket}/>
      <div className="user-card">
        <div className="user-card-title">Connected Users</div>
        <div className="user-list">
          {users.map((user, index) => {
            let list = (
              <div key={index}>
                {user === data.username ? (
                  <div className="self-user common-user">
                    <div className="self-avatar common-avatar">
                      <svg
                        width="30"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M10 11C4.08 11 2 14 2 16V19H18V16C18 14 15.92 11 10 11Z" />
                        <path d="M10 10C12.4853 10 14.5 7.98528 14.5 5.5C14.5 3.01472 12.4853 1 10 1C7.51472 1 5.5 3.01472 5.5 5.5C5.5 7.98528 7.51472 10 10 10Z" />
                      </svg>
                    </div>
                    <div className="self-username common-username">You</div>
                  </div>
                ) : (
                  <div className="other-user common-user">
                    <div className="other-avatar common-avatar">
                      <svg
                        width="30"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M10 11C4.08 11 2 14 2 16V19H18V16C18 14 15.92 11 10 11Z" />
                        <path d="M10 10C12.4853 10 14.5 7.98528 14.5 5.5C14.5 3.01472 12.4853 1 10 1C7.51472 1 5.5 3.01472 5.5 5.5C5.5 7.98528 7.51472 10 10 10Z" />
                      </svg>
                    </div>
                    <div className="other-username common-username">{user}</div>
                  </div>
                )}
              </div>
            );
            return list;
          })}
        </div>
      </div>
      
    </div>
  );
}

export default Users;
