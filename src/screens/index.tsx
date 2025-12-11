import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import LinearGradient from 'react-native-linear-gradient';

export default function HomeScreen({ navigation }: any) {
  return (
    <LinearGradient
      colors={["#0f2027", "#203a43", "#2c5364"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 40 } as any}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello 👋</Text>
          <Text style={styles.subGreeting}>Welcome back to LearnE</Text>
        </View>

        <Image source={require('../uploads/assets/favicon.png')} style={styles.banner} />

        <Text style={styles.sectionTitle}>Start Learning</Text>

        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Listen')}>
            <Ionicons name="ear-outline" size={32} color="#7dd3fc" />
            <Text style={styles.cardText}>Listen</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Speak')}>
            <Ionicons name="mic-outline" size={32} color="#c084fc" />
            <Text style={styles.cardText}>Speak</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Read')}>
            <Ionicons name="book-outline" size={32} color="#f472b6" />
            <Text style={styles.cardText}>Read</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Write')}>
            <Ionicons name="pencil-outline" size={32} color="#34d399" />
            <Text style={styles.cardText}>Write</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Vocabulary')}>
            <Ionicons name="library-outline" size={32} color="#facc15" />
            <Text style={styles.cardText}>Vocabulary</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('QuizTest')}>
            <Ionicons name="clipboard-outline" size={32} color="#f87171" />
            <Text style={styles.cardText}>Quiz Test</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('FixSentence')}>
            <View style={{ flexDirection: 'row'}}>
              <Ionicons name="book-outline" size={32} color="#72f4f2ff" />
              <Ionicons name="pencil-outline" size={32} color="#72f4f2ff" />
            </View>
            <Text style={styles.cardText}>Fix Sentence</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('FixSentence')}>
            <Ionicons name="play" size={32} color="#78d542ff" />
            <Text style={styles.cardText}>Play game with friend</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: getStatusBarHeight(),
  },
  header: {
    marginTop: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  subGreeting: {
    fontSize: 16,
    color: '#d1d5db',
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
    color: '#e5e7eb',
    marginBottom: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    width: '47%',
    height: 120,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  cardText: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});
