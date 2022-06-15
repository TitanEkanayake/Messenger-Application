import { React, useState } from "react";
import { Form, FormControl, InputGroup, Button } from "react-bootstrap";

const SendMessageForm = ({ sendMessage }) => {
  const [message, setMessage] = useState("");

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const base64 = await covertBase64(file);
    console.log(base64);
    setMessage(getImageMessage("image", base64, file.name));
  };

  const covertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const getFormattedMessage = (type, text) => {
    return [
      {
        text: text,
        type: type,
      },
    ];
  };

  const getImageMessage = (type, text, fileName) => {
    let chunks = [];
    let chunkSize = 10000;
    let numberOfChunks = Math.ceil(text.length / chunkSize);
    for (let i = 0; i <= numberOfChunks; i++) {
      chunks.push({
        text: text.substring(i * chunkSize, (i + 1) * chunkSize),
        type: type,
        numberOfChunks: numberOfChunks,
        position: i,
        name: fileName,
      });
    }
    return chunks;
  };

  return (
    <div>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(message);
          setMessage("");
        }}
      >
        <div className="send">
          <InputGroup>
            <FormControl
              placeholder="message..."
              onChange={(e) =>
                setMessage(getFormattedMessage("text", e.target.value))
              }
              value={message.text}
            />
          </InputGroup>
          <br />
          <InputGroup>
            <input
              type="file"
              onChange={(e) => {
                uploadImage(e);
              }}
            />
          </InputGroup>
          <br />
          <InputGroup>
            <Button variant="info" type="submit" disabled={!message}>
              Send
            </Button>
          </InputGroup>
        </div>
      </Form>
    </div>
  );
};
export default SendMessageForm;
