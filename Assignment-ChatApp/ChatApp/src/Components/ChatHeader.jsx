/* eslint-disable react/prop-types */

const ChatHeader = ({ user, sidebarActive, setSidebarActive }) => {
  return (
    <div className="chat-header">
      <div className="header-container">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="menu-icon">
            <box-icon
              name="menu"
              onClick={() => setSidebarActive(!sidebarActive)}
            ></box-icon>
          </div>
          <h2>Messages</h2>
        </div>
        <div className="chat-header-right">
          <div className="profile">
            <img
              src="http://placehold.co/40x40"
              alt="profile of user"
              className="profile-picture"
            />
            <span className="profile-name">{user.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
