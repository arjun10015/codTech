import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { debounce } from "lodash";

function App() {
  const [content, setContent] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    const handleReceive = (data) => {
      setContent(data);
    };

    socketRef.current.on("receive-changes", handleReceive);

    return () => {
      socketRef.current.off("receive-changes", handleReceive);
      socketRef.current.disconnect();
    };
  }, []);

  const emitChanges = useRef(
    debounce((text) => {
      socketRef.current?.emit("send-changes", text);
    }, 300)
  ).current;

  const handleChange = (e) => {
    setContent(e.target.value);
    emitChanges(e.target.value);
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">📝 Real-Time Collaborative Editor</h1>
      <textarea
        className="form-control shadow p-3 mb-3 bg-white rounded"
        rows={15}
        value={content}
        onChange={handleChange}
        placeholder="Start typing here..."
      />
      <p className="text-center text-muted">
        Changes sync across all users in real time.
      </p>
    </div>
  );
}

export default App;