import "./App.css";
import Canvas from "./components/Canvas";
import ChatApp from "./components/ChatApp";
import Home from "./components/Home";
import { io } from "socket.io-client";
import Users from "./components/Users";
import { useSelector } from "react-redux";
import Sidebars from "./components/Sidebars";
import Header from "./components/Header";
import Media from "./components/Media";

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
          {/* <Header socket={socket}/>
          <ChatApp socket={socket} />
          <Canvas socket={socket} />
          <Users socket={socket} /> */}
          <Media socket={socket}/>
          {/* <Sidebars/> */}
        </>
      )}
    </div>
  );
}

export default App;
