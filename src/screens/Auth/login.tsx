import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, KeyboardAvoidingView } from 'react-native';
import { useAuth } from '../../hooks/AuthContext';
import { fetchLogin } from '../../services/api/auth.services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export async function saveToken(token: string, userId: string) {
  await AsyncStorage.setItem('userId', userId);
  await AsyncStorage.setItem('authToken', token);
}

export default function Login({ navigation }: any) {
  const { login } = useAuth();
  const [inputVisible, setInputVisible] = useState(false);
  const [email, setEmail] = useState('giangvanhung2003@gmail.com');
  const [password, setPassword] = useState('Hung123456@');

  const handleLogin = (type: String) => {
    if (!inputVisible && type === 'TK') {
      setInputVisible(true); // show input field
    } else {
      if (email && password) {
        const data = {
          email: email.trim(),
          password: password.trim(),
        }

        fetchLogin(data, type)
          .then((rpdata) => {
            //console.log("Login successful:", data);
            saveToken(rpdata.token, rpdata.user._id);
             // Lưu userId để dùng sau
            rpdata.success ? login() : Alert.alert('Login failed. Please check your credentials.');
          })
          .catch(error => {
            console.error("Error:", error);
            Alert.alert('Error:' + error);
          })
      }
      else{
        Alert.alert('Please enter both email and password.'); // simple validation
      }
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{flex: 1} as any}>
      <View style={styles.container}>
        <Image source={require('../../uploads/assets/logo.png')} style={styles.logo} />

        <Text style={styles.title}>Welcome to LearnE</Text>
        <Text style={styles.subtitle}>Learn English with AI – Smart, Fun, Personalized</Text>

        {inputVisible && (
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}

        {inputVisible && (
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            keyboardType="default"
            autoCapitalize="none"
          />
        )}

        <TouchableOpacity style={styles.loginButton} onPress={() => handleLogin('TK')}>
          <Text style={styles.loginText}>Login with Email</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.loginButton, 
          { 
            backgroundColor: "rgba(255, 255, 255, 1)", 
            width: '30%',
            borderRadius: 50, 

          } as any]} onPress={() => handleLogin('GG')}>
          <Ionicons name="logo-google" size={32} color="#fab915ff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>or</Text>

        <TouchableOpacity onPress={() => navigation.navigate('LoginWithPhone')}>
          <Text style={styles.registerText}>Login with Phone Number</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>Create a new account</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f6ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    color: 'black',
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
    resizeMode: 'contain',
    borderRadius: 10,
    borderColor: '#08091cff',
    borderWidth: 1,
    shadowColor: '#d11919ff ',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  loginButton: {
    backgroundColor: '#4f6ef7',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  forgotText: {
    color: '#4f6ef7',
    fontSize: 14,
    marginBottom: 16,
    textDecorationLine: 'underline',
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  orText: {
    color: '#999',
    fontSize: 14,
    marginVertical: 8,
  },
  registerText: {
    color: '#4f6ef7',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});