// teamMembersSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   
        teamMembers: [], // Start as an empty array  // Make sure it's initialized as an empty array
};

const teamMembersSlice = createSlice({
  name: "teamMembers",
  initialState,
  reducers: {
    setTeamMembers: (state, action) => {
        
      state.teamMembers = action.payload;
      console.log("Dispatched data:", action.payload);
    },
  },
});

export const { setTeamMembers } = teamMembersSlice.actions;
export default teamMembersSlice.reducer;