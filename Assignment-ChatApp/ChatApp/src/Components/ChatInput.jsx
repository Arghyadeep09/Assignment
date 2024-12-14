/* eslint-disable react/prop-types */
import EmojiPickerWrapper from "./EmojiPickerWrapper";

const ChatInput = ({
  newMessage,
  setNewMessage,
  sendMessage,
  showEmojiPicker,
  setShowEmojiPicker,
  handleEmojiSelect,
}) => {
  return (
    <div className="chat-input" style={{ position: "relative" }}>
      {/* Emoji Picker Toggle Button */}
      <button
        onClick={() => setShowEmojiPicker((prev) => !prev)}
        className="emoji-picker-button"
        aria-label="Toggle emoji picker"
      >
        <box-icon name="happy" size="lg"></box-icon>
      </button>

      {showEmojiPicker && (
        <EmojiPickerWrapper
          onEmojiSelect={handleEmojiSelect}
          position={{ bottom: "50px", left: "10px" }}
        />
      )}

      {/* Message Input Field */}
      <input
        type="text"
        placeholder="Enter your message here..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
      />

      {/* Send Button */}
      <button onClick={sendMessage}>
        <box-icon name="send" size="lg" color="#ff4d4d"></box-icon>
      </button>
    </div>
  );
};

export default ChatInput;
