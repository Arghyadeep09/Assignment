/* eslint-disable react/display-name */
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, setRememberMe } from "../store/authSlice";
import "./../styles/Login.css";
import "boxicons";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { app } from "../firebaseConfig";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onSignUpClick = () => navigate("/signup");

  const auth = getAuth(app);
  const db = getFirestore(app);
  const googleProvider = new GoogleAuthProvider();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMeState] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      dispatch(
        setUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: userCredential.user.displayName,
        })
      );
      dispatch(setRememberMe(rememberMe));
      navigate("/DashBoard");
      console.log("User logged in:", userCredential.user);
    } catch (error) {
      console.error("Error logging in:", error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      dispatch(
        setUser({
          uid: result.user.uid,
          email: result.user.email,
          name: result.user.displayName,
        })
      );
      const user = result.user;
      // Save user data to Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email,
          name: user.displayName || "Anonymous",
          photoURL: user.photoURL || "",
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      ); // Merge prevents overwriting if the document already exists

      console.log(
        "User logged in with Google:",
        result.user.uid,
        result.user.email,
        result.user.email
      );
      dispatch(setRememberMe(rememberMe));
      navigate("/DashBoard");
    } catch (error) {
      console.error("Error with Google login:", error.message);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: " linear-gradient(#4dc9e6, #210cae)",
      }}
    >
      <div
        className="auth-container"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "rgba(0,0,0,0.3)",
        }}
      >
        <h2>Log In</h2>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
              style={{ outline: "none" }}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="options">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMeState(e.target.checked)}
              />{" "}
              Remember me
            </label>
          </div>

          <button className="auth-btn">Log in</button>
        </form>

        <div style={{}}>
          <p>
            Or Sign in with{" "}
            <button
              style={{
                border: "none",
                backgroundColor: "transparent",
                padding: "0",
              }}
              onClick={handleGoogleLogin}
              className="google"
            >
              <box-icon type="logo" name="google"></box-icon>
            </button>
          </p>
        </div>

        <p style={{ fontSize: "14px" }}>
          Don’t have an account?{" "}
          <button
            className="btn"
            onClick={onSignUpClick}
            style={{
              color: "#ffffff",
              textDecoration: "none",
              backgroundColor: "transparent",
              border: "none",
            }}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
