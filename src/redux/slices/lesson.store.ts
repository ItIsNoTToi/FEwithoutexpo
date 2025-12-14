import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Lesson from "../../models/lesson";

interface LessonState {
  Lesson: Lesson | null;
  Lessons: Lesson[];
}

const initialState: LessonState = {
  Lesson: null,
  Lessons: [],
};

const lessonSlice = createSlice({
  name: "lesson",
  initialState,
  reducers: {
    setSelectLesson: (state, action: PayloadAction<Lesson|null>) => {
      state.Lesson = action.payload;
    },
    setLessons: (state, action: PayloadAction<Lesson[]>) => {
      state.Lessons = action.payload;
    },
    resetLesson: (state) => {
      state.Lesson = null;
      state.Lessons = [];
    },
  },
});

export const { setSelectLesson, setLessons, resetLesson } = lessonSlice.actions;
export default lessonSlice.reducer;
