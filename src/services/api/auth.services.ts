import axiosInstance from "../../config/axiosconfig";
import { googleLogin } from "../googleAuth";

export const fetchLogin = async (Data: any, loginType: any): Promise<any> => {
  try {
    if(loginType === 'TK'){
        const response = await axiosInstance.post("/api/login", {
        email: Data.email,
        password: Data.password,
        loginType: loginType
      });
      return response.data;
    } else if(loginType === 'GG'){  
      // console.log(1);
      const {type, data} = await googleLogin();
      // console.log(type, data)
      // console.log(2);
      const response = await axiosInstance.post("/api/login", {
        type: type, 
        data: data,
        loginType: loginType
      });
      // console.log(3);
      return response.data;
    } else if(loginType === 'FB'){
      const {type, data} = await googleLogin();

      const response = await axiosInstance.post("/api/login", {
        type: type, 
        data: data,
        loginType: loginType
      });
      return response.data;
    } else if(loginType === 'Apple'){
      const {type, data} = await googleLogin();

      const response = await axiosInstance.post("/api/login", {
        type: type, 
        data: data,
        loginType: loginType
      });
      return response.data;
    }
  } catch (error: any) {
    console.error("Error fetching login:", error);
    throw error;
  }
};

export const fetchLoginWithPhone = async (data: any, loginType: string): Promise<any> => {
  try {
    const response = await axiosInstance.post("/api/login", {
      phone: data.phoneNumber,
      loginType: loginType
    });

    // ✅ Lưu token
    // if (response.data?.token) {
    //   await AsyncStorage.setItem("authToken", response.data.token);
    // }

    return response.data;
  } catch (error) {
    console.error("Error fetching login:", error);
    throw error;
  }
};

export const fetchRegister = async (userData: any): Promise<any> => {
    try { 
        // console.log(userData);
        const response = await axiosInstance.post('/api/register', {
            userData: userData
        });

        return response.data;

    } catch (error: any) {
        console.error("Error fetching register:", error);

        // Nếu muốn lấy rõ thông tin lỗi từ axios
        if (error.response) {
            // Server trả lỗi (status code ngoài 2xx)
            throw { 
                status: error.response.status, 
                ...error.response.data 
            };
        } else if (error.request) {
            // Request gửi đi nhưng không nhận phản hồi
            throw { message: "No response from server" };
        } else {
            // Lỗi khi set up request
            throw { message: error.message };
        }
    }
}