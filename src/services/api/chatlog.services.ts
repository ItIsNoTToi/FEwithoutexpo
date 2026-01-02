// import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../config/axiosconfig";
// import { useQuery } from "@tanstack/react-query";

export const fetchChatlog = async (userId: any, lessonId: any) => {
    try {

        // console.log(userId, lessonId);
        const response = await axios.post('/api/getchathistory',
        {
            userId: userId, 
            lessonId: lessonId
        })

        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const resetChatlogApi = async (userId: any, lessonId: any) => {
   try {
        // console.log(userId, lessonId);
        const response = await axios.post("/api/chatlog/clear", { userId, lessonId });
        return response.data;
    } catch (error) {
        console.error(error);
    } 
};

// async function getChatlogCached(userId: string, lessonId: string) {
//   const cacheKey = `chatlog:${userId}:${lessonId}`;

//   // lấy từ AsyncStorage trước
//   const cached = await AsyncStorage.getItem(cacheKey);
//   if (cached) return JSON.parse(cached);

//   // fetch từ API
//   const res = await fetchChatlog(userId, lessonId);
//   if (res?.data) {
//     await AsyncStorage.setItem(cacheKey, JSON.stringify(res.data.messages));
//     return res.data.messages;
//   }
//   return [];
// }

// function useChatlog(userId: string, lessonId: string) {
//   return useQuery({
//     queryKey: ["chatlog", userId, lessonId],
//     queryFn: () => getChatlogCached(userId, lessonId),
//     staleTime: 1000 * 60, // giữ 1 phút
//   });
// }