import { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, Button, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { getRandomTitle, submitWriting } from "../../services/api/AI.services";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft  } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useNavigation } from "@react-navigation/native";

// Simple in-memory cache for titles
const titleCache: { [key: string]: string } = {};

export const Write = () => {
    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [loadingTitle, setLoadingTitle] = useState(false);
    const [text, setText] = useState('');
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [score, setScore] = useState<number | null>(null);
    const [breakdown, setBreakdown] = useState<any>(null);

    // Fetch AI-assigned title
    const fetchTitle = async () => {
        setLoadingTitle(true);
        const cacheKey = 'randomTitle_default';
        if (titleCache[cacheKey]) {
            setTitle(titleCache[cacheKey]);
            setLoadingTitle(false);
            return;
        }
        try {
            const data = await getRandomTitle();
            const newTitle = data.title || 'Default Title';
            titleCache[cacheKey] = newTitle;
            setTitle(newTitle);
        } catch (err) {
            console.error('Failed to get random title:', err);
            setTitle('Default Title');
        } finally {
            setLoadingTitle(false);
        }
    };

    const handleSubmit = async () => {
        if (!text.trim()) return Alert.alert('Warning', 'Please enter your writing.');
        setLoadingSubmit(true);
        try {
            const result = await submitWriting(title, text);

            // Parse AI feedback an toàn
            let parsedResult;
            try {
                if (typeof result === 'string') {
                    const start = result.indexOf('{');
                    const end = result.lastIndexOf('}');
                    parsedResult = JSON.parse(result.substring(start, end + 1));
                } else {
                    parsedResult = result;
                }
            } catch (err) {
                console.error('Parse error:', err);
                parsedResult = {
                    score: 0,
                    breakdown: { grammar: 0, vocabulary: 0, cohesion: 0, content: 0 },
                    feedback: 'Invalid AI response'
                };
            }

            setFeedback(parsedResult.feedback);
            setScore(parsedResult.score);
            setBreakdown(parsedResult.breakdown);
        } catch (err) {
            console.error('Submit writing error:', err);
            Alert.alert('Error', 'Failed to submit writing');
        } finally {
            setLoadingSubmit(false);
        }
    };

    useEffect(() => {
        fetchTitle();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={{marginBottom: 7,} as any} onPress={() => navigation.goBack()}>
                <FontAwesomeIcon icon={faArrowLeft  as IconProp} size={24} color="black" />
            </TouchableOpacity>
            {/* AI-assigned Title */}
            <View style={styles.titleContainer}>
                <Text style={styles.label}>Title:</Text>
                {loadingTitle ? <ActivityIndicator /> : <Text style={styles.titleText}>{title}</Text>}
                <Button title="Random Again" onPress={fetchTitle} />
            </View>

            {/* Writing Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Your Writing:</Text>
                <TextInput
                    style={styles.textInput}
                    multiline
                    numberOfLines={6}
                    placeholder="Start writing here..."
                    value={text}
                    onChangeText={setText}
                />
                <Button title={loadingSubmit ? "Submitting..." : "Submit"} onPress={handleSubmit} disabled={loadingSubmit} />
            </View>

            {/* Feedback & Score */}
            {feedback && (
                <View style={styles.feedbackContainer}>
                    <Text style={styles.feedbackTitle}>Feedback:</Text>
                    <Text style={styles.feedbackText}>{feedback}</Text>
                    <Text style={styles.scoreText}>Score: {score}</Text>
                    {breakdown && (
                        <View style={styles.breakdownContainer}>
                            <Text>Grammar: {breakdown.grammar}</Text>
                            <Text>Vocabulary: {breakdown.vocabulary}</Text>
                            <Text>Cohesion: {breakdown.cohesion}</Text>
                            <Text>Content: {breakdown.content}</Text>
                        </View>
                    )}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: getStatusBarHeight(), backgroundColor: '#e9f6f4ff'},
    titleContainer: { marginBottom: 20, borderWidth: 2, borderColor: '#0f84deff' },
    titleText: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
    inputContainer: { marginBottom: 20 },
    label: { fontSize: 16, marginBottom: 4 },
    textInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, minHeight: 100, textAlignVertical: 'top' },
    feedbackContainer: { marginTop: 20, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8 },
    feedbackTitle: { fontWeight: 'bold', marginBottom: 4 },
    feedbackText: { marginBottom: 4 },
    scoreText: { fontWeight: 'bold', marginBottom: 4 },
    breakdownContainer: { marginTop: 4 }
});
