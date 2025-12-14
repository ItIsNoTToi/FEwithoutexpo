export default interface Lesson {
  _id: string;
  title: string;
  description?: string;
  type: 'listening' | 'reading' | 'topic';
  order: number;
  content?: string; 
  audioUrl: string;
  videoUrl:  string;
  readingpassage: string;
  maxScore:  number;
  passingScore: number;
  duration: number;
  nextLesson: Lesson;
  createdAt?: Date;
  updatedAt?: Date;
  status?: 'close' | 'open';
  steps: [{
    id: number;
    prompt: string;
    expectd: string;
    aiRole: string;
    resources: string;
  }];
  endMessage: string;
}