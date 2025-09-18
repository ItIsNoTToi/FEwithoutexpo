import User from "./user";
import Lesson from "./lesson";

export interface ListeningResult{
  _id: string,
  user: User,
  lesson: Lesson,
  status: 'not started' | 'in progress' | 'completed',
  score: number,
  createdAt: Date,
  updatedAt: Date
}