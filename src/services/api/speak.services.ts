import Tts from "react-native-tts";
import axiosInstance from "../../config/axiosconfig";

export const FetchRateSpeak = async (originalSentence: string, studentSentence: string) => {
    try{
        const res = await axiosInstance.post('/api/RateSpeak',{
            originalSentence: originalSentence,
            studentSentence: studentSentence,
        });
        return res.data;
    } catch (e: any){
        // console.log(e);
    }
}

export const GetRandomSentence = async (level: any) => {
    try{
        const res = await axiosInstance.get(`/api/randomSentence/${level}`);
        return res.data;
    } catch (e: any){
        // console.log(e);
    }
}


Tts.setDefaultLanguage('en-US');
export async function speak(text: string) {
    Tts.stop();
    Tts.setDefaultRate(0.25);
    Tts.speak(text); 
}
