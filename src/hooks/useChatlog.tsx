// hooks/useChatlog.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchChatlog } from "../services/api/chatlog.services";

export type ChatMessage = { 
  from: "user" | "ai";   // ✅ sửa
  text: string; 
  loading?: boolean;
};

export const storageKey = (userId: string, lessonId: string) =>
  `chatlog:${userId}:${lessonId}`;

// helper: luôn lưu cache cùng format {role, content}
async function saveCache(userId: string, lessonId: string, msgs: ChatMessage[]) {
  await AsyncStorage.setItem(
    storageKey(userId, lessonId),
    JSON.stringify(
      msgs.map((m) => ({
        role: m.from === "user" ? "user" : "assistant", // ✅ map đúng
        text: m.text,
      }))
    )
  );
}

export function useChatlog(userId?: string, lessonId?: string) {
  const queryClient = useQueryClient();

  const { data: histories = [] } = useQuery<ChatMessage[]>({
    queryKey: ["chatlog", userId, lessonId],
    queryFn: async () => {
      if (!userId || !lessonId) return [];

      const key = storageKey(userId, lessonId);

      // 1️⃣ Load cache trước
      const cached = await AsyncStorage.getItem(key);
      let cachedMsgs: ChatMessage[] = [];

      if (cached) {
        const raw = JSON.parse(cached);
        cachedMsgs = raw.map((m: any) => ({
          from: m.role === "user" ? "user" : "ai",
          text: m.content  ?? "",
        }));
      }

      // 2️⃣ Gọi API
      const res = await fetchChatlog(userId, lessonId);
      const rawApi = res?.data?.history;
      console.log(rawApi);
      if (Array.isArray(rawApi) && rawApi.length > 0) {
        await AsyncStorage.setItem(key, JSON.stringify(rawApi));
        return rawApi.map((m: any) => ({
          from: m.role === "user" ? "user" : "ai",
          text: m.content ?? "",
        }));
      }

      // 3️⃣ API rỗng → dùng cache
      console.log(cachedMsgs);
      return cachedMsgs;
    },
    enabled: !!userId && !!lessonId,
    staleTime: 1000 * 60,
  });

  const appendMessage = (msg: ChatMessage) => {
    queryClient.setQueryData<ChatMessage[]>(
      ["chatlog", userId, lessonId],
      (old = []) => {
        const newMsgs = [...old, msg];
        if (userId && lessonId) saveCache(userId, lessonId, newMsgs);
        return newMsgs;
      }
    );
  };

  const patchLastAIMessage = (incoming: string) => {
    if (!userId || !lessonId) return;

    queryClient.setQueryData<ChatMessage[]>(
      ["chatlog", userId, lessonId],
      (old = []) => {
        if (!old.length) return old;

        const newMsgs = [...old];
        const last = newMsgs[newMsgs.length - 1];
        if (!last || last.from !== "ai") return old;

        let newText = last.text + incoming;

        newMsgs[newMsgs.length - 1] = { 
          ...last, 
          text: newText, 
          loading: false  // <-- đánh dấu đã có AI trả lời
        };

        saveCache(userId, lessonId, newMsgs);
        return newMsgs;
      }
    );
  };
  
  return { data: histories, appendMessage, patchLastAIMessage };
}
