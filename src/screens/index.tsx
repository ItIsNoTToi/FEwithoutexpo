import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export default function HomeScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello 👋</Text>
        <Text style={styles.subGreeting}>Welcome back to LearnE</Text>
      </View>

      <Image source={require('../uploads/assets/ai-teacher.png')} style={styles.banner} />

      <Text style={styles.sectionTitle}>Start Learning</Text>

      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AIListening')}>
          <Ionicons name="ear-outline" size={32} color="#4f6ef7" />
          <Text style={styles.cardText}>Listen</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Speak')}>
          <Ionicons name="mic-outline" size={32} color="#4f6ef7" />
          <Text style={styles.cardText}>Speak</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Read')}>
          <Ionicons name="book-outline" size={32} color="#4f6ef7" />
          <Text style={styles.cardText}>Read</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Write')}>
          <Ionicons name="pencil-outline" size={32} color="#4f6ef7" />
          <Text style={styles.cardText}>Write</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Vocabulary')}>
          <Ionicons name="library-outline" size={32} color="#4f6ef7" />
          <Text style={styles.cardText}>Vocabulary</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('QuizTest')}>
          <Ionicons name="clipboard-outline" size={32} color="#4f6ef7" />
          <Text style={styles.cardText}>Quiz Test</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f6ff',
    flex: 1,
    paddingHorizontal: 20,
    marginTop: getStatusBarHeight(),
  },
  header: {
    marginTop: 40,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  banner: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    resizeMode: 'contain',
    marginTop: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    width: '47%',
    height: 120,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    textAlign: 'center',
  },
});
