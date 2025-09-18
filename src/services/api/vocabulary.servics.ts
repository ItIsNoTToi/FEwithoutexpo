import axiosInstance from "../../config/axiosconfig";

export const GetVocabulary = async () => {
    try {
        const response = await axiosInstance.get('/api/getVocabulary');
        if(response.data.success === true){
            return response.data;
        }
    } catch (error) {
        return error;
    }
}