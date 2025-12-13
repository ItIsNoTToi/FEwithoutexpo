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
import { useAuth } from '../../hooks/AuthContext';
import { fetchLoginWithPhone } from '../../services/api/auth.services';

export default function LoginWithPhone({ navigation }: any) {
  const { login } = useAuth();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [loading, setLoading] = useState(false);

  const phoneRegex = /^(0|\+84)[0-9]{9}$/;

  /* ===== SEND OTP ===== */
  const sendOtp = () => {
    if (!phoneRegex.test(phone)) {
      Alert.alert('❌ Invalid phone number');
      return;
    }

    // 🔥 sau này gọi API send OTP
    setStep('OTP');
    Alert.alert('📩 OTP Sent', 'Your code is 1234 (demo)');
  };

  /* ===== VERIFY OTP & LOGIN ===== */
  const verifyOtp = async () => {
    if (!otp) {
      Alert.alert('⚠️ Missing OTP');
      return;
    }

    if (otp !== '1234') {
      Alert.alert('❌ Invalid OTP');
      return;
    }

    try {
      setLoading(true);

      const res = await fetchLoginWithPhone(
        { phoneNumber: phone.trim() },
        'OTP'
      );

      res.success
        ? login(res)
        : Alert.alert('❌ Login failed');
    } catch (err: any) {
      Alert.alert('🔥 Error', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
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

          <Text style={styles.title}>Login with Phone</Text>
          <Text style={styles.subtitle}>
            Secure OTP authentication
          </Text>

          {/* CARD */}
          <View style={styles.card}>
            {step === 'PHONE' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Phone number"
                  placeholderTextColor="#aaa"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />

                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={sendOtp}
                >
                  <Text style={styles.primaryText}>Send OTP</Text>
                </TouchableOpacity>
              </>
            )}

            {step === 'OTP' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Enter OTP"
                  placeholderTextColor="#aaa"
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                />

                <TouchableOpacity
                  style={[
                    styles.primaryBtn,
                    loading && { opacity: 0.6 } as any,
                  ]}
                  disabled={loading}
                  onPress={verifyOtp}
                >
                  <Text style={styles.primaryText}>
                    {loading ? 'Verifying...' : 'Verify & Login'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setStep('PHONE')}>
                  <Text style={styles.backText}>← Change phone number</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* FOOTER */}
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerText}>
              Login with Email
            </Text>
          </TouchableOpacity>

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
    marginBottom: 14,
  },

  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
  },

  subtitle: {
    color: '#cbd5e1',
    marginBottom: 26,
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
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 14,
  },

  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },

  backText: {
    marginTop: 12,
    color: '#9ecbff',
    textAlign: 'center',
  },

  footerText: {
    color: '#c7d2fe',
    marginTop: 14,
    textDecorationLine: 'underline',
  },
});
