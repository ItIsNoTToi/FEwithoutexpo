import { getStatusBarHeight } from 'react-native-status-bar-height';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable } from 'react-native';
import { fetchTournaments } from '../../services/api/tournament.services';
import { Tournament } from '../../models/tournament';
import { formatDate } from '../../utils/date';
import { TournamentStackParamList } from '../../navigation/AppStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = NativeStackScreenProps<TournamentStackParamList, 'Tournament'>;

export default function CompetitionScreen({ navigation }: Props) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTournaments()
      .then((data) => setTournaments(data.tournaments))
      .catch((err) => console.error("Error fetching tournaments: ", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <LinearGradient
      colors={['#0f2027', '#203a43', '#2c5364']}
      style={styles.container}
    >
      <Text style={styles.title}>🚀 Competitions</Text>

      {loading ? (
        <Text style={styles.loadingText}>Đang tải...</Text>
      ) : (
        <FlatList
          data={tournaments}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.card,
                { transform: [{ scale: pressed ? 0.97 : 1 }] },
              ]}
              onPress={() =>
                navigation.navigate('TournamentDetail', { tournamentId: item._id })
              }
            >
              <Image
                source={
                  item.thumbnailUrl
                    ? { uri: item.thumbnailUrl }
                    : require('../../uploads/assets/logo.png')
                }
                style={styles.thumbnail}
              />
              <View style={{ flex: 1 } as any}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.desc} numberOfLines={2}>
                  {item.description}
                </Text>
                <Text style={styles.date}>
                  {formatDate(item.startDate)} → {formatDate(item.endDate)}
                </Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="trophy-outline" size={40} color="#aaa" />
              <Text style={styles.emptyText}>Chưa có cuộc thi nào</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 20 } as any}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: getStatusBarHeight() + 10,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
    textShadowColor: '#00eaff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#fff',
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#00eaff',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
    color: '#fff',
  },
  desc: {
    color: '#d1d1d1',
    fontSize: 14,
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    color: '#80d0ff',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 16,
    color: '#bbb',
  },
});
