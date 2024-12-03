import "./InboxHeader.css"; // Import your CSS for styling
import "boxicons";
import { useSelector, useDispatch } from "react-redux";
import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { app } from "../firebaseConfig";
import { setTeamMembers } from "./../store/teamMembersSlice";
import EmojiPicker from "emoji-picker-react";
import loadingGif from "./../assets/a28a042da0a1ea728e75d8634da98a4e.gif";
import loadingImage from "./../assets/talking-1988-ezgif.com-gif-to-webm-converter.webm";
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
  updateDoc,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(false);
  const [selectedFont, setSelectedFont] = useState("Arial");
  console.log("selected font: " + selectedFont);

  const handleFontChange = async (e) => {
    const newFont = e.target.value;

    try {
      const chatRoomRef = doc(db, "chatrooms", selectedChatRoom.id);
      await updateDoc(chatRoomRef, { font: newFont });
      setSelectedChatRoom((prev) => ({
        ...prev,
        font: newFont,
      }));
    } catch (error) {
      console.error("Error updating chatroom font:", error);
      alert("Failed to update font. Please try again.");
    }
  };
  useEffect(() => {
    if (selectedChatRoom?.id) {
      const chatRoomRef = doc(db, "chatrooms", selectedChatRoom.id);

      const unsubscribe = onSnapshot(chatRoomRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const chatRoomData = docSnapshot.data();
          setSelectedFont(chatRoomData.font || "Arial"); // Default to Arial if no font is set
        }
      });

      return () => unsubscribe();
    }
  }, [selectedChatRoom?.id, db]);

  // eslint-disable-next-line no-unused-vars
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
  // Fetch chat rooms from Firestore and store them in Redux

  // clean up the
  useEffect(() => {
    if (selectedChatRoom?.id) {
      // Reference to the chat room document in Firestore
      const chatRoomRef = doc(db, "chatrooms", selectedChatRoom.id);

      // Set up a listener to get the latest font data
      const unsubscribe = onSnapshot(chatRoomRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const chatRoomData = docSnapshot.data();
          if (chatRoomData.font) {
            // console.log("font:", chatRoomData.font);
            setSelectedFont(chatRoomData.font); // Update the font in state
          }
        }
      });

      // Cleanup listener on component unmount or chat room change
      return () => unsubscribe();
    }
  }, [selectedChatRoom?.id, db]);

  useEffect(() => {
    let unsubscribe = null;

    if (selectedChatRoom?.id) {
      // Set up a listener for the current chat room
      const chatMessagesQuery = query(
        collection(db, "chatrooms", selectedChatRoom.id, "messages"),
        orderBy("timestamp", "asc")
      );

      unsubscribe = onSnapshot(chatMessagesQuery, (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChatMessages(messages);
      });
    }

    // Cleanup function to unsubscribe when the component unmounts or chat room changes
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [selectedChatRoom, db]);
  useEffect(() => {
    if (selectedChatRoom?.id) {
      // Listen for changes to the selected chat room
      const chatRoomRef = doc(db, "chatrooms", selectedChatRoom.id);

      const unsubscribe = onSnapshot(chatRoomRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const chatRoomData = docSnapshot.data();
          if (chatRoomData.color !== selectedChatRoom.color) {
            // Update local state with the latest color from Firestore
            setSelectedChatRoom((prev) => ({
              ...prev,
              color: chatRoomData.color,
            }));
          }
        }
      });

      // Cleanup listener on unmount or chat room change
      return () => unsubscribe();
    }
  }, [selectedChatRoom?.id, db]);

  console.log(useSelector((state) => state.auth.user));
  const teamMembers = useSelector((state) => state.teamMembers.teamMembers);
  const sortedTeamMembers = [...teamMembers].sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );

  console.log(sortedTeamMembers);
  const filteredAndSortedTeamMembers = searchQuery.trim()
    ? teamMembers
        .filter(
          (member) =>
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
          // Check name matches
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          const query = searchQuery.toLowerCase();

          const nameAIndex = nameA.indexOf(query);
          const nameBIndex = nameB.indexOf(query);

          // Prioritize matches at the beginning of the name
          if (nameAIndex !== nameBIndex) return nameAIndex - nameBIndex;

          // If name matches equally, compare email matches
          const emailA = a.email.toLowerCase();
          const emailB = b.email.toLowerCase();

          const emailAIndex = emailA.indexOf(query);
          const emailBIndex = emailB.indexOf(query);

          return emailAIndex - emailBIndex;
        })
    : sortedTeamMembers; // Show all team members when search is empty
  // open chat room on clicking
  const handleMemberClick = async (member) => {
    try {
      if (!user?.uid || !member?.uid) {
        console.error("User or member UID is undefined");
        return;
      }

      // Generate a consistent unique key for the chat room based on participant IDs
      const participantIds = [user.uid, member.uid].sort().join("-");
      console.log("Generated participantIds:", participantIds);

      if (!participantIds) {
        console.error("Invalid participantIds");
        return;
      }

      // Query for an existing chat room using the unique participantIds
      const chatRoomQuery = query(
        collection(db, "chatrooms"),
        where("participantIds", "==", participantIds)
      );

      const querySnapshot = await getDocs(chatRoomQuery);

      if (!querySnapshot.empty) {
        // Chat room exists
        const chatRoom = querySnapshot.docs[0].data();
        console.log("Chat room exists:", chatRoom);

        setSelectedChatRoom({
          id: querySnapshot.docs[0].id,
          ...chatRoom,
        });
        setSelectedMember(member);

        // Fetch and listen to messages in the chat room
        const chatMessagesQuery = query(
          collection(db, "chatrooms", querySnapshot.docs[0].id, "messages"),
          orderBy("timestamp", "asc")
        );

        onSnapshot(chatMessagesQuery, (snapshot) => {
          const messages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setChatMessages(messages);
        });
      } else {
        // No existing chat room, create a new one
        const newChatRoomRef = await addDoc(collection(db, "chatrooms"), {
          participantIds: participantIds, // Unique identifier for this chat room
          participants: [user.uid, member.uid], // Array of participant IDs
          color: "#ffffff",
          font: "Arial",
          createdAt: serverTimestamp(),
        });

        console.log("Created new chat room:", newChatRoomRef.id);

        setSelectedChatRoom({
          id: newChatRoomRef.id,
          participants: [user.uid, member.uid],
        });
        setSelectedMember(member);
        setChatMessages([]); // No messages in a new chat room
      }
    } catch (error) {
      console.error("Error fetching or creating chat room:", error);
    }
  };

  // store all members who is currently having a chat room with the user
  useEffect(() => {
    const fetchRecentChats = async () => {
      try {
        const chatPromises = teamMembers.map(async (member) => {
          const participantIds = [user.uid, member.uid].sort().join("-");

          // Query to find if there is a chat room for the current user and the team member
          const chatRoomQuery = query(
            collection(db, "chatrooms"),
            where("participantIds", "==", participantIds)
          );
          const querySnapshot = await getDocs(chatRoomQuery);

          if (!querySnapshot.empty) {
            // If chat room exists, add the member to recentChats state
            setRecentChats((prevChats) => {
              if (!prevChats.some((chat) => chat.uid === member.uid)) {
                return [...prevChats, member];
              }
              return prevChats;
            });
          }
        });

        // Wait for all promises to complete
        await Promise.all(chatPromises);
      } catch (error) {
        console.error("Error fetching recent chats:", error);
        setError(error.message);
      }
    };

    if (teamMembers.length > 0) {
      fetchRecentChats();
    }
  }, [teamMembers, user, db]);

  // Fetch chat messages for the selected chat room

  //send message to the server and return results
  const sendMessage = async () => {
    if (newMessage.trim() === "") {
      return; // Do not send empty messages
    }
    console.log(selectedChatRoom.id);
    console.log(selectedChatRoom.participantIds);

    if (!selectedChatRoom) {
      console.error("No chat room selected.");
      return;
    }

    try {
      const chatRoomId = selectedChatRoom.id;
      const receiverId = selectedChatRoom.participantIds
        .replace(user.uid, "")
        .trim();

      if (!receiverId) {
        console.error("Receiver ID could not be determined.");
        return;
      }

      await addDoc(collection(db, "chatrooms", chatRoomId, "messages"), {
        text: newMessage,
        senderId: user.uid,
        receiverId: receiverId,
        timestamp: serverTimestamp(),
      });

      // Clear the input field after sending
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };
  console.log(selectedMember);
  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f8f8", // Optional background color
        }}
      >
        <img
          src={loadingGif}
          alt="Loading..."
          style={{ minHeight: "50%", minWidth: "50%", objectFit: "fill" }}
        />
      </div>
    );
  }

  if (error) return <div>error</div>;
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarActive ? "active" : ""}`}>
        {sidebarActive && (
          <box-icon
            name="x"
            onClick={() => setSidebarActive(!sidebarActive)}
          ></box-icon>
        )}
        <h2 className="app-title">Chatter</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for team members..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Team Members */}
        {/* Team Members */}
        <h3>Team Members</h3>
        <div className="team-members">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : filteredAndSortedTeamMembers.length > 0 ? (
            filteredAndSortedTeamMembers.map((member) => (
              <div
                key={member.uid}
                className="team-member"
                onClick={() => handleMemberClick(member)}
              >
                <img src={member.avatar} alt={member.name} className="avatar" />
                <div>
                  <p>{member.name}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No team members found</p>
          )}
        </div>

        {/* Recent Chats */}
        <h3>Recent Chats</h3>
        <div className="recent-chats">
          {recentChats.length > 0 ? (
            recentChats.map((member) => (
              <div
                key={member.uid}
                className="team-member"
                onClick={() => handleMemberClick(member)}
              >
                <img src={member.avatar} alt={member.name} className="avatar" />
                <div className="recent-chat-info">
                  <p>{member.name}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No recent chats found</p>
          )}
        </div>
      </div>

      {/* Main Chat Section */}
      <div className="main-chat">
        <div className="chat-header">
          <div className="header-container">
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div className="menu-icon">
                <box-icon
                  name="menu"
                  onClick={() => setSidebarActive(!sidebarActive)}
                ></box-icon>
              </div>
              <h2>Messages</h2>
            </div>
            <div className="chat-header-right">
              <div className="header-right">
                <div className="notification-icon"></div>
                <div className="profile">
                  <img
                    src="http://placehold.co/40x40"
                    alt="profile of user"
                    className="profile-picture"
                  />
                  <span className=" profile-name">{user.name}</span>
                  <div className="color-picker" style={{ marginLeft: "5px" }}>
                    <label htmlFor="colorPicker">
                      <box-icon
                        type="solid"
                        name="color"
                        color={selectedChatRoom?.color || "#fff"} // Correct JSX syntax
                      ></box-icon>
                    </label>
                    <input
                      type="color"
                      id="colorPicker"
                      value={selectedChatRoom?.color || "#fff"}
                      onChange={async (e) => {
                        const newColor = e.target.value;

                        try {
                          // Update Firestore
                          const chatRoomRef = doc(
                            db,
                            "chatrooms",
                            selectedChatRoom.id
                          );
                          await updateDoc(chatRoomRef, {
                            color: newColor,
                          });

                          // Update local state to reflect color change immediately
                          setSelectedChatRoom((prev) => ({
                            ...prev,
                            color: newColor,
                          }));
                        } catch (error) {
                          console.error(
                            "Error updating chatroom color:",
                            error
                          );
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* //{selectedChatRoom && <p>Chat Room: {selectedChatRoom.id}</p>} */}
        </div>
        {selectedMember == null && (
          <div
            style={{
              height: "90vh",
              width: "100%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgb(246, 242, 225)", // Optional background color
            }}
          >
            <video
              src={loadingImage}
              autoPlay
              loop
              muted
              alt="start chat "
              width={600}
              style={{ objectFit: "contain" }}
            ></video>
          </div>
        )}

        {selectedMember !== null && (
          <div className="chat-header">
            <div className="profile">
              <img
                src="http://placehold.co/40x40"
                alt="Profile"
                className="profile-picture"
              />
              <span className="profile-name">{selectedMember.name}</span>
              <i className="fas fa-chevron-down profile-icon"></i>
            </div>
            <div style={{ fontFamily: selectedFont }}>
              <div className="font-selector">
                <label htmlFor="font-dropdown">Choose Font:</label>
                <select
                  id="font-dropdown"
                  className="font-dropdown"
                  value={selectedFont}
                  onChange={handleFontChange}
                >
                  <option value="Arial">Arial</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                </select>
              </div>
            </div>
          </div>
        )}
        {/* Chat Messages */}

        {selectedMember !== null && (
          <div
            className="chat-messages"
            style={{
              backgroundColor: selectedChatRoom?.color || "#ffffff", // Default white
              padding: "10px",
              borderRadius: "8px",
              fontFamily: selectedFont,
            }}
          >
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.senderId === user.uid ? "sent" : "received"
                }`}
              >
                <p className="message-text">{message.text}</p>
                <span className="message-time">
                  {new Date(message.timestamp?.toDate()).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
        {/* Message Input */}
        {selectedMember !== null && (
          <div className="chat-input" style={{ position: "relative" }}>
            {/* Emoji Picker Toggle Button */}
            <button
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="emoji-picker-button"
              style={{ marginRight: "10px" }}
            >
              <box-icon name="happy" size="lg"></box-icon>
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
        )}
      </div>
    </div>
  );
};

export default DashBoard;
//block
