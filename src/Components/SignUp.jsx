/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */

import "./../styles/Signup.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  getAuth,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { app } from "../firebaseConfig";
import { toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onLoginClick = () => {
    navigate("/Login");
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const db = getFirestore(app);
  const auth = getAuth(app);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!"); // Show error using toast
      return;
    }
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update the user's profile with first and last name
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });
      //console.log(userCredential);

      dispatch(
        setUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: userCredential.user.displayName,
        })
      );

      const userRef = doc(db, "users", userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: userCredential.user.displayName,
          avatar: "https://placehold.co/40x40",
          createdAt: new Date().toISOString(),
        });
        //console.log("New user added to Firestore");
      }

      //console.log("User signed up:", userCredential.user);
      //console.log("User full name:", userCredential.user.displayName);
      navigate("/DashBoard");
    } catch (error) { 
       if (error.code === "auth/email-already-in-use") {
         // Specific check for email already in use error
         toast.error("Email is already in use! Please try another email.");
       } else {
         // Handle other errors generically
         toast.error(`Error: ${error.message}`);
       }
     //console.error("Error signing up:", error.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSignUp}>
          <div className="row">
            <input
              type="text"
              placeholder="First Name"
              required
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              required
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group" style={{ position: "relative" }}>
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Password"
              aria-label="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              style={{ position: "absolute", top: "22px", right: "10px" }}
              type="button"
              className="toggle-password"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? "Hide" : "Show"}
            </button>
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button className="signup-btn">Sign up</button>
        </form>

        <p className="signin-link" style={{ color: "#fff" }}>
          Already have an account?{" "}
          <button
            className="btn"
            onClick={onLoginClick}
            style={{
              padding: "10px",
              border: "none",
              fontSize: "15px",
            }}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
