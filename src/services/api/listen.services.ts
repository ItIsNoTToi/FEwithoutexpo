import axiosInstance from "../../config/axiosconfig";
// import { URL_API } from "@env";

export const getLessonAudio = async (lessonId: string) => {
  try {
    // console.log(lessonId);
    const res = await axiosInstance.get(`/api/lesson/${lessonId}/audio`);
    const data = res.data;
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

// export const playLessonAudio = async (
//   lessonId: string,
//   onFinish: (question: string) => void
// ): Promise<string | null> => {
//   try {
//     const res = await axios.get(`/api/listen/${lessonId}/AIGenerateAudio`);
//     const data = res.data;

//     if (data.audioUrl) {
//       const fullUrl = `${URL_API}${data.audioUrl}`;
//       const { Audio } = await import("expo-av");
//       const { sound } = await Audio.Sound.createAsync({ uri: fullUrl });
//       await sound.playAsync();

//       sound.setOnPlaybackStatusUpdate(async (status) => {
//         if (status.isLoaded && status.didJustFinish) {
//           const qRes = await axios.post(`/api/listen/${lessonId}/ask`, {});
//           onFinish(qRes.data.question);
//         }
//       });

//       return fullUrl;
//     }
//     return null; // 👈 đảm bảo luôn trả về null khi không có audio
//   } catch (err) {
//     console.error("Error playing lesson audio:", err);
//     return null;
//   }
// };

// Gửi câu trả lời học viên để AI chấm điểm
export const sendAnswer = async (
  lessonId: string,
  userAnswer: string,
  onResult: (feedback: string) => void
) => {
  try {
    const res = await axiosInstance.post(`/api/listen/${lessonId}/ask`, { userAnswer });
    onResult(res.data.feedback);
  } catch (err) {
    console.error("Error sending answer:", err);
  }
};

export const EndLessonListening = async (userId: any, lessonId: any) => {
    try {
        const response = await axiosInstance.post('/api/listen/finish',{
            userId: userId, 
            lessonId: lessonId 
        })   
        return response.data;
    } catch (error: any) {
        throw Error (error.message);
    }
}