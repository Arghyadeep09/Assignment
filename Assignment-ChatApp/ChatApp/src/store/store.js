import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; 
import authReducer from "./authSlice";  
import teamMembersReducer from  "./teamMembersSlice" 


const persistConfig = {
  key: "root",
  storage,
};
 
const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    teamMembers: teamMembersReducer, // Use the persisted reducer  
   

  },
});

export const persistor = persistStore(store);
