import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../config/axiosconfig";

export const GetQuiz = async () => {
    try {
        const response = await axiosInstance.get('/api/quizs');
        if(response.data.success === true){
            return response.data;
        }
    } catch (error) {
        return error;
    }
}

export const getQuestionByQuizId = async (quizId: string) => {
    try {
        const response = await axiosInstance.get(`/api/quizs/${quizId}/questions`);
        if(response.data.success === true){
            // console.log(response.data);
            return response.data;
        }
    } catch (error) {
        return error;
    }
}

export const SaveHistoryQuiz = async (
  quizId: string,
  score: number,
  totalQuestions: number,
  percent: number
) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axiosInstance.post(
      '/api/quiz/save/add',
      {
        quizId,
        score,
        totalQuestions,
        percent,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error saving quiz history:", error);
    throw error;
  }
};


