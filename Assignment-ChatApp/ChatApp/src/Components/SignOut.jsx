import { getAuth, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "./../store/authSlice";
import { useNavigate } from "react-router-dom";
import { app } from "../firebaseConfig";
import "./Logout.css";

const SignOut = () => {
  const dispatch = useDispatch();
  const auth = getAuth(app); // Explicitly pass the app instance
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // Retrieve the user from Redux state

  const handleSignOut = async () => {
    console.log("Current user in Redux:", user);
    if (!user) {
      console.error("No user is currently logged in.");
      return;
    }

    try {
      // Firebase Auth sign out
      await signOut(auth);
      console.log("User logged out successfully");

      // Clear Redux state and persist storage
      dispatch(clearUser());
      // await persistor.purge();
      localStorage.clear();
      console.log("Redux state cleared. Redirecting to home...");
      navigate("/"); // Redirect to Home
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="log-out" onClick={handleSignOut}>
      Log Out
    </div>
  );
};

export default SignOut;
