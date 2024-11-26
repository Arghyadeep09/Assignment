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
const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onLoginClick = () => {
    navigate("/Login");
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const db = getFirestore(app);
  const auth = getAuth(app);

  const handleSignUp = async (e) => {
    e.preventDefault();
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
      dispatch(
        setUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: userCredential.user.name,
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
        console.log("New user added to Firestore");
      }

      console.log("User signed up:", userCredential.user);
      console.log("User full name:", userCredential.user.displayName);
      navigate("/DashBoard");
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Sign Up</h2>

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

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input type="password" placeholder="Confirm Password" required />
          </div>

          <button className="signup-btn">Sign up</button>
        </form>

        <p className="signin-link">
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
