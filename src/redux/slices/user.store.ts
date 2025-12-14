import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  _id: string
}

const initialState: UserState = {
  _id: ""
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<UserState>) => {
      state._id = action.payload._id;
    },
    resetUser: (state) => {
      state._id = "";
    },
  },
});

export const { setUserId, resetUser } = userSlice.actions;
export default userSlice.reducer;
