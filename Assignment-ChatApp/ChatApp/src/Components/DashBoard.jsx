import "./InboxHeader.css"; // Import your CSS for styling
import "boxicons";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { app } from "../firebaseConfig";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const DashBoard = () => {
  const db = getFirestore(app);
  const user = useSelector((state) => state.auth.user);

  const [teamMembers, setTeamMembers] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  // Fetch team members from Firestore
  useEffect(() => {
    const fetchTeamMembers = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const fetchedUsers = usersSnapshot.docs
        .map((doc) => doc.data())
        .filter((member) => member.uid !== user.uid); // Exclude the current user
      setTeamMembers(fetchedUsers);
    };

    fetchTeamMembers();
  }, [user]);

  // Fetch recent chat rooms
  useEffect(() => {
    const fetchChatRooms = () => {
      const chatRoomsRef = collection(db, "chatRooms");
      const q = query(
        chatRoomsRef,
        where("participants", "array-contains", user.uid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedChats = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecentChats(fetchedChats);
      });

      return () => unsubscribe();
    };

    fetchChatRooms();
  }, [user]);

  // Fetch messages for the selected chat room
  useEffect(() => {
    if (selectedChatRoom) {
      const messagesRef = collection(
        db,
        "chatRooms",
        selectedChatRoom.id,
        "messages"
      );
      const q = query(messagesRef, orderBy("timestamp", "asc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => doc.data());
        setChatMessages(fetchedMessages);
      });

      return () => unsubscribe();
    }
  }, [selectedChatRoom]);

  // Create a new chat room
  const createChatRoom = async (participant) => {
    const existingRoom = recentChats.find((room) =>
      room.participants.includes(participant.uid)
    );

    if (!existingRoom) {
      await addDoc(collection(db, "chatRooms"), {
        participants: [user.uid, participant.uid],
        createdAt: serverTimestamp(),
      });
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (selectedChatRoom && newMessage.trim() !== "") {
      const messagesRef = collection(
        db,
        "chatRooms",
        selectedChatRoom.id,
        "messages"
      );
      await addDoc(messagesRef, {
        text: newMessage,
        sender: user.uid,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="app-title">Chatter</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for chat here"
            className="search-input"
          />
        </div>

        {/* Team Members */}
        <div className="team-members">
          <h3>Team Members</h3>
          {teamMembers.map((member) => (
            <div key={member.uid} className="team-member">
              <img src={member.avatar} alt={member.name} className="avatar" />
              <div>
                <p>{member.name}</p>
                <button onClick={() => createChatRoom(member)}>Chat</button>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Chats */}
        <div className="recent-chats">
          <h3>Recent Chats</h3>
          {recentChats.map((chat) => (
            <div
              key={chat.id}
              className="chat-item"
              onClick={() => setSelectedChatRoom(chat)}
            >
              <p>Chat Room ID: {chat.id}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Section */}
      <div className="main-chat">
        <div className="chat-header">
          <h2>Messages</h2>
          {selectedChatRoom && <p>Chat Room: {selectedChatRoom.id}</p>}
        </div>

        {/* Chat Messages */}
        <div className="chat-messages">
          {chatMessages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.sender === user.uid ? "sent" : "received"
              }`}
            >
              <p className="message-text">{message.text}</p>
              <span className="message-time">
                {new Date(message.timestamp?.toDate()).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="chat-input">
          <input
            type="text"
            placeholder="Enter your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <box-icon name="send" onClick={sendMessage}></box-icon>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
