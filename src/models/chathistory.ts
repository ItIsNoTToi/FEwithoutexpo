import Lesson from "./lesson"
import { Progress } from "./progress"
import user from "./user"

export interface chatlog{
    user: user,
    progress: Progress,
    history: [
        {
            role: 'user'| 'system' | 'assistant',
            content: String,
            stepId: Number,
            createdAt: Date
        }
    ],
    summaries: [
        {
            content: String,
            fromIndex: Number,
            toIndex: Number,
            createdAt: Date
        }
    ],
    isSummarized: Boolean,
    lesson: Lesson,
    createdAt: Date
}
