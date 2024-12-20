/* eslint-disable react/prop-types */

const ChatMessages = ({ selectedChatRoom, chatMessages, user, selectedFont, timeStampColor }) => {
  return (
    <div
      className="chat-messages"
      style={{
        backgroundColor: selectedChatRoom?.color || "#ffffff", // Default white
        padding: "10px",
        borderRadius: "8px",
        fontFamily: selectedFont,
        color: selectedChatRoom?.textColor || "#000000",
      }}
    >
      {chatMessages.map((message, index) => (
        <div
          key={index}
          className={`message ${
            message.senderId === user.uid ? "sent" : "received"
          }`}
        >
          <p
            className="message-text"
            style={{ color: selectedChatRoom?.textColor || "#000000" }}
          >
            {message.text}
          </p>
          <span
            className="message-time"
            style={{ color: timeStampColor }}
          >
            {new Date(message.timestamp?.toDate()).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
