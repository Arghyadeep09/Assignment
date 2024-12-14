import "./InboxHeader.css"; // Import your CSS for styling
import "boxicons";
import { useSelector, useDispatch } from "react-redux";
import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { app } from "../firebaseConfig";
import { setTeamMembers } from "./../store/teamMembersSlice";
import loadingGif from "./../assets/a28a042da0a1ea728e75d8634da98a4e.gif";
import loadingImage from "./../assets/talking-1988-ezgif.com-gif-to-webm-converter.webm";
import { useNavigate } from "react-router-dom";
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

}
  from "firebase/firestore";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import ChatProfileHeader from "./ChatProfileHeader";

const DashBoard = () => {
  const db = getFirestore(app);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //sconst [teamMembers, setTeamMembers] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState(null); //background color
  // text color
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(false);
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [timeStampColor, setTimeStampColor] = useState(" #718096");
  console.log("selected font: " + selectedFont);
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
          if (chatRoomData.textColor !== selectedChatRoom.textColor) {
            setSelectedChatRoom((prev) => ({
              ...prev,
              textColor: chatRoomData.textColor,
            }));
            console.log("color" + chatRoomData.textColor);
          }
        }
      });

      // Cleanup listener on unmount or chat room change
      return () => unsubscribe();
    }
  }, [
    selectedChatRoom?.id,
    db,
    selectedChatRoom?.textColor,
    selectedChatRoom?.color,
  ]);

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

          if (nameAIndex !== nameBIndex) return nameAIndex - nameBIndex;
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
      if (!user) {
        return <div>Please log in to access your dashboard.</div>;
      }
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
          textColor: "#000000",
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
  const handleEmojiSelect = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false); // Close the emoji picker
  };
  console.log(selectedMember);
  useEffect(() => {
    if (!user) {
      // Navigate to home after sign-out
      navigate("/");
    }
  }, [user, navigate]); // Depend on user and navigate
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
      <Sidebar
        sidebarActive={sidebarActive}
        setSidebarActive={setSidebarActive}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredAndSortedTeamMembers={filteredAndSortedTeamMembers}
        recentChats={recentChats}
        loading={loading}
        error={error}
        handleMemberClick={handleMemberClick}
      />

      {/* Main Chat Section */}
      <div className="main-chat">
        {/* Top Chat Header */}
        <ChatHeader
          user={user}
          sidebarActive={sidebarActive}
          setSidebarActive={setSidebarActive}
          selectedChatRoom={selectedChatRoom}
        />

        {/* If no member is selected, show placeholder */}
        {selectedMember == null ? (
          <div
            style={{
              height: "90vh",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgb(246, 242, 225)",
            }}
          >
            <video
              src={loadingImage}
              autoPlay
              loop
              muted
              alt="Start Chat"
              width={600}
              style={{ objectFit: "contain" }}
            ></video>
          </div>
        ) : (
          <>
            {/* Member-Specific Header */}
            <ChatProfileHeader
              selectedMember={selectedMember}
              selectedChatRoom={selectedChatRoom}
              selectedFont={selectedFont}
              setSelectedFont={setSelectedFont}
              setTimeStampColor={setTimeStampColor}
            />

            {/* Chat Messages */}
            <ChatMessages
              chatMessages={chatMessages}
              user={user}
              selectedChatRoom={selectedChatRoom}
              timeStampColor={timeStampColor}
              selectedFont={selectedFont}
            />

            {/* Chat Input */}
            <ChatInput
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              sendMessage={sendMessage}
              showEmojiPicker={showEmojiPicker}
              setShowEmojiPicker={setShowEmojiPicker}
              handleEmojiSelect={handleEmojiSelect}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default DashBoard;

