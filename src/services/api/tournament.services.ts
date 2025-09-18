import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../config/axiosconfig";

export const fetchTournaments = async () => {
    try{
        const response = await axiosInstance.get('/api/tournament');
        // console.log("Fetched tournaments:", response);
        if(response.data.success){
            return response.data;
        }
    } catch (error) {
        console.error("Error fetching tournaments:", error);
        throw new Error('Failed to fetch tournaments');
    }
}

export const fetchTournamentById = async (tournamentId: string) => {
    try{
        const response = await axiosInstance.get(`/api/tournament/${tournamentId}`);
        // console.log("Fetched tournament by ID:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching tournament by ID:", error);
        throw new Error('Failed to fetch tournament details');
    }
}

export const leaveTournament = async (tournamentId: string) => {
  const token = await AsyncStorage.getItem("authToken");
  if (!token) {
    throw new Error("No token found");
  }

  const res = await axiosInstance.post(
    `/api/tournament/${tournamentId}/join`,
    {
      status: "leave",
    }, // body rỗng
    {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token lên BE
      },
    }
  );

  return res.data;
}

export const joinTournament = async (tournamentId: string) => {
  const token = await AsyncStorage.getItem("authToken");
  if (!token) {
    throw new Error("No token found");
  }

  const res = await axiosInstance.post(
    `/api/tournament/${tournamentId}/join`,
    {
      status: "join",
    }, // body rỗng
    {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token lên BE
      },
    }
  );

  return res.data;
};

  