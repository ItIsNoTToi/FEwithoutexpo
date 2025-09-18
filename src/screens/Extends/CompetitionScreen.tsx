import { getStatusBarHeight } from 'react-native-status-bar-height';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable } from 'react-native';
import { fetchTournaments } from '../../services/api/tournament.services';
import { Tournament } from '../../models/tournament';
import { formatDate } from '../../utils/date';
import { TournamentStackParamList } from '../../navigation/AppStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<TournamentStackParamList, 'Tournament'>;

export default function CompetitionScreen({navigation}: Props) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTournaments()
      .then((data) => setTournaments(data.tournaments))
      .catch((err) => console.error("Error fetching tournaments: ", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Competition</Text>
      {loading ? (
        <Text style={{ textAlign: 'center', marginTop: 20 } as any}>Đang tải...</Text>
      ) : (
        <FlatList
          data={tournaments}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => navigation.navigate('TournamentDetail', { tournamentId: item._id })}
            >
              <Image
                source={ item.thumbnailUrl ? { uri: item.thumbnailUrl } : require('../../uploads/assets/logo.png') }
                style={styles.thumbnail}
              />
              <View style={{ flex: 1 } as any}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.desc}>{item.description}</Text>
                <Text style={styles.date}>
                  {formatDate(item.startDate)} - {formatDate(item.endDate)}
                </Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={{ color: '#999', marginTop: 20, textAlign: 'center' } as any}>
              Chưa có cuộc thi nào.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    marginTop: getStatusBarHeight(),
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  desc: {
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});
