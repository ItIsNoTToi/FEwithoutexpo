import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Lesson from "../../models/lesson";


interface LessonState {
  selectedLesson: Lesson | null;
  history: Lesson[];
}

const initialState: LessonState = {
  selectedLesson: null,
  history: [],
};

const lessonSlice = createSlice({
  name: "lesson",
  initialState,
  reducers: {
    setLesson: (state, action: PayloadAction<Lesson>) => {
      state.selectedLesson = action.payload;
    },
  },
});

export const { setLesson } = lessonSlice.actions;
export default lessonSlice.reducer;
