import axiosInstance from "../../config/axiosconfig";
import Config from "react-native-config";
import EventSource from "react-native-sse";

const URL_API = Config.URL_API;

export const fetchAIStream = (
  data: any,
  onDelta: (delta: any) => void,
  onDone: () => void,
  onEnd?: () => void   // thêm callback end
) => {
  const es = new EventSource(`${URL_API}/api/ai/lesson-chat-stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  es.addEventListener("message", (event) => {
    if (!event.data) return;

    // Check nếu AI gửi DONE hay END
    if (event.data.includes("[DONE]")) {
      es.close();
      onDone();
      return;
    }

    if (event.data.includes("[END]")) {
      es.close();
      onEnd && onEnd();
      return;
    }

    // Xử lý text bình thường
    try {
      const parsed = JSON.parse(event.data);
      // console.log(parsed);
      onDelta(parsed);
    } catch (err) {
      console.warn("Parse error:", err, event.data);
      onDelta({ text: event.data ?? "", end: false });
    }
  });

  es.addEventListener("error", (event) => {
    console.error("SSE error:", event);
    es.close();
  });

  return es;
};

export const startLessonAI = async (userId: any, lessonId: any, type: any) => {
    try {
      console.log(type, userId, lessonId);
      const response = await axiosInstance.post('/api/ai/start',{
          userId: userId, 
          lessonId: lessonId,
          type: type
      })   
      return response.data;
    } catch (error: any) {
      console.log('loi ne', error.message);
      throw Error ( error.message);
    }
}

export const EndLessonAI = async (userId: any, lessonId: any) => {
    try {
        const response = await axiosInstance.post('/api/ai/finish',{
            userId: userId, 
            lessonId: lessonId 
        })   
        return response.data;
    } catch (error: any) {
        throw Error (error.message);
    }
}

export const PauseLessonAI = async (userId: any, lessonId: any) => {
  try {
        const response = await axiosInstance.post('/api/ai/pause',{
            userId: userId, 
            lessonId: lessonId 
        })   
        return response.data;
    } catch (error: any) {
        throw Error (error.message);
    }
}

export const retakeLessonApi = async (userId: any, lessonId: any) => {
 try {
        const response = await axiosInstance.post('/api/ai/pause',{
            userId: userId, 
            lessonId: lessonId 
        })   
        return response.data;
    } catch (error: any) {
        throw Error (error.message);
    }
}

export const postRecord = async (data: FormData) => {
  try {
    const response = await axiosInstance.post('/api/ai/record/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};



