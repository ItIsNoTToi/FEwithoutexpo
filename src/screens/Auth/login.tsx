import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../hooks/AuthContext';
import { fetchLogin } from '../../services/api/auth.services';

export default function Login({ navigation }: any) {
  const { login } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (type: 'TK' | 'GG' | 'FB' | 'Apple') => {
    if (type === 'TK' && !showForm) {
      setShowForm(true);
      return;
    }

    let data;
    if (type === 'TK') {
      if (!email || !password) {
        Alert.alert('⚠️ Missing info', 'Please enter email & password');
        return;
      }

      data = {
        email: email.trim(),
        password: password.trim(),
      };
    }

    fetchLogin(data, type)
      .then(res => {
        res.success
          ? login(res)
          : Alert.alert('❌ Login failed', 'Invalid credentials');
      })
      .catch(err => {
        console.error(err);
        Alert.alert('🔥 Error', err.message || 'Something went wrong');
      });
  };

  return (
    <LinearGradient
      colors={['#0f2027', '#203a43', '#2c5364']}
      style={{ flex: 1 } as any}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 } as any}
      >
        <View style={styles.container}>
          {/* LOGO */}
          <Image
            source={require('../../uploads/assets/logo.png')}
            style={styles.logo}
          />

          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Learn English with AI – Smart & Personal
          </Text>

          {/* CARD */}
          <View style={styles.card}>
            {showForm && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#aaa"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#aaa"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </>
            )}

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => handleLogin('TK')}
            >
              <Text style={styles.primaryText}>
                {showForm ? 'Login' : 'Login with Email'}
              </Text>
            </TouchableOpacity>

            {/* GOOGLE */}
            <View style={styles.socialRow}>
              <TouchableOpacity
                style={styles.googleBtn}
                onPress={() => handleLogin('GG')}
              >
                <Ionicons name="logo-google" size={28} color="#fbbc05" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.googleBtn}
                onPress={() => handleLogin('FB')}
              >
                <Ionicons name="logo-facebook" size={28} color="#0509fbff" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity>
              <Text style={styles.forgot}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* FOOTER */}
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerText}>
              Create a new account
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  logo: {
    width: 110,
    height: 110,
    resizeMode: 'contain',
    marginBottom: 12,
  },

  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
  },

  subtitle: {
    color: '#cbd5e1',
    marginBottom: 28,
  },

  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
  },

  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: '#fff',
    marginBottom: 14,
  },

  primaryBtn: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },

  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },

  googleBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  forgot: {
    marginTop: 14,
    color: '#9ecbff',
    textAlign: 'center',
  },

  footerText: {
    color: '#c7d2fe',
    marginTop: 14,
    textDecorationLine: 'underline',
  },
});