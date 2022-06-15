import { React, useState } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Lobby from "./components/Lobby";
import Chat from "./components/Chat";

const App = () => {
  const [connection, setConnection] = useState();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [images, setImages] = useState({});

  const joinRoom = async (user, room) => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:44331/chat")
        .configureLogging(LogLevel.Information)
        .build();

      connection.on("UserInRoom", (users) => {
        setUsers(users);
      });

      connection.on("ReceiveMessage", (user, msg) => {
        const message = JSON.parse(msg);
        if (message.type === "image") {
          let img = images[message.name];
          if (!img) {
            img = [];
          }
          img.push(message);
          images[message.name] = img;

          if (img.length == message.numberOfChunks) {
            let sort = img.sort((a, b) => a.position - b.position);
            let imgText = "";
            sort.forEach((element) => {
              imgText = imgText.concat(element.text);
            });

            let data = img[0];

            let message = {
              text: imgText,
              type: data.type,
            };

            setMessages((messages) => [...messages, { user, message }]);
            delete images[message.name];
          }
        } else {
          setMessages((messages) => [...messages, { user, message }]);
        }
      });

      connection.onclose((e) => {
        setConnection();
        setMessages([]);
        setUsers({});
      });

      await connection.start();
      await connection.invoke("JoinRoom", { user, room });
      setConnection(connection);
    } catch (e) {
      console.log(e);
    }
  };

  const closeConnection = async () => {
    try {
      await connection.stop();
    } catch (e) {
      console.log(e);
    }
  };

  const sendMessage = async (message) => {
    try {
      for (const element of message) {
        await connection.invoke("SendMessage", JSON.stringify(element));
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <div className="container1">
        <div className="App">
          <div className="header">
            <h2>DS_G15_web</h2>
          </div>
          {!connection ? (
            <Lobby joinRoom={joinRoom} />
          ) : (
            <Chat
              messages={messages}
              sendMessage={sendMessage}
              closeConnection={closeConnection}
              users={users}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default App;
