import "./ChatApp.css";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateChat } from "../redux";

function ChatApp(props) {
  const socket = props.socket;

  const username = useSelector((state) => state.personal.username);
  const room = useSelector((state) => state.personal.room);
  const data = useSelector((state) => state.personal);
  const uniData = useSelector((state) => state.universal);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const dispatch = useDispatch();

  let myMessage = (e) => {
    setMessage(e.target.value);
  };

  const singleEffect = useRef(true);

  const handleKeyPress = (e) => {
    if(e.key==='Enter' && e.shiftKey){
      e.preventDefault();
      sendMessage(e);
    }
  }

  const createChat = () => {
    let chat = [];
    let testMessage=data.personal.chat;
    for(let i=0; i<testMessage.length; i++){
      let temp;
      if(testMessage[i][0][0]==="o") {
        temp=testMessage[i];
        temp[0]="i:"+temp[0].slice(2);
      } else if(testMessage[i][0][0]==="i") {
        temp=testMessage[i];
        temp[0]="o:"+temp[0].slice(2);
      } else {
        continue;
      }
      chat.push(temp);
    }
    return chat;
  }

  // useEffect(() => {
  //   if(data.username === uniData.users[0]){
  //     let chat = createChat();
  //     socket.emit("transfer_chat", {chat, newUser: socketData.socketId})
  //   }
  // }, [data])

  useEffect(() => {

    if (singleEffect.current) {
      socket.on("recieve_message", (data) => {
        const temp = ["i:" + data.message, data.time, data.user];
        setMessages((current) => [
          ...current,
          temp,
        ]);
        dispatch(updateChat({chat: temp}))
      });
      

      socket.on("new_joinee", (socketData) => {
        setMessages((current) => [
          ...current,
          ["j:" + socketData.username + " joined the chat!"]
        ])
        dispatch(updateChat({chat: ["j:" + socketData.username + " joined the chat!"]}));

        if(data.username === uniData.users[0]){
          let chat = createChat();
          socket.emit("transfer_chat", {chat, newUser: socketData.socketId})
        }
      })

      socket.on("remove_disconnected_user", (data) => {
        setMessages((current) => [
          ...current,
          ["l:" + data.username + " left the chat."]
        ]);
        dispatch(updateChat({chat: ["l:" + data.username + " left the chat."]}))
      })

      socket.on("dleave_room", (data) => {
        setMessages((current) => [
          ...current,
          ["l:" + data.username + " left the chat."]
        ])
        dispatch(updateChat({chat: ["l:" + data.username + " left the chat."]}))
      })

      socket.on("dtoggle_lock_room", (data) => {
        if(!data.roomLocked){
          setMessages((current) => [
            ...current,
            ["r:Room locked."]
          ]);
          dispatch(updateChat({chat: ["r:Room locked."]}))
        } else {
          setMessages((current) => [
            ...current,
            ["u:Room unlocked."]
          ])
          dispatch(updateChat({chat: ["u:Room unlocked."]}))
        }
      });

      socket.on("set_old_chat", (socketData) => {
        setMessages(socketData.chat);
      })

      singleEffect.current = false;
    }
  }, [socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message === "") {
      return;
    }
    const current = new Date();

    const time = current.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((current) => [...current, ["o:" + message, time, username]]);
    dispatch(updateChat({chat: ["o:" + message, time, username]}))
    socket.emit("send_message", {
      message: message,
      time: time,
      user: username,
      room: room,
    });
    setMessage((prev) => "");
  };

  const bottom = useRef(null);

  useEffect(() => {
    if (bottom && bottom.current) {
      bottom.current.scrollTop = bottom.current.scrollHeight;
    }
  }, [messages]);

  const expandMenu = () => {
    document.getElementsByClassName("users-bar")[0].style.right = "0px";
    if(window.innerWidth<700){
      document.getElementsByClassName("main-form")[0].style.width = "100%";
      document.getElementsByClassName("main-form")[0].style.right = "0";
    }else{
      document.getElementsByClassName("main-form")[0].style.width = "calc(100vw - 330px)";
      document.getElementsByClassName("main-form")[0].style.right = "330px";
    }
  }

  return (
    <div className="chat-app">
      <form className="main-form">
        <div className="chat-drag">
          <div>React Chat</div>
          <div className="room-details">
            {uniData.room} {uniData.roomTitle === "" ? (<></>) : (<span>({uniData.roomTitle})</span>)}<br/>
            {data.username}
          </div>
          <div onClick={expandMenu} className="top-bar-menu-btn">
              <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 12H20M4 18H20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
          </div>
        </div>
        <div className="message-area-container">
          <div className="message-area" ref={bottom}>
            {messages.map((item, index) => {
              let list;
              if (item[0][0] === "o") {
                list = (
                  <div className="you-cover">
                    <div className="you">
                      {index === 0 ? (
                        <div className="you-username">{item[2]}</div>
                      ) : messages[index - 1][2] === messages[index][2] ? (
                        <></>
                      ) : (
                        <div className="you-username">{item[2]}</div>
                      )}

                      <div className="you-message"><pre className="message-pre">{item[0].slice(2)}</pre></div>
                      <div className="you-indicator">{item[1]}</div>
                    </div>
                  </div>
                );
              } else if (item[0][0] === "i") {
                list = (
                  <div className="user-cover">
                    <div className="user">
                      {index === 0 ? (
                        <div className="user-username">{item[2]}</div>
                      ) : messages[index - 1][2] === messages[index][2] ? (
                        <></>
                      ) : (
                        <div className="user-username">{item[2]}</div>
                      )}
                      <div className="user-message"><pre className="message-pre">{item[0].slice(2)}</pre></div>
                      <div className="user-indicator">{item[1]}</div>
                    </div>
                  </div>
                );
              } else if(item[0][0] === "j") {
                list = (
                  <div className="join-notification user-notification">{item[0].slice(2)}</div>
                )
              } else if(item[0][0] === "l") {
                list = (
                  <div className="leave-notification user-notification">{item[0].slice(2)}</div>
                )
              } else if(item[0][0] === "r") {
                list = (
                  <div className="lock-notification">{item[0].slice(2)}</div>
                )
              } else if(item[0][0] === "u") {
                list = (
                  <div className="lock-notification">{item[0].slice(2)}</div>
                )
              }
              return list;
            })}
          </div>
        </div>
        <div className="message-and-button-container">
          <form onSubmit={sendMessage} className="message-and-button">
            <textarea
              type="text"
              className="textarea"
              onChange={myMessage}
              onKeyPress={handleKeyPress}
              value={message}
              placeholder="Type your message..."
            />
            
            <div onClick={sendMessage} className="submit-button">
              <svg
                fill="none" 
                viewBox="0 0 24 24"
                height="24"
                width="24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.8147 12.1974L5.28344 13.4526C5.10705 13.482 4.95979 13.6034 4.89723 13.7709L2.29933 20.7283C2.05066 21.3678 2.72008 21.9778 3.33375 21.671L21.3337 12.671C21.8865 12.3946 21.8865 11.6057 21.3337 11.3293L3.33375 2.32933C2.72008 2.0225 2.05066 2.63254 2.29933 3.27199L4.89723 10.2294C4.95979 10.3969 5.10705 10.5183 5.28344 10.5477L12.8147 11.8029C12.9236 11.821 12.9972 11.9241 12.9791 12.033C12.965 12.1173 12.899 12.1834 12.8147 12.1974Z"/>
              </svg>
            </div>
          </form>
        </div>
      </form>
    </div>
  );
}

export default ChatApp;
