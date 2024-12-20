/* eslint-disable react/prop-types */
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import "boxicons/css/boxicons.min.css"; 
import "./../styles/InboxHeader.css";

const ChatInput = ({
  selectedMember,
  newMessage,
  setNewMessage,
  sendMessage,
  handleInputChange,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emoji) => {
    setNewMessage((prevMessage) => prevMessage + emoji.emoji);
  };

  if (selectedMember === null) return null;

  return (
    <div className="chat-input" style={{ position: "relative" }}>
      {/* Emoji Picker Toggle Button */}
      <button
        onClick={() => setShowEmojiPicker((prev) => !prev)}
        className="option-container emoji-picker-button"
        style={{
          marginRight: "10px",
          backgroundColor: "transparent",
          border: "none",
        }}
      >
        <box-icon name="happy" size="md"></box-icon>
      </button>
      {/* Emoji Picker Component */}
      {showEmojiPicker && (
        <div
          style={{
            position: "absolute",
            bottom: "50px",
            left: "10px",
            zIndex: 100,
            background: "white",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
          }}
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
      {/* Message Input Field */}
      <input
        type="text"
        placeholder="Enter your message here..."
        value={newMessage}
        onChange={(e) => {
          setNewMessage(e.target.value); // Update the message state
          handleInputChange(); // Trigger typing status logic
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage(); // Send message on Enter key
        }}
      />
      {/* Send Button */}
      <button
        onClick={sendMessage}
        style={{
          backgroundColor: "transparent",
          border: "none",
        }}
      >
        <box-icon name="send" size="md" color="#ff4d4d"></box-icon>
      </button>
    </div>
  );
};

export default ChatInput;
