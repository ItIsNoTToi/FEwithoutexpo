import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Tournament } from "../../models/tournament";
import { useEffect, useState } from "react";
import { fetchTournamentById, joinTournament, leaveTournament } from "../../services/api/tournament.services";
import { getStatusBarHeight } from 'react-native-status-bar-height';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

type TokenPayload = {
  id: string; // hoặc userId tùy backend bạn encode
  exp: number;
};

export default function TournamentDetailScreen({ route, navigation }: any) {
  const [tournament, setTournament] = useState<Tournament>();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const tournamentId = route.params.tournamentId;

  const loadUserId = async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode<TokenPayload>(token);
      setUserId(decoded.id); 
    }
  };

  const loadTournament = async () => {
    try {
      const data = await fetchTournamentById(tournamentId);
      setTournament(data.tournament);
    } catch (err) {
      console.error("Error fetching tournament:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadUserId();
      await loadTournament();
    };
    fetchData();
  });

  const handleJoin = async () => {
    if (!tournament) return;
    try {
      setLoading(true);
      await joinTournament(tournament._id);
      await loadTournament();
    } catch (err) {
      console.error("Error joining tournament:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!tournament) return;
    try {
      setLoading(true);
      await leaveTournament(tournament._id);
      await loadTournament();
    } catch (err) {
      console.error("Error leaving tournament:", err);
    } finally {
      setLoading(false);
    }
  };

  const isJoined = tournament?.participants.some((p) => p._id === userId);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tournament Detail</Text>
      {tournament && (
        <>
          <Text style={styles.label}>Name: {tournament.name}</Text>
          <Text style={styles.label}>Description: {tournament.description}</Text>
          <Text style={styles.label}>
            Start Date: {new Date(tournament.startDate).toLocaleDateString()}
          </Text>
          <Text style={styles.label}>
            End Date: {new Date(tournament.endDate).toLocaleDateString()}
          </Text>

          {/* Button Join / Leave */}
          {isJoined ? (
            <TouchableOpacity style={[styles.joinBtn, styles.leaveBtn]} onPress={handleLeave} disabled={loading}>
              <Text style={styles.joinBtnText}>{loading ? "Leaving..." : "Leave Tournament"}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.joinBtn} onPress={handleJoin} disabled={loading}>
              <Text style={styles.joinBtnText}>{loading ? "Joining..." : "Join Tournament"}</Text>
            </TouchableOpacity>
          )}

          {/* Danh sách participants */}
          <Text style={styles.subTitle}>Participants:</Text>
          {tournament.participants.length === 0 ? (
            <Text style={styles.participantPlaceholder}>No participants yet.</Text>
          ) : (
            <FlatList
              data={tournament.participants}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <Text style={styles.participantItem}>- {item.username}</Text>
              )}
            />
          )}
        </>
      )}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backBtnText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: getStatusBarHeight(), padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  label: { fontSize: 16, marginBottom: 8 },
  joinBtn: {
    marginTop: 12,
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  joinBtnText: { color: "#fff", fontWeight: "bold" },
  subTitle: { fontSize: 18, marginTop: 20, fontWeight: "bold" },
  participantItem: { fontSize: 14, marginTop: 4 },
  backBtn: {
    marginTop: 20,
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },

  participantPlaceholder: { color: "#999" },
  backBtnText: { color: "#fff" },
  leaveBtn: { backgroundColor: "red" },
});
