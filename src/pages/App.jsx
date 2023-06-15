import { useEffect, useRef } from "react";
import urlReplace from "../utils/urlReplace";

import "../styles/App.css";

export default () => {
  const socketRef = useRef();

  const clientId = Math.random().toString(36).substr(2, 9);
  const socket = new WebSocket(
    "wss://websocket-chat-server-production-6129.up.railway.app/"
  );
  socketRef.current = socket;

  useEffect(() => {
    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const { type, clientId, from, content } = data;

      if (type === "connect") {
        console.log(`Connected with client ID: ${clientId}`);
        document.getElementById("connection-id").innerHTML = `Id:${clientId}`;
      } else if (type === "message") {
        console.log(`Message from ${from}: ${content}`);
        document
          .getElementById("message-field")
          .insertAdjacentHTML(
            "beforeend",
            `<p class='message-block justify-right'><span class='message-you'>${urlReplace(
              content
            )}</span></p>`
          );
      }
    };

    document.addEventListener("keydown", (e) => {
      if (
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.key == "Backspace" ||
        e.key == "ArrowLeft" ||
        e.key == "ArrowRight" ||
        e.key == "ArrowUp" ||
        e.key == "ArrowDown"
      )
        return;
      document.getElementById("message").focus();
    });
  });

  const SendMessage = () => {
    const to = document.getElementById("to").value;
    const message = document.getElementById("message").value;
    if (message == "") return;
    document
      .getElementById("message-field")
      .insertAdjacentHTML(
        "beforeend",
        `<p class='message-block justify-left'><span class='message-my'>${urlReplace(
          message
        )}</span></p>`
      );
    document.getElementById("message").value = "";
    const data = { type: "message", to, from: clientId, content: message };

    socket.send(JSON.stringify(data));
  };

  return (
    <>
      <div id="app">
        <nav className="left-nav">
          <div className="w-full"></div>
          <span id="connection-id"></span>
        </nav>
        <main className="main">
          <div id="message-field"></div>
          <div className="input-area">
            <input
              type="text"
              id="to"
              placeholder="To (Client ID)"
              className="input-text"
            />
            <input
              type="text"
              id="message"
              placeholder="Message"
              className="input-text w-full"
            />
            <button className="btn" onClick={() => SendMessage()}>
              <span className="text-white">Send</span>
            </button>
          </div>
        </main>
      </div>
    </>
  );
};
