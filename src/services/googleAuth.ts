import { GoogleSignin, SignInResponse, statusCodes, } from '@react-native-google-signin/google-signin';

export const googleLogin = async (): Promise<SignInResponse> => {
  try {
    await GoogleSignin.hasPlayServices();
    // ⭐ Đã sửa: Lấy userInfo trực tiếp, không cần .data
    const userInfo = await GoogleSignin.signIn(); 
    const { type, data } = userInfo
    // Kiểm tra tính hợp lệ của Token
    if (!type || !data) {
      throw new Error("Không lấy được idToken từ Google. Đăng nhập thất bại.");
    }
    return {
      type, 
      data
    };
    
  } catch (error: any) { 
    // console.log(JSON.stringify(error));
    // ⭐ Xử lý lỗi một cách rõ ràng
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('Đăng nhập bị hủy bởi người dùng.');
       return {
        type: 'cancelled',
        data: null
      }
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log('Quá trình đăng nhập đang diễn ra. Vui lòng chờ.');
      return {
        type: 'cancelled',
        data: null
      }
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.error('Google Play Services không khả dụng trên thiết bị này.');
      throw new Error("Thiết bị không hỗ trợ Google Play Services.");
    } else {
      // ⭐ Xử lý lỗi cấu hình (Lỗi 12500, DEVELOPER_ERROR,...)
      console.error(`Lỗi cấu hình Google Sign-In (Code: ${error.code}):`, error);
      throw new Error("Lỗi cấu hình: Vui lòng kiểm tra SHA-1 và Web Client ID."); 
    }
    
  }
};