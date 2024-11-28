import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  teamMembers: [],
};

const teamMembersSlice = createSlice({
  name: "teamMembers",
  initialState,
  reducers: {
    setTeamMember: (state, action) => {
      state.teamMembers = action.payload;
    },
  },
});
export const { setTeamMembers } = teamMembersSlice.actions;
export default teamMembersSlice.reducer;
