import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../config/axiosconfig";
import { clearAICache } from "../aiCache";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

let cachedUser: any = null;

export const getUser = async () => {
  if(cachedUser) return cachedUser;
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

export const logout_fe = async (type: string) => {
  await AsyncStorage.removeItem("authToken");
  await AsyncStorage.removeItem("userId");
  await AsyncStorage.removeItem("chatlog");
  await clearAICache();

  if(type === "GG"){
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  }

  const response = await axios.post('/admin/logout-fe');
  return response.data;
}

export const SaveUser = async (data: any) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No token found");

    const res = await axios.put(`/api/update/User/${data._id}`, { data: data });
    return res.data;
  } catch (error) {
    console.error("Save User error:", error);
    throw error;
  }
}

export const uploadAvatar = async (userId: any, url: string) => {
  try {
    // console.log(url)
    const res = await axios.post(`/api/avatar/update/${userId}`, {
      url: url
    });
    return res.data;
  } catch (error) {
    console.error("Upload avatar error:", error);
  }
}