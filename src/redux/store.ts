import { configureStore } from '@reduxjs/toolkit';
import LessonReducer from './slices/lesson.store';
import userReducer from './slices/user.store';
import progressReducer from './slices/progress.store';

export const store =  configureStore({
  reducer: {
    lesson: LessonReducer,
    user: userReducer,
    progress: progressReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store