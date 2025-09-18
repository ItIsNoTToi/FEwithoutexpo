import axiosInstance from "../../config/axiosconfig";
// import axios from "axios";

export const fetchLogin = async (data: any): Promise<any> => {
  try {
    const response = await axiosInstance.post("/api/login", {
      email: data.email,
      password: data.password,
    });

    // ✅ Lưu token sau khi login thành công
    // if (response.data?.token) {
    //     console.log("Storing token:", response.data.token);
    //   await AsyncStorage.setItem("authToken", response.data.token);
    // }

    return response.data;
  } catch (error: any) {
    console.error("Error fetching login:", error);
    throw error;
  }
};

export const fetchLoginWithPhone = async (data: any): Promise<any> => {
  try {
    const response = await axiosInstance.post("/api/loginwithphone", {
      phone: data.phoneNumber,
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
        const response = await axiosInstance.post('/api/register', {
            userData: userData
        });

        // axios tự động throw lỗi nếu status >= 400
        // nên không cần if (!response.ok) như fetch
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