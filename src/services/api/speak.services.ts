import Tts from "react-native-tts";
import axiosInstance from "../../config/axiosconfig";

export const FetchRateSpeak = async (
  originalSentence: string,
  studentSentence: string
) => {
  try {
    const res = await axiosInstance.post("/api/RateSpeak", {
      originalSentence,
      studentSentence
    });

    const raw =
      typeof res.data === "string"
        ? res.data
        : res.data?.data || res.data?.content || "";

    // 🔒 extract JSON safely
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("Invalid AI response format");
    }

    return JSON.parse(match[0]); // ✅ { score, feedback }
  } catch (e) {
    console.error("FetchRateSpeak error:", e);
    throw e;
  }
};

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
