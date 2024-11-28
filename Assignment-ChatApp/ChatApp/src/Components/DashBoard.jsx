import "./InboxHeader.css"; // Import your CSS for styling
import "boxicons";
import { useSelector, useDispatch } from "react-redux";
import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { app } from "../firebaseConfig";
import { setTeamMembers } from "./../store/teamMembersSlice";
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
  const dispatch = useDispatch();
  //sconst [teamMembers, setTeamMembers] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();
  // Fetch team members from Firestore
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const fetchedUsers = usersSnapshot.docs
          .map((doc) => ({
            uid: doc.id,
            name: doc.data().name,
            email: doc.data().email,
            avatar: doc.data().avatar || "https://placehold.co/40x40",
          }))
          .filter((member) => member.uid !== user.uid); // Exclude the current user
        console.log(fetchedUsers);

        dispatch(setTeamMembers(fetchedUsers));
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (user) fetchTeamMembers();
  }, [user, db, dispatch]);

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

  const teamMembers = useSelector((state) => state.teamMembers.teamMembers);
  if (loading) return <div>loadins</div>;
  if (error) return <div>error</div>;
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
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : teamMembers && teamMembers.length > 0 ? (
            teamMembers.map((member) => (
              <div key={member.uid} className="team-member">
                <img src={member.avatar} alt={member.name} className="avatar" />
                <div>
                  <p>{member.name}</p>
                  <button onClick={() => createChatRoom(member)}>Chat</button>
                </div>
              </div>
            ))
          ) : (
            <p>No team members available</p>
          )}
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
          <div className="header-container">
            <h2>Messages</h2>
            <div className="chat-header-right">
              <div className="header-right">
                <div className="notification-icon">
                  <box-icon type="solid" name="bell"></box-icon>
                </div>
                <div className="profile">
                  <img
                    src="http://placehold.co/40x40"
                    alt="profile of user"
                    className="profile-picture"
                  />
                  <span className=" profile-name">{user.name}</span>
                </div>
              </div>
            </div>
          </div>
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
//block
