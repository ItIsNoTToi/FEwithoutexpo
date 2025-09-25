// hooks/useResetChatlog.ts
import { useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storageKey } from "./useChatlog";

export function useResetChatlog() {
  const queryClient = useQueryClient();

  const resetChatlog = async (userId: string, lessonId: any) => {
    // Xóa AsyncStorage
    const key = await storageKey(userId, lessonId);
    await AsyncStorage.removeItem(key);

    // Xóa cache query
    queryClient.removeQueries({
      queryKey: ["chatlog", userId, lessonId],
    });

    console.log('day ne')
  };

  return { resetChatlog };
}
