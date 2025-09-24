// hooks/useChatlog.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchChatlog } from "../services/api/chatlog.services";

export type ChatMessage = { 
  from: "user" | "system"; 
  text: string; 
  loading?: boolean;  // <-- thêm
};

const storageKey = (userId: string, lessonId: string) =>
  `chatlog:${userId}:${lessonId}`;

// helper: luôn lưu cache cùng format {role, content}
async function saveCache(userId: string, lessonId: string, msgs: ChatMessage[]) {
  await AsyncStorage.setItem(
    storageKey(userId, lessonId),
    JSON.stringify(
      msgs.map((m) => ({
        role: m.from,
        text: m.text,
      }))
    )
  );
}

export const clearChatlogCache = async (userId: string, lessonId: string) => {
  await AsyncStorage.removeItem(storageKey(userId, lessonId));
}

export function useChatlog(userId?: string, lessonId?: string) {
  const queryClient = useQueryClient();

  const { data: histories = [] } = useQuery<ChatMessage[]>({
    queryKey: ["chatlog", userId, lessonId],
    queryFn: async () => {
      if (!userId || !lessonId) return [];

      const key = storageKey(userId, lessonId);

      // 1. Lấy cache
      const cached = await AsyncStorage.getItem(key);
      let initial: ChatMessage[] = [];
      if (cached) {
        const raw = JSON.parse(cached);
        initial = raw.map((m: any) => ({
          from: m.role === "user" ? "user" : "system",
          text: m.text ?? "",
        }));
      }

      // 2. Gọi API
      const res = await fetchChatlog(userId, lessonId);
      const raw = res?.data?.history ?? [];
  
      const messages: ChatMessage[] = raw.map((m: any) => ({
        from: m.role === "user" ? "user" : "system",
        text: m.text ?? "",
      }));

      // 3. Lưu lại cache mới
      if (messages.length > 0) {
        await AsyncStorage.setItem(key, JSON.stringify(raw));
        return messages;
      }

      // Nếu API rỗng → fallback cache
      return initial;
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
        if (!last || last.from !== "system") return old;

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
