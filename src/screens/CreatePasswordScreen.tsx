import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

const CreatePasswordScreen = ({ route, navigation }: any) => {
  const { email, token } = route.params;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (password.length < 8) {
      Alert.alert("Lỗi", "Mật khẩu phải ít nhất 8 ký tự");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu không khớp");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const res = await fetch("https://api.yourdomain.com/auth/set-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Tạo mật khẩu thất bại");
      }

      Alert.alert("Thành công", "Tạo mật khẩu thành công 🎉");
      navigation.replace("Home");
    } catch (err: any) {
      Alert.alert("Lỗi", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tạo mật khẩu</Text>
      <Text style={styles.subtitle}>{email}</Text>

      <TextInput
        placeholder="Mật khẩu"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        placeholder="Nhập lại mật khẩu"
        secureTextEntry
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Đang xử lý..." : "Xác nhận"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreatePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 24,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#1a73e8",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
