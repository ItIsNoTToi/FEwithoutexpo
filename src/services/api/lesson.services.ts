import axios from "../../config/axiosconfig";

export const getLesson = async (): Promise<any> => {
    try {
        const response = await axios.get('/api/lessons');
        // console.log(response.data);
        // console.log('lesson');
        if(response){
            return response.data;
        }
    } catch (error: any) {
        throw Error (error.message);
    }
}

export const getdataLesson = async(lessonId: any): Promise<any> => {
    try {
        const response = await axios.post('/api/lesson/data', {
            lessonId: lessonId
        });
        if(response){
            return response.data;
        }
    } catch (error: any) {
        throw Error (error.message);
    }
}

