export default interface Lesson {
  _id: string;
  title: string;
  description?: string;
  vocabulary?: [{
    word: string;
    meaning: string;
    example: string;
  }];
  type: 'listening' | 'reading';
  order: number;
  content?: string; // văn bản, HTML, JSON...
  audioUrl: string;
  videoUrl:  string;
  maxScore:  number;
  passingScore: number;
  createdAt?: Date;
  updatedAt?: Date;
  status?: 'close' | 'open';
  
}