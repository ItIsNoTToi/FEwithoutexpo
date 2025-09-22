import { StyleSheet, View, Text } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

export const Speak = () => {

    return (
        <View style={styles.container}>
            <Text>Speak Screen - Coming Soon!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: getStatusBarHeight(), backgroundColor: '#e9f6f4ff'},
});
