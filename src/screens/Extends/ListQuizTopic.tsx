import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { QuizStackParamList } from '../../navigation/AppStack';
import { Quiz } from '../../models/quiz';
import { GetQuiz } from '../../services/api/quiz.services';

type Props = NativeStackScreenProps<QuizStackParamList, 'QuizTopic'>;

const ListQuizTopic = ({ navigation }: Props) => {
  const [Quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() =>{
    GetQuiz()
    .then(data => setQuizzes(data.data));
  },[])

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.replace("MainTabs" as any)}
      >
        <Text style={styles.homeText}>🏠 Home</Text>
      </TouchableOpacity>

      <Text style={styles.header}>📘 Quiz Topics</Text>

      <FlatList
        data={Quizzes}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('QuizTest', { quizId: item._id })}
          >
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    paddingTop: 50, 
    backgroundColor: '#f9fafc' 
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  homeButton: {
    backgroundColor: "#4f9deb",
    marginBottom: 20,
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  homeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  item: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginBottom: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
  },
  title: { 
    fontSize: 18, 
    fontWeight: '600',
    color: "#333"
  },
});

export default ListQuizTopic;
