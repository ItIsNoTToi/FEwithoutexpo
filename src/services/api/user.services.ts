import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../config/axiosconfig";
import { clearAICache } from "../aiCache";

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
  await clearAICache();
  await AsyncStorage.removeItem("userId");
  await AsyncStorage.removeItem("chatlog"); // nếu bạn lưu chatlog ở local
  const response = await axios.post('/admin/logout-fe');
  return response.data;
}

export const SaveUser = async (data: any) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      throw new Error("No token found");
    }
    console.log("Saving user with data:", data);

    const res = await axios.put(`/api/update/User/${data._id}`, {
      data: data,
    });
    // console.log(res.data);
    return res.data; // Dữ liệu user trả về từ BE
  } catch (error) {
    console.error("Get User error:", error);
    throw error;
  }
}

export const uploadAvatar = async (userId: any,formData: FormData) => {
  try {
    const res = await axios.post(`/api/avatar/${userId}`,{
      data: formData,
    });
    if (res.status === 200) {
      const data = res.data;
      if (data.success) {
        return data;
      }
    }
  } catch (error) {
    console.error(error);
  }
}