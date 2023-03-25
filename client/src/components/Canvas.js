import React, { useEffect, useRef, useState } from "react";
import "./Canvas.css";
// import {io} from "socket.io-client"
import { useSelector } from "react-redux";
// const socket = io.connect('http://localhost:3001')

function Canvas(props) {
  const socket = props.socket;

  const room = useSelector((state) => state.personal.room);
  const data = useSelector((state) => state.personal);
  const uniData = useSelector((state) => state.universal);

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const singleEffect = useRef(true);

  useEffect(() => {
    if (singleEffect.current) {
      socket.on("rstart_drawing", (data) => {
        contextRef.current.beginPath();
        contextRef.current.moveTo(data.offsetX, data.offsetY);
      });
      socket.on("rdraw", (data) => {
        if (!data.isDrawing) {
          return;
        }
        contextRef.current.lineTo(data.offsetX, data.offsetY);
        contextRef.current.stroke();
      });
      singleEffect.current = false;
    }
  }, [socket]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 500;
    canvas.height = 500;
    // canvas.width = window.innerWidth/2;
    // canvas.height = window.innerHeight/2;
    canvas.style.height = `500px`;
    canvas.style.width = `500px`;
    // canvas.style.height = `${window.innerHeight/2}px`;
    // canvas.style.width = `${window.innerWidth/2}px`;

    const context = canvas.getContext("2d");
    context.scale(1, 1);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 1;
    contextRef.current = context;
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    if (data.creator || uniData.drawEnabled) {
      const { offsetX, offsetY } = nativeEvent;
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      socket.emit("start_drawing", {
        offsetX: offsetX,
        offsetY: offsetY,
        isDrawing: true,
        room: room,
      });
      setIsDrawing(true);
    }
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    if (data.creator ? data.drawEnabled : (data.drawEnabled || uniData.drawEnabled)) {
      const { offsetX, offsetY } = nativeEvent;
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
      socket.emit("draw", {
        offsetX: offsetX,
        offsetY: offsetY,
        isDrawing: true,
        room: room,
      });
    }
  };

  return (
    <canvas
      className="canvas-frame"
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      ref={canvasRef}
      width="300px"
      height="300px"
    />
  );
}

export default Canvas;
