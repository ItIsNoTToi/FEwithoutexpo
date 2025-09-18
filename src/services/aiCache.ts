// services/aiCache.ts
// Cache in-memory theo session (có thể thay bằng MMKV/AsyncStorage nếu muốn lâu dài)

import AsyncStorage from "@react-native-async-storage/async-storage";

const aiAnswerCache = new Map<string, string>();

// Tạo key duy nhất dựa vào lessonId + prompt
export const makeAIKey = (lessonId: string, prompt: string) => {
    return `${lessonId}::${prompt.trim().toLowerCase()}`;
};

// Lấy dữ liệu cache
export const getCachedAI = async (key: string) => {
  const raw = await AsyncStorage.getItem(`aiAnswer:${key}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw); // sẽ ra string (nếu bạn lưu đúng)
  } catch {
    return raw; // fallback
  }
};

// Set dữ liệu cache
export const setCachedAI = async (key: string, value: string) => {
  aiAnswerCache.set(key, value);
  await AsyncStorage.setItem(`aiAnswer:${key}`, value);
};
