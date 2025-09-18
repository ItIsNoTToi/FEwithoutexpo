import { Text, StyleSheet, ScrollView, SafeAreaViewBase, View } from 'react-native';
import { VocabularyExplainProps } from '../../models/vocabulary';

export default function VocabularyExplain({
  word,
  definition,
  example,
}: VocabularyExplainProps) {
  return (
    <SafeAreaViewBase style={styles.container}>
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
        </View>
      </ScrollView>
    </SafeAreaViewBase>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc', 
  },
  content: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    padding: 20 
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  word: { 
    fontSize: 34, 
    fontWeight: '800', 
    marginBottom: 16, 
    textAlign: 'center', 
    color: '#1e293b' 
  },
  definition: { 
    fontSize: 18, 
    lineHeight: 26, 
    marginBottom: 20, 
    color: '#334155',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#475569',
  },
  exampleBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 12,
  },
  example: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#555',
    lineHeight: 24,
  },
});
