import "./ChatApp.css";
import { useState, useEffect, useRef } from "react";
// import { io } from "socket.io-client";
import { useSelector } from "react-redux";
// const socket = io.connect("http://localhost:3001");

function ChatApp(props) {
  const socket = props.socket;

  const username = useSelector((state) => state.personal.username);
  const room = useSelector((state) => state.personal.room);
  const data = useSelector((state) => state.personal);
  const uniData = useSelector((state) => state.universal);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  let myMessage = (e) => {
    setMessage(e.target.value);
  };

  const singleEffect = useRef(true);

  useEffect(() => {
    if (singleEffect.current) {
      socket.on("recieve_message", (data) => {
        setMessages((current) => [
          ...current,
          ["i:" + data.message, data.time, data.user],
        ]);
      });
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

  return (
    <div className="chat-app">
      <form className="main-form">
        <div className="chat-drag">
          <svg
            height="16"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M30 15C30 22.2487 23.2838 28.125 15 28.125C13.5143 28.127 12.0349 27.9341 10.5994 27.5513C9.50437 28.1063 6.99 29.1713 2.76 29.865C2.385 29.925 2.1 29.535 2.24813 29.1862C2.91188 27.6187 3.51187 25.53 3.69187 23.625C1.395 21.3188 0 18.3 0 15C0 7.75125 6.71625 1.875 15 1.875C23.2838 1.875 30 7.75125 30 15ZM9.375 15C9.375 14.5027 9.17746 14.0258 8.82582 13.6742C8.47419 13.3225 7.99728 13.125 7.5 13.125C7.00272 13.125 6.52581 13.3225 6.17417 13.6742C5.82254 14.0258 5.625 14.5027 5.625 15C5.625 15.4973 5.82254 15.9742 6.17417 16.3258C6.52581 16.6775 7.00272 16.875 7.5 16.875C7.99728 16.875 8.47419 16.6775 8.82582 16.3258C9.17746 15.9742 9.375 15.4973 9.375 15V15ZM16.875 15C16.875 14.5027 16.6775 14.0258 16.3258 13.6742C15.9742 13.3225 15.4973 13.125 15 13.125C14.5027 13.125 14.0258 13.3225 13.6742 13.6742C13.3225 14.0258 13.125 14.5027 13.125 15C13.125 15.4973 13.3225 15.9742 13.6742 16.3258C14.0258 16.6775 14.5027 16.875 15 16.875C15.4973 16.875 15.9742 16.6775 16.3258 16.3258C16.6775 15.9742 16.875 15.4973 16.875 15V15ZM22.5 16.875C22.9973 16.875 23.4742 16.6775 23.8258 16.3258C24.1775 15.9742 24.375 15.4973 24.375 15C24.375 14.5027 24.1775 14.0258 23.8258 13.6742C23.4742 13.3225 22.9973 13.125 22.5 13.125C22.0027 13.125 21.5258 13.3225 21.1742 13.6742C20.8225 14.0258 20.625 14.5027 20.625 15C20.625 15.4973 20.8225 15.9742 21.1742 16.3258C21.5258 16.6775 22.0027 16.875 22.5 16.875V16.875Z" />
          </svg>
        </div>
        <div className="message-area" ref={bottom}>
          {messages.map((item, index) => {
            let list;
            if (item[0][0] === "o") {
              list = (
                <div className="you">
                  {index === 0 ? (
                    <div className="you-username">{item[2]}</div>
                  ) : messages[index - 1][2] === messages[index][2] ? (
                    <></>
                  ) : (
                    <div className="you-username">{item[2]}</div>
                  )}

                  <div className="you-message">{item[0].slice(2)}</div>
                  <div className="you-indicator">{item[1]}</div>
                </div>
              );
            } else {
              list = (
                <div className="user">
                  {index === 0 ? (
                    <div className="user-username">{item[2]}</div>
                  ) : messages[index - 1][2] === messages[index][2] ? (
                    <></>
                  ) : (
                    <div className="user-username">{item[2]}</div>
                  )}
                  <div className="user-message">{item[0].slice(2)}</div>
                  <div className="user-indicator">{item[1]}</div>
                </div>
              );
            }
            return list;
          })}
        </div>
        {data.creator || uniData.chatEnabled ? (
          <input
            type="text"
            className="textarea"
            onChange={myMessage}
            onSubmit={sendMessage}
            value={message}
            placeholder="Type your message..."
          />
        ) : (
          <input
            type="text"
            className="textarea textarea-disabled"
            onChange={myMessage}
            onSubmit={sendMessage}
            value={message}
            placeholder="Only admins can send the message."
            disabled
          />
        )}
        {data.creator || uniData.chatEnabled ? (
          <input
            type="submit"
            value="Send Message"
            onClick={sendMessage}
            className="submit-button"
          />
        ) : (
          <input
            type="submit"
            value="Disabled"
            onClick={sendMessage}
            className="submit-button"
            disabled
          />
        )}
      </form>
    </div>
  );
}

export default ChatApp;
