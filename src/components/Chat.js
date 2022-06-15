import React from "react";
import MessageContainer from "./MessageContainer";
import "../App.css";
import SendMessageForm from "./SendMessageForm";
import { Button } from "react-bootstrap";
import ConnectedUsers from "./ConnectedUsers";

const Chat = ({ messages, sendMessage, closeConnection, users }) => {
  return (
    <div>
      <div className="leave-room">
        <Button variant="danger" onClick={() => closeConnection()}>
          Leave Room
        </Button>
      </div>
      <ConnectedUsers users={users} />

      <div className="chat">
        <MessageContainer messages={messages} />
        <SendMessageForm sendMessage={sendMessage} />
      </div>
    </div>
  );
};
export default Chat;
