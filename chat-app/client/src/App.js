import logo from './logo.svg';
import './chat.css';

/*function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;*/

// client/src/App.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io.connect("http://localhost:3001");

function App() {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("send_message", { message });
      setChatLog((prev) => [...prev, { message, from: "You" }]);
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChatLog((prev) => [...prev, { message: data.message, from: data.from || "Someone" }]);
    });

    return () => socket.off("receive_message");
  }, []);

  return (
    <div className="chat-container">
      <div className="chat-header">💬 Live Chat</div>

      <div className="chat-box">
        {chatLog.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.from === "You" ? "you" : "other"}`}
          >
            <div className="message-from">{msg.from}</div>
            <div className="bubble">{msg.message}</div>
          </div>
        ))}
      </div>

      <div className="input-container">
        <input
          type="text"
          value={message}
          placeholder="Enter message..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;


