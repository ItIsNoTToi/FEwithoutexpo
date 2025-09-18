import axios from "../../config/axiosconfig";

export const getLesson = async (): Promise<any> => {
    try {
        const response = await axios.get('/api/lessons');
        // console.log(response.data);
        if(response){
            return response.data;
        }
    } catch (error: any) {
        throw Error (error.message);
    }
}

