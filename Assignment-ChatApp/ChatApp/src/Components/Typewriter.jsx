import React, { useState, useEffect } from "react";

const Typewriter = () => {
  const text = " with Chatter...";
  const [currentText, setCurrentText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const typeWriter = () => {
      if (index < text.length) {
        setCurrentText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      } else {
        setTimeout(() => {
          setCurrentText("");
          setIndex(0);
        }, 1000); // Delay before restarting the animation
      }
    };

    const timeout = setTimeout(typeWriter, 500); // Adjust typing speed here
    return () => clearTimeout(timeout); // Cleanup timeout to prevent memory leaks
  }, [index]);

  return <div id="typewriter">{currentText}</div>;
};

export default Typewriter;
