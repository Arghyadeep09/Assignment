import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session"; // sessionStorage
import authReducer from "./authSlice";
import teamMembersReducer from "./teamMembersSlice";
import createTransform from "redux-persist/es/createTransform";

// Custom transform to clear user data if `rememberMe` is false
const rememberMeTransform = createTransform(
  (inboundState) => {
    if (inboundState.rememberMe) {
      return inboundState; // Persist state if rememberMe is true
    }
    return { ...inboundState, user: null }; // Clear user if rememberMe is false
  },
  null,
  { whitelist: ["auth"] }
);

const persistConfig = {
  key: "auth",
  storage: storageSession, // Use sessionStorage
  transforms: [rememberMeTransform], // Apply transform to handle rememberMe logic
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    teamMembers: teamMembersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Avoid serializable check issues
    }),
});

export const persistor = persistStore(store);
