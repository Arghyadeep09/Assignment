/* eslint-disable react/prop-types */
import { doc, updateDoc } from "firebase/firestore";

const FontTypeSelector = ({
  db,
  selectedChatRoom,
  setSelectedChatRoom,
  selectedFont,
  setSelectedFont,
}) => {
  const handleFontChange = async (e) => {
    const newFont = e.target.value;

    // Update Firestore with the new font type
    try {
      const chatRoomRef = doc(db, "chatrooms", selectedChatRoom.id);
      await updateDoc(chatRoomRef, {
        font: newFont,
      });

      // Update local state
      setSelectedFont(newFont);
      setSelectedChatRoom((prev) => ({
        ...prev,
        font: newFont,
      }));
    } catch (error) {
      console.error("Error updating font type:", error);
    }
  };

  return (
    <div className="font-selector">
      <label htmlFor="font-dropdown">Choose Font:</label>
      <select
        id="font-dropdown"
        className="font-dropdown"
        value={selectedFont}
        onChange={handleFontChange}
        style={{ fontFamily: selectedFont }}
      >
        <option value="Arial" style={{ fontFamily: "Arial" }}>
          Arial
        </option>
        <option value="Roboto" style={{ fontFamily: "Roboto" }}>
          Roboto
        </option>
        <option value="Poppins" style={{ fontFamily: "Poppins" }}>
          Poppins
        </option>
        <option
          value="Times New Roman"
          style={{ fontFamily: "Times New Roman" }}
        >
          Times New Roman
        </option>
        <option value="Courier New" style={{ fontFamily: "Courier New" }}>
          Courier New
        </option>
      </select>
    </div>
  );
};

export default FontTypeSelector;
