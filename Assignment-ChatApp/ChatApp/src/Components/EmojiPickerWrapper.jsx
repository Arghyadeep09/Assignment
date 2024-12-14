/* eslint-disable react/prop-types */
import EmojiPicker from "emoji-picker-react";

const EmojiPickerWrapper = ({ onEmojiSelect, position }) => {
  const handleEmojiClick = (emojiObject) => {
    onEmojiSelect(emojiObject.emoji);
  };

  return (
    <div
      style={{
        position: "absolute",
        ...position,
        zIndex: 100,
        background: "white",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        borderRadius: "8px",
      }}
    >
      <EmojiPicker onEmojiClick={handleEmojiClick} />
    </div>
  );
};

export default EmojiPickerWrapper;
