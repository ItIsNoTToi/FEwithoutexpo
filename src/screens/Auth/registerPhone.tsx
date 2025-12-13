import LinearGradient from 'react-native-linear-gradient';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Alert,
  Platform,
  Modal,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchRegister } from '../../services/api/auth.services';

export default function RegisterPhone({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState(new Date());
  const [showDate, setShowDate] = useState(false);

  const [showClassModal, setShowClassModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const phoneRegex = /^(0|\+84)[0-9]{9}$/;

  /* ================== STEP 1: VALIDATE ================== */
  const handleRegister = () => {
    if (!phone) {
      Alert.alert('⚠️ Missing Phone', 'Please enter your phone number');
      return;
    }

    if (!phoneRegex.test(phone)) {
      Alert.alert('❌ Invalid Phone', 'Phone number is not valid');
      return;
    }

    // ✅ mở popup chọn class
    setShowClassModal(true);
  };

  /* ================== STEP 2: SUBMIT ================== */
  const submitRegister = async () => {
    if (!selectedClass) return;

    const userData = {
      registerType: 'OTP',
      username: username.trim(),
      phone: phone.trim(),
      warriorClass: selectedClass, // ⭐ GAME CORE
      dateOfBirth: dob.toISOString().split('T')[0],
    };

    try {
      const res = await fetchRegister(userData);

      if (res?.success) {
        Alert.alert('🎉 Hero Created!', 'OTP has been sent to your phone');
        // navigation.replace('OtpVerify', { phone });
        navigation.navigate('Login');
      } else {
        Alert.alert('❌ Failed', res?.error || 'Register failed');
        navigation.navigate('Login');
      }
    } catch (err: any) {
      Alert.alert('🔥 Error', err?.message || 'Something went wrong');
      navigation.navigate('Login');
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
        <ScrollView contentContainerStyle={styles.container}>
          {/* LOGO */}
          <Image
            source={require('../../uploads/assets/logo.png')}
            style={styles.logo}
          />

          <Text style={styles.title}>Begin Your Journey</Text>
          <Text style={styles.subtitle}>
            Awaken your destiny in the AI realm
          </Text>

          {/* USERNAME */}
          <TextInput
            style={styles.input}
            placeholder="Hero Name (optional)"
            placeholderTextColor="#aaa"
            value={username}
            onChangeText={setUsername}
          />

          {/* PHONE */}
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#aaa"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          {/* DOB */}
          <TouchableOpacity
            style={styles.dateBox}
            onPress={() => setShowDate(true)}
          >
            <Text style={styles.dateText}>
              🗓 Date of Birth: {dob.toDateString()}
            </Text>
          </TouchableOpacity>

          {showDate && (
            <DateTimePicker
              value={dob}
              mode="date"
              onChange={(_, date) => {
                setShowDate(false);
                if (date) setDob(date);
              }}
            />
          )}

          {/* SUBMIT */}
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <LinearGradient
              colors={['#6a11cb', '#2575fc']}
              style={styles.buttonInner}
            >
              <Text style={styles.buttonText}>⚔️ Create Hero</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>
              Already a hero? Enter the realm →
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.loginText}>
              Reincarnation with Email
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ================== CLASS MODAL ================== */}
      <Modal visible={showClassModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => {
                setShowClassModal(false);
                setSelectedClass(null);
                }}
            >
                <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>⚔️ Choose Your Class</Text>

            {[  
              { key: 'Listener Mage', label: 'Listener Mage 🎧' },
              { key: 'Speaker Warrior', label: 'Speaker Warrior 🗣️' },
              { key: 'Reader Rogue', label: 'Reader Rogue 📖' },
            ].map(item => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.classItem,
                  selectedClass === item.key && styles.classActive,
                ]}
                onPress={() => setSelectedClass(item.key)}
              >
                <Text style={styles.classText}>{item.label}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[
                styles.confirmBtn,
                !selectedClass && { opacity: 0.5 } as any,
              ]}
              disabled={!selectedClass}
              onPress={submitRegister}
            >
              <Text style={styles.confirmText}>🔥 Confirm Hero</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

/* ================== STYLES ================== */
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    logo: {
        width: 110,
        height: 110,
        marginBottom: 16,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        color: '#ccc',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 48,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 12,
        paddingHorizontal: 14,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        color: '#fff',
    },
    dateBox: {
        width: '100%',
        padding: 14,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.12)',
        marginBottom: 14,
    },
    dateText: {
        color: '#ddd',
    },
    button: {
        width: '100%',
        marginTop: 12,
        borderRadius: 14,
        overflow: 'hidden',
    },
    buttonInner: {
        paddingVertical: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    loginText: {
        marginTop: 20,
        color: '#9ecbff',
        textDecorationLine: 'underline',
    },
    /* MODAL */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.65)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        width: '85%',
        backgroundColor: '#1f2933',
        borderRadius: 16,
        padding: 20,
    },
    modalTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 16,
    },
    classItem: {
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#444',
        marginBottom: 10,
    },
    classActive: {
        borderColor: '#6a11cb',
        backgroundColor: 'rgba(106,17,203,0.25)',
    },
    classText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    confirmBtn: {
        marginTop: 10,
        backgroundColor: '#6a11cb',
        paddingVertical: 14,
        borderRadius: 12,
    },
    confirmText: {
        color: '#fff',
        fontWeight: '700',
        textAlign: 'center',
        fontSize: 16,
    },
    closeBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
        padding: 6,
    },
    closeText: {
        color: '#aaa',
        fontSize: 20,
        fontWeight: '700',
    }
});
