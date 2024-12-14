import React from "react";

const RecentChatsList = ({ recentChats, handleMemberClick }) => {
  if (recentChats.length === 0) {
    return <p>No recent chats found</p>;
  }

  return (
    <div className="recent-chats">
      {recentChats.map((chat) => (
        <div
          key={chat.uid}
          className="team-member"
          onClick={() => handleMemberClick(chat)}
        >
          <img src={chat.avatar} alt={chat.name} className="avatar" />
          <div className="recent-chat-info">
            <p>{chat.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentChatsList;
