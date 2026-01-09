import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";

interface NewpostProps {
  onSave: (title: string, description: string) => Promise<void>;
  onClose: () => void;
  title: string;
  setTitle: (t: string) => void;
  description: string;
  setDescription: (d: string) => void;
  loading: boolean;
}

const Newpost = ({ onSave, onClose, title, setTitle, description, setDescription, loading }: NewpostProps) => {
  const handleSave = async () => {
    if (!title.trim()) return Alert.alert("Chưa nhập tiêu đề");
    await onSave(title, description);
  };

  return (
    <Modal visible transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Tạo bài viết mới</Text>

          <TextInput
            placeholder="Tiêu đề"
            placeholderTextColor="#888"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            placeholder="Nội dung"
            placeholderTextColor="#888"
            style={[styles.input, { height: 80 } as any]}
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
            {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.saveText}>Tạo bài viết</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex:1, backgroundColor:'rgba(0,0,0,0.7)', justifyContent:'center', alignItems:'center' },
  content: { width:'85%', backgroundColor:'#111', borderRadius:12, padding:20, alignItems:'center', borderWidth:1, borderColor:'#0ff' },
  title: { fontSize:18, fontWeight:'bold', color:'#0ff', marginBottom:16 },
  input: { width:'100%', padding:10, borderWidth:1, borderColor:'#0ff', borderRadius:8, marginBottom:12, color:'#fff' },
  saveBtn: { backgroundColor:'#0ff', padding:12, borderRadius:8, marginBottom:10, width:'100%', alignItems:'center' },
  saveText: { color:'#000', fontWeight:'bold' },
  cancelBtn: { padding:10, borderRadius:8, borderWidth:1, borderColor:'#0ff', width:'100%', alignItems:'center' },
  cancelText: { color:'#0ff', fontWeight:'600' }
});

export default Newpost;
