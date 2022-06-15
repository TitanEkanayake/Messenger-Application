import { React, useEffect, useRef } from "react";
import "../App.css";

const MessageContainer = ({ messages }) => {
  const messageRef = useRef();

  const getDisplayMessage = (m) => {
    return m.message.type === "image" ? (
      <div>
        <img src={m.message.text} height="400px" />
        <div className="from-user">{m.user}</div>
      </div>
    ) : (
      <div>
        <div className="message bg-primary">{m.message.text}</div>
        <div className="from-user">{m.user}</div>
      </div>
    );
  };

  useEffect(() => {
    if (messageRef && messageRef.current) {
      const { scrollHeight, clientHeight } = messageRef.current;
      messageRef.current.scrollTo({
        left: 0,
        top: scrollHeight - clientHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  return (
    <div ref={messageRef} className="message-container ">
      {messages.map((m, index) => (
        <div key={index} className="user-message">
          {getDisplayMessage(m)}
        </div>
      ))}
    </div>
  );
};
export default MessageContainer;
