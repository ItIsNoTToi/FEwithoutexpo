import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../config/axiosconfig";

export const getUser = async () => {
  try {
    // Lấy token đã lưu sau khi login
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      throw new Error("No token found");
    }
    // console.log(token);

    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      throw new Error("No UserId found");
    }

    const res = await axios.get(`/api/User/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token lên BE
      },
    });
    // console.log(res.data);

    return res.data; // Dữ liệu user trả về từ BE
  } catch (error) {
    console.error("Get User error:", error);
    throw error;
  }
};

export const logout_fe = async () => {
  // FE (mobile/web)
  await AsyncStorage.removeItem("authToken");
  const response = await axios.post('/admin/logout-fe');
  return response.data;
}