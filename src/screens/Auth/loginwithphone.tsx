import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, } from 'react-native';
import { useAuth } from '../../hooks/AuthContext';
import { fetchLoginWithPhone } from '../../services/api/auth.services';
import { saveToken } from './login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export default function LoginWithPhone({ navigation }: any) {
  const { login } = useAuth();
  const [inputVisible, setInputVisible] = useState(false);
  const [phonecheckVisible, setPhoneCheckVisible] = useState(false);
  const [status, setstatus] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneCode, setPhoneCode] = useState('');

    useEffect(() => {
        if(phoneNumber){
            setPhoneCheckVisible(true);
        }
    }, [phoneNumber]);

    const sendCode = () => {
        // services send code
        setstatus(false);

    }

    const handlecheck = () => {
        if(phoneCode && phoneNumber){
            if( phoneCode === '1234'){
                handleLogin();
                return;
            } else {
                Alert.alert('error code');
                return;
            }
        }
        Alert.alert('Please enter the code');
    }

    const handleLogin = () => {
        if (!inputVisible) {
            setInputVisible(true); // show input field
        } else {
            if (phoneNumber) {
                const data = {
                    phoneNumber: phoneNumber.trim(),
                }

                fetchLoginWithPhone(data)
                .then(rpdata => {
                    // console.log("Login successful:", data);
                    saveToken(rpdata.token, rpdata.user._id);
                    // console.log(data.user);
                    AsyncStorage.setItem('userId', rpdata.user._id);
                    rpdata.success ? login() : Alert.alert('Login failed. Please check your credentials.');
                })
                .catch(error => {
                    console.error("Error:", error);
                    Alert.alert('Error:' + error);
                })
            }
            else{
                Alert.alert('Please enter phone number'); // simple validation
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
              placeholder="Phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              autoCapitalize="none"
              />
          )}

          {phonecheckVisible && (
              status ? (
                  <View style={{ flexDirection: 'row' } as any}>
                  <TouchableOpacity style={styles.checkButton} onPress={sendCode}>
                      <Text style={styles.checkText}>send code</Text>
                  </TouchableOpacity>
                  </View>
              ) : (
                  <View style={{ flexDirection: 'row' } as any}>
                  <TextInput
                      style={{ ...styles.input, width: '60%', marginRight: 12 } as any}
                      placeholder="Phone Code"
                      value={phoneCode}
                      onChangeText={setPhoneCode}
                      keyboardType="number-pad"
                      autoCapitalize="none"
                  />
                  <TouchableOpacity style={styles.checkButton} onPress={handlecheck}>
                      <Text style={styles.checkText}>Check</Text>
                  </TouchableOpacity>
                  </View>
              )
          )}


        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Login with Phone Number</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>or</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.registerText}>Login with Email</Text>
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
    color: 'black',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
    resizeMode: 'contain',
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
  loginText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  checkButton: {
    backgroundColor: '#4f6ef7',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: '35%',
    height: 44,
  },
  checkText: {
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