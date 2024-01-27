import "./App.css";
import ChatApp from "./components/ChatApp";
import Home from "./components/Home";
import { io } from "socket.io-client";
import Users from "./components/Users";
import { useSelector } from "react-redux";

const socket = io.connect("http://localhost:3001");

function App() {
  const data = useSelector((state) => state.personal);

  return (
    <div className="App">
      {data.room === "" ? (
        <>
          <Home socket={socket} />
        </>
      ) : (
        <>
          <Home socket={socket}/>
          <ChatApp socket={socket} />
          <Users socket={socket} />
        </>
      )}
    </div>
  );
}

export default App;