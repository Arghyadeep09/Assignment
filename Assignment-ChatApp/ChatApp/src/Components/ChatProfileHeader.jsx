/* eslint-disable react/prop-types */

import FontTypeSelector from "./FontTypeSelector";
import ColorPicker from "./ColorPicker";

const ChatProfileHeader = ({
  selectedMember,
  selectedChatRoom,
  selectedFont,
  setSelectedFont,
  setTimeStampColor,
}) => {
  return (
    <div className="chat-profile-header">
      <div className="profile">
        <img
          src="http://placehold.co/40x40"
          alt="Profile"
          className="profile-picture"
        />
        <span className="profile-name">{selectedMember.name}</span>
        <i className="fas fa-chevron-down profile-icon"></i>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <FontTypeSelector
          selectedFont={selectedFont}
          setSelectedFont={setSelectedFont}
        />
        <ColorPicker
          selectedChatRoom={selectedChatRoom}
          setTimeStampColor={setTimeStampColor}
        />
      </div>
    </div>
  );
};

export default ChatProfileHeader;
