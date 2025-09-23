import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Button } from 'react-native';
import { fetchRegister } from '../../services/api/auth.services';
import { useAuth } from '../../hooks/AuthContext';
import { ScrollView } from 'react-native-gesture-handler';
import { saveToken } from './login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Register({ navigation }: any) {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [date, setDate] = useState(new Date())
  const [mode, setMode] = useState('date' as any);
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode: any) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  const { login } = useAuth();

  const handleRegister = async () => {
    if(username && email && phoneNumber && password && confirmPassword) {
      if (!emailRegex.test(email)) {
        Alert.alert("Invalid email format");
        return;
      }

      if (!passwordRegex.test(password)) {
        Alert.alert("Password must be at least 8 characters long, include uppercase, lowercase, number, and special character");
        return;
      }
      
      if(confirmPassword !== password) {
        Alert.alert('Your password must match with your confirm password');
        return;
      }

      const userData = {
        username: username.trim(),
        email: email.trim(),
        phone: phoneNumber.trim(),
        password: password.trim(),
        dateOfBirth: date.toISOString().split('T')[0], // Lưu định dạng YYYY-MM-DD
        role: 'user',
        avatar: 'https://i.pravatar.cc/150?u=' + Math.random().toString(36).substring(7) // random avatar
      }

      // console.log(userData);

      await fetchRegister(userData)
      .then((data) => {
        saveToken(data.token, data.data.id);
         console.log(data);
        AsyncStorage.setItem('userId', data.data.id);
        data.success ? login() : Alert.alert('Login failed. Please check your credentials.');
      })
      .catch((error: any) => {
        if (error.status === 400) {
          Alert.alert(error.message || 'Username, email, or phone number already exists');
        } else {
          Alert.alert('Something went wrong: ' + error.message);
        }
      });
    } else {
      Alert.alert('You must fill all the fields');
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{flex: 1} as any}>
      <ScrollView style={{ flex: 1, backgroundColor: '#f0f6ff', } as any}>
        <View style={styles.container}>
          <Image source={require('../../uploads/assets/logo.png')} style={styles.logo} />

          <Text style={styles.title}>Create your LearnE Account</Text>
          <Text style={styles.subtitle}>Start your English journey with AI today!</Text>

          <TextInput
            style={styles.input}
            placeholder="username"
            value={username}
            onChangeText={setUserName}
          /> 

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            autoCapitalize="none"
          />
          <View style={{ width: '100%', marginBottom: 16, } as any}>
              <Text style={{ marginBottom: 8, color: '#555' } as any}>Date of Birth:  {date.toLocaleString()}</Text>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  onChange={onChange}
                />
              )}
              <Button onPress={showDatepicker} title="Enter your date!" />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
          
          <Text style={styles.orText}>Already have an account?</Text>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Login here</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  logo: {
    width: 100,
    height: 100,
    marginTop: 30,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ccc',
    color: 'black',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  registerButton: {
    backgroundColor: '#4f6ef7',
    paddingVertical: 14,
    borderRadius: 8,
    width: '100%',
    marginTop: 8,
  },
  registerText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  orText: {
    marginTop: 20,
    fontSize: 14,
    color: '#999',
  },
  loginText: {
    fontSize: 15,
    color: '#4f6ef7',
    textDecorationLine: 'underline',
    marginTop: 8,
  },
});
