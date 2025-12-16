import User from "./user";
import lesson from "./lesson";

export interface LessonProgress {
  lesson: lesson;
  status: 'open' | 'close' | 'passed' | 'in_progress' | 'failed' | 'paused';
  retakeCount: number;
}

export interface Progress {
  _id: string;
  user: User;   
  Listlesson: LessonProgress[]; 
  progress: number;
  lastSummary: string;
  retakeCount: number;
  startedAt: Date | null;
  completedAt: Date | null;
  lastAccessedAt: Date | null;
  userName?: string;
}

