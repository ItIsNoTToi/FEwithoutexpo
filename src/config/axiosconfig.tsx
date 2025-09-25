import axios from "axios";
import Config from "react-native-config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const URL_API = Config.URL_API;
console.log("🔗 URL_API from .env:", URL_API);
const axiosInstance = axios.create({
  baseURL: URL_API, 
  timeout: 60000, // Set a timeout of 10 seconds
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
