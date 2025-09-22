import React, { useEffect, useState } from 'react'; 
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Question } from '../../models/question';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { QuizStackParamList } from '../../navigation/AppStack';
import { getQuestionByQuizId, SaveHistoryQuiz } from '../../services/api/quiz.services';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<QuizStackParamList, 'QuizTest'>;

export default function QuizTest({ route, navigation }: Props) {
  const { quizId } = route.params;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalscore, setTotalScore] = useState(0);

  useEffect(() => {
    getQuestionByQuizId(quizId)
      .then(data => {
        if (data?.data?.length > 0) {
          setQuestions(data.data);
          setTotalScore(data.score);
        }
      })
      .catch(error => console.error('Error fetching questions:', error));
  }, [quizId]);

  if (questions.length === 0) {
    return <Text>Loading...</Text>;
  }

  const question = questions[currentIndex];

  const onSelectOption = (index: number) => {
    if (selectedOption === null) {
      setSelectedOption(index);
      setShowResult(true);

      if (question.options[index].isCorrect) {
        setScore(prev => prev + totalscore / questions.length);
      }
    }
  };

  const onNext = () => {
    setSelectedOption(null);
    setShowResult(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const percent = (score / questions.length) * 100;

      SaveHistoryQuiz(quizId, score, questions.length, percent)
        .then((data) => {
          if (data.success) {
            navigation.navigate("Result", {
              score,
              total: questions.length,
              totalscore,
              quizId
            });
          }
        })
        .catch(error => console.error('Error saving quiz history:', error));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Thanh tiến độ */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${((currentIndex+1)/questions.length)*100}%` }]} />
      </View>

      <Text style={styles.questionText}>{question.questionText}</Text>

      {question.options.map((option, idx) => {
        const isSelected = idx === selectedOption;
        const isCorrect = !!option.isCorrect;
        let backgroundColor = '#fff';

        if (showResult) {
          if (isSelected) {
            backgroundColor = isCorrect ? '#d4edda' : '#f8d7da'; // xanh nhạt / đỏ nhạt
          } else if (isCorrect) {
            backgroundColor = '#d4edda';
          }
        } else if (isSelected) {
          backgroundColor = '#e0f7fa'; // xanh pastel khi chọn
        }

        return (
          <TouchableOpacity
            key={option._id}
            style={[styles.optionButton, { backgroundColor }]}
            onPress={() => onSelectOption(idx)}
            disabled={showResult}
          >
            <Text style={styles.optionText}>{option.text}</Text>
          </TouchableOpacity>
        );
      })}

      {showResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            {selectedOption !== null && question.options[selectedOption].isCorrect
              ? '✅ Correct!'
              : '❌ Wrong!'}
          </Text>

          {question.explanation && (
            <Text style={styles.explanation}>{question.explanation}</Text>
          )}

          <TouchableOpacity style={styles.nextButton} onPress={onNext}>
            <Text style={styles.nextButtonText}>
              {currentIndex === questions.length - 1 ? "Finish" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f0f8ff' // nền xanh nhạt
  },

  progressContainer: {
    height: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },

  questionText: { 
    fontSize: 22, 
    fontWeight: '700', 
    textAlign: 'center',
    color: '#333', 
    marginBottom: 24,
    lineHeight: 30
  },

  optionButton: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  optionText: { 
    fontSize: 18, 
    color: '#333' 
  },

  resultContainer: { 
    marginTop: 20, 
    alignItems: 'center', 
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  resultText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333'
  },

  explanation: {
    marginTop: 8,
    fontStyle: 'italic',
    fontSize: 16,
    color: '#555',
    textAlign: 'center'
  },

  nextButton: {
    marginTop: 16,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center'
  }
});
