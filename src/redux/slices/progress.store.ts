import { LessonProgress } from './../../models/progress';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Progress } from "../../models/progress";

interface ProgressState {
  progress: Progress | null
}

const initialState: ProgressState = {
  progress: null
};

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    setProgress: (state, action: PayloadAction<Progress | null>) => {
      state.progress = action.payload;
    },
    updateProgress: (state, action: PayloadAction<LessonProgress>) => {
      if (!state.progress) return;
      const lessonProgress = action.payload;
      const exists = state.progress.Listlesson.find(l => l.lesson._id === lessonProgress.lesson._id);
      if (!exists) {
          state.progress.Listlesson.push(lessonProgress);
      } else {
          exists.status = lessonProgress.status;
          exists.retakeCount++;
      }
      // cập nhật tổng progress
      state.progress.progress = Math.floor(
          (state.progress.Listlesson.filter(l => l.status === 'passed').length / state.progress.Listlesson.length) * 100
      );
    },
    resetProgress: (state) => {
      state.progress = null;
    },
  },
});

export const { setProgress, updateProgress, resetProgress } = progressSlice.actions;
export default progressSlice.reducer;
