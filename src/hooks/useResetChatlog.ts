// hooks/useResetChatlog.ts
import { useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storageKey } from "./useChatlog";
import { resetChatlogApi } from "../services/api/chatlog.services";

export function useResetChatlog() {
  const queryClient = useQueryClient();

  const resetChatlog = async (userId: string, lessonId: string) => {
    if (!userId || !lessonId) {
      throw new Error("resetChatlog: missing userId or lessonId");
    }
    // 1️⃣ AsyncStorage
    const key = await storageKey(userId, lessonId);
    if (!key) {
      console.warn("⚠️ AsyncStorage key is null, skip remove");
      return;
    }
    await AsyncStorage.removeItem(key);

    // 2️⃣ React Query cache
    queryClient.removeQueries({
      queryKey: ["chatlog", userId, lessonId],
    });

    // 3️⃣ Backend history
    await resetChatlogApi(userId, lessonId);

    // console.log("✅ Reset chatlog DONE");
  };

  return { resetChatlog };
}
