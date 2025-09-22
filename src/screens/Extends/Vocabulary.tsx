import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Vocabulary from '../../models/vocabulary';
import VocabularyExplain from './VocabularyExplain';
import { GetVocabulary } from '../../services/api/vocabulary.servics';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';

export default function VocabularyPage() {
  const [search, setSearch] = useState('');
  const [selectedWord, setSelectedWord] = useState<Vocabulary | null>(null);
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetVocabulary()
      .then((data) => {
        setVocabulary(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredData = vocabulary.filter((item) =>
    item.word.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedWord) {
    return (
      <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={{ flex: 1 } as any}>
        <SafeAreaView style={styles.container}>
          <VocabularyExplain
            word={selectedWord.word}
            definition={selectedWord.meaning}
            example={selectedWord.example[0]}
          />
          <View style={{ padding: 16 } as any}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedWord(null)}
            >
              <Icon name="arrow-left" size={16} color="#fff" />
              <Text style={styles.backText}>Back to list</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={{ flex: 1 } as any}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: 'padding', android: undefined })}
          style={{ flex: 1 } as any}
        >
          <Text style={styles.title}>🌌 Galaxy Vocabulary</Text>

          {/* Ô tìm kiếm */}
          <View style={styles.searchWrapper}>
            <Icon name="search" size={18} color="#aaa" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search word..."
              placeholderTextColor="#aaa"
              value={search}
              onChangeText={setSearch}
              autoCorrect={false}
              autoCapitalize="none"
              clearButtonMode="while-editing"
            />
          </View>

          {/* Loading */}
          {loading ? (
            <ActivityIndicator size="large" color="#9d4edd" style={{ marginTop: 20 } as any} />
          ) : (
            <FlatList
              data={filteredData}
              keyExtractor={(item, index) =>
                item.id ? item.id.toString() : index.toString()
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => setSelectedWord(item)}
                >
                  <View style={styles.cardHeader}>
                    <Icon name="star" size={20} color="#9d4edd" />
                    <Text style={styles.word}>{item.word}</Text>
                  </View>
                  <Text style={styles.definition} numberOfLines={2}>
                    {item.meaning}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingBottom: 30 } as any}
              ListEmptyComponent={
                <Text style={styles.emptyText}>⚠ No words found.</Text>
              }
            />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: '#fff',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(157,78,221,0.4)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  word: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 10,
    color: '#fff',
  },
  definition: {
    fontSize: 15,
    color: '#ccc',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#aaa',
  },
  backButton: {
    flexDirection: 'row',
    backgroundColor: '#9d4edd',
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
});
