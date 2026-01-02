import axiosInstance from "../../config/axiosconfig";

export const fetchProgressApi = async (userId: any) =>{
    try {
        const response = await axiosInstance.get(`/api/progress/${userId}`);
        return response.data;
    } catch (error) {
        throw Error;    
    }
} 

export const fetchdataProgressApi = async (progressId: any) =>{
    try {
        const response = await axiosInstance.get(`/api/progress/data/${progressId}`);
        return response.data;
    } catch (error) {
        throw Error;    
    }
} 

export const fetchListenResultApi = async (userId: any) => {
    try {
        const response = await axiosInstance.get(`/api/listen/${userId}`);
        return response.data;
    } catch (error) {
        throw Error;    
    }
} 

export const createProgress = async (progressId: string, userId: string, lessonId: string) => {
    // console.log(progressId, userId, lessonId);
    try {
        const response = await axiosInstance.post(`/api/createProgress`,{
            progressId: progressId,
            userId: userId,
            lessonId: lessonId
        });
        return response.data;
    } catch (error) {
        throw Error;    
    }
}
