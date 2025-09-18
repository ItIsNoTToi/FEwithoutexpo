import { configureStore } from '@reduxjs/toolkit';
import LessonReducer from './slices/lesson.store';

export const store =  configureStore({
  reducer: {
    lesson: LessonReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store