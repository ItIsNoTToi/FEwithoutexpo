import Lesson from './lesson';
import { Question } from './question';

export interface Quiz {
    _id: string,
    title: string,
    description: string,
    status: 'not started' | 'in progress' | 'completed', // union type thay cho enum mongoose
    level: 'beginner' | 'intermediate' | 'advanced',    // union type
    Question: Question, // hoặc Question[] nếu 1 quiz có nhiều câu hỏi
    score: number,
    Lesson: Lesson,
}
