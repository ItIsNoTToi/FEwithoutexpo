import User from "./user";
import Lesson from "./lesson";

export interface progress{
  _id: string,
  user: User,
  lesson: Lesson,
  status: 'not_started' | 'in_progress' | 'completed' | 'paused',
  score: number,
  isUnlocked: boolean,
  progress:    number,
  retakeCount: number,
  startedAt:  Date,
  completedAt: Date,
  lastAccessedAt: Date,
}