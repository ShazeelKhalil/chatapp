import React from "react";
import Messages from "../Messages/Messages";
import "./Message.css";

const Message = ({ message: { user, text }, name }) => {
  let isSentByCurrentUser = false;
  const trimmedName = name.trim().toLowerCase();
  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }

  return isSentByCurrentUser ? (
    <div className="messageContainer jsutifyEnd">
      <p className="sentText pr-10"> {trimmedName}</p>
      <div className="messageBox backgroudBlue">
        <p className="messageText colorWhite">{text}</p>
      </div>
    </div>
  ) : (
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroudLight">
        <p className="messageText colorDark">{text}</p>
      </div>
      <p className="sentText pl-10 "> {user}</p>
    </div>
  );
};
export default Message;
