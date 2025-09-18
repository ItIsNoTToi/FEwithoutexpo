import Lesson from "./lesson"
import user from "./user"

export interface chatlog{
    user: user,
    messages: [
        {
            role: 'user'| 'ai',
            content: String,
            timestamp: Date
        }
    ],
  lesson: Lesson,
  createdAt: Date
}