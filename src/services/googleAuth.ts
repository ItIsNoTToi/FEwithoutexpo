import { GoogleSignin, SignInResponse, statusCodes, } from '@react-native-google-signin/google-signin';

export const googleLogin = async (): Promise<SignInResponse> => {
  try {
    await GoogleSignin.hasPlayServices();
    // console.log('-1');
    const response = await GoogleSignin.signIn(); 
    // console.log('0');
    // console.log(response);
    if(!response){
      // console.log('1');
      throw new Error(" Đăng nhập thất bại.");
    }
    if(response.type === 'success'){
      const { type, data } = response;
      if (!type || !data) {
        // console.log('2');
        throw new Error("Không lấy được type, data từ Google. Đăng nhập thất bại.");
      }
      return {
        type, 
        data
      };
    }

    return { type: 'cancelled', data: null };
  } catch (error: any) { 
    switch(error.code){
      case statusCodes.SIGN_IN_CANCELLED:
        // console.log('Đăng nhập bị hủy bởi người dùng.');
        return {
          type: 'cancelled',
          data: null
        }
      case statusCodes.IN_PROGRESS:
        // console.log('Quá trình đăng nhập đang diễn ra. Vui lòng chờ.');
        return {
          type: 'cancelled',
          data: null
        }
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        // console.log('Google Play Services không khả dụng trên thiết bị này.');
        throw new Error("Thiết bị không hỗ trợ Google Play Services.");
      case statusCodes.SIGN_IN_REQUIRED: 
        // console.log(`Lỗi cấu hình Google Sign-In (Code: ${error.code}):`, error);
        throw new Error("Lỗi cấu hình: Vui lòng kiểm tra SHA-1 và Web Client ID."); 
      default:
        // console.log("Lỗi không xác định từ Google Sign-In:", error);
        throw error;
    }
  }
};