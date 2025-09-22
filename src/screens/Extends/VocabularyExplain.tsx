import { Text, StyleSheet, ScrollView, View } from 'react-native';
import { VocabularyExplainProps } from '../../models/vocabulary';
import { SafeAreaView } from 'react-native-safe-area-context';
import Tts from 'react-native-tts';
import LinearGradient from 'react-native-linear-gradient';

Tts.setDefaultLanguage('en-US');
async function speak(text: string) {
  Tts.stop();
  Tts.setDefaultRate(0.25);
  Tts.speak(text); 
}

export default function VocabularyExplain({
  word,
  definition,
  example,
}: VocabularyExplainProps) {
  return (
    <LinearGradient
      colors={["#0f2027", "#203a43", "#2c5364"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 } as any}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <Text style={styles.word}>{word}</Text>
            <Text style={styles.definition}>{definition}</Text>

            {example ? (
              <View style={styles.exampleBox}>
                <Text style={styles.sectionTitle}>Example</Text>
                <Text style={styles.example}>{example}</Text>
              </View>
            ) : null}

            <View style={{ marginTop: 20 } as any}>
              <Text
                style={styles.listenButton}
                onPress={() => speak(word)}
              >
                🔊 Listen
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  content: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    padding: 20 
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.1)", 
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 6,
  },
  word: { 
    fontSize: 36, 
    fontWeight: '800', 
    marginBottom: 16, 
    textAlign: 'center', 
    color: '#fff' 
  },
  definition: { 
    fontSize: 18, 
    lineHeight: 26, 
    marginBottom: 20, 
    color: '#e0e0e0',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#fff',
  },
  exampleBox: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    padding: 12,
  },
  example: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#d1d5db',
    lineHeight: 24,
  },
  listenButton: {
    color: "#4fd1c5",
    textAlign: 'center',
    fontSize: 18,
    fontWeight: "600",
  },
});
