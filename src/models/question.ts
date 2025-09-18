export interface Question {
  _id: string;
  questionText: string;
  options: {
    _id: string;
    text: string;
    isCorrect?: boolean;
  }[];
  explanation: string;
}
