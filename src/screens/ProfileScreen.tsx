/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, Image, TouchableOpacity, 
  ActivityIndicator, Alert, Modal, FlatList, Pressable
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft , faBars, faCamera } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { SafeAreaView } from "react-native-safe-area-context";
import User from '../models/user';
import { getUser, logout_fe, SaveUser, uploadAvatar } from '../services/api/user.services';
import { useAuth } from '../hooks/AuthContext';
import { launchImageLibrary } from "react-native-image-picker";
import ProfileInformation from './ProfileInformation';
import Progresslog from './Data/progressScreen';
import Config from "react-native-config";
import Newpost from './newpost';

const URL_API = Config.URL_API;

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostDescription, setNewPostDescription] = useState('');
  const [newPostLoading, setNewPostLoading] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const { logout } = useAuth();

  // ---------------- FETCH USER ----------------
  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await getUser();
      setUser(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUser(); }, []);

  // ---------------- FETCH POSTS ----------------
  const fetchPosts = async () => {
    if (!user?._id) return;
    try {
      setLoadingPosts(true);
      const res = await fetch(`${URL_API}/api/getPost/${user._id}`);
      const json = await res.json();
      setPosts(Array.isArray(json.data) ? json.data : []);
    } catch (e) { console.error(e); }
    finally { setLoadingPosts(false); }
  };

  useEffect(() => { if (!loading) fetchPosts(); }, [loading]);

  // ---------------- AVATAR ----------------
  const pickImage = () => {
    launchImageLibrary({ mediaType: "photo", quality: 1 }, (res) => {
      if (res.assets?.length) setImageUri(res.assets[0].uri || null);
    });
  };

  const handleUploadAvatar = async () => {
    setLoading(true);
    if (!imageUri) return Alert.alert("Chưa chọn ảnh");
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "avatar.jpg",
      } as any);
      formData.append("upload_preset", "learnE");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dyltsfo5c/image/upload",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      // console.log("Cloudinary URL:", data.secure_url);
      setImageUri(null);
      setShowAvatarModal(false);

      // Cập nhật vào server
      await uploadAvatar(user?._id, data?.secure_url)
      .then(res => {
        // console.log(res)
        if(res.success === true){
          
          Alert.alert("Upload thành công");
          fetchUser();
        } else{
          Alert.alert("Upload thất bại");
        }
      });
    } catch (err) {
      console.error(err);
      Alert.alert("Upload thất bại");
    } finally{
      setLoading(false)
    }
  }

  const getAvatarUri = () => {
    if (imageUri && showAvatarModal) return imageUri;
    return user?.UserDetail?.avatar?.startsWith("http") 
      ? user.UserDetail.avatar 
      : `${URL_API}${user?.UserDetail?.avatar}` || "https://picsum.photos/200";
  };

  // ---------------- LOGOUT ----------------
  const logoutBtn = async () => {
    try {
      const data = await logout_fe(user?.loginType as string);
      if (data.success) logout();
      else Alert.alert("Can't logout");
    } catch (e) { console.error(e); }
  };

  const handleSave = async (updatedUser: User) => {
    try {
      setLoading(true);
      const data = await SaveUser(updatedUser);
      if (data.success) { Alert.alert("Lưu thông tin thành công"); setShowEditForm(false); fetchUser(); }
      else Alert.alert("Có lỗi khi lưu thông tin");
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // ---------------- RENDER ----------------
  const PostCard = ({ post }: any) => (
    <View style={styles.post}>
      <Text style={styles.postTitle}>{post.title}</Text>
      {post.description && <Text style={styles.content}>{post.description}</Text>}
    </View>
  );

  const ListHeader = () => (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <FontAwesomeIcon icon={faArrowLeft as IconProp} size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Hồ sơ</Text>
        <TouchableOpacity onPress={logoutBtn}>
          <FontAwesomeIcon icon={faBars as IconProp} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.avatarBox}>
        <TouchableOpacity onPress={() => setShowAvatarModal(true)}>
          <Image source={{ uri: getAvatarUri() }} style={styles.avatar} />
          <View style={styles.cameraIcon}>
            <FontAwesomeIcon icon={faCamera as IconProp} size={18} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.Name}>{user?.UserDetail?.FirstName} {user?.UserDetail?.LastName}</Text>
      <Text style={styles.bio}>{user?.UserDetail?.bio || "Giới thiệu bản thân..."}</Text>

      <View style={{ flexDirection:'row', flexWrap:'wrap', justifyContent:'center', marginBottom:10 } as any}>
        <TouchableOpacity style={styles.editBtn} onPress={() => setShowEditForm(!showEditForm)}>
          <Text style={styles.editText}>Chỉnh sửa hồ sơ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editBtn} onPress={() => setShowProgress(!showProgress)}>
          <Text style={styles.editText}>Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editBtn} onPress={() => setShowNewPostModal(true)}>
          <Text style={styles.editText}>New Post</Text>
        </TouchableOpacity>
      </View>

      {showEditForm && <ProfileInformation user={user as any} onSave={handleSave} />}
      {showProgress && <Progresslog userId={user?._id} />}
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color="#0ff" style={{ flex:1, justifyContent:'center', marginTop:50 } as any} />;

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:'#000' } as any}>
      <FlatList
        data={posts}
        keyExtractor={item => item._id}
        renderItem={({ item }) => <PostCard post={item} />}
        ListHeaderComponent={<ListHeader />}
        ListEmptyComponent={<Text style={{ color:'#888', textAlign:'center', marginTop:20 } as any}>Chưa có bài post</Text>}
        contentContainerStyle={{ paddingBottom:40 } as any}
      />

      {showNewPostModal && (
        <Newpost
          title={newPostTitle}
          setTitle={setNewPostTitle}
          description={newPostDescription}
          setDescription={setNewPostDescription}
          loading={newPostLoading}
          onClose={() => setShowNewPostModal(false)}
          onSave={async (title, description) => {
            setNewPostLoading(true);
            try {
              const res = await fetch(`${URL_API}/api/post/new`, {
                method:"POST",
                headers: { "Content-Type":"application/json" },
                body: JSON.stringify({ userId: user?._id, title, description, type:"post", file:[], status:"show", author: user?.UserDetail?.FirstName })
              });
              const data = await res.json();
              if (data.success) { Alert.alert("Tạo bài viết thành công"); fetchPosts(); setShowNewPostModal(false); setNewPostTitle(''); setNewPostDescription(''); }
              else Alert.alert("Tạo bài viết thất bại");
            } catch (e) { console.error(e); Alert.alert("Lỗi server"); }
            finally { setNewPostLoading(false); }
          }}
        />
      )}

      <Modal visible={showAvatarModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cập nhật Avatar</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={pickImage}>
              <Text style={styles.modalBtnText}>Chọn ảnh</Text>
            </TouchableOpacity>
            {imageUri && <Image source={{ uri: imageUri }} style={styles.previewAvatar} />}
            <TouchableOpacity style={styles.saveBtn} onPress={handleUploadAvatar}>
              <Text style={styles.saveText}>Lưu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAvatarModal(false)}>
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity onPress={logoutBtn}>
        <Text style={{ color:'#888', textAlign:'center', marginBottom:20 } as any}>LOGOUT</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  header:{ height:85, flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:16, backgroundColor:'#111', borderBottomWidth:1, borderBottomColor:'#222' },
  headerText:{ color:'#fff', fontSize:20, fontWeight:'bold' },
  avatarBox:{ marginTop:20, alignItems:'center', position:'relative' },
  avatar:{ width:100, height:100, borderRadius:60, borderWidth:3, borderColor:'#0ff' },
  cameraIcon:{ position:'absolute', bottom:0, right:0, backgroundColor:'#007AFF', padding:6, borderRadius:20, borderWidth:2, borderColor:'#000' },
  Name:{ color:'#0ff', fontSize:20, fontWeight:'bold', marginTop:12, textAlign: 'center' },
  bio:{ color:'#aaa', fontSize:14, marginBottom:20, textAlign: 'center' },
  editBtn:{ backgroundColor:'#222', paddingVertical:10, paddingHorizontal:24, borderRadius:8, marginBottom:12, borderWidth:1, borderColor:'#0ff', marginRight:8 },
  editText:{ color:'#0ff', fontWeight:'600' },
  post:{ backgroundColor:'#111', padding:14, borderRadius:12, marginBottom:12, width:'100%', borderWidth:1, borderColor:'#222' },
  postTitle:{ color:'#0ff', fontWeight:'bold', marginBottom:6 },
  content:{ color:'#ddd' },
  modalOverlay:{ flex:1, backgroundColor:'rgba(0,0,0,0.7)', justifyContent:'center', alignItems:'center' },
  modalContent:{ width:'85%', backgroundColor:'#111', borderRadius:12, padding:20, alignItems:'center', borderWidth:1, borderColor:'#0ff' },
  modalTitle:{ fontSize:18, fontWeight:'bold', color:'#0ff', marginBottom:16 },
  modalBtn:{ backgroundColor:'#007AFF', padding:10, borderRadius:8, marginBottom:12 },
  modalBtnText:{ color:'#fff', fontWeight:'600' },
  previewAvatar:{ width:100, height:100, borderRadius:60, marginVertical:12, borderWidth:2, borderColor:'#0ff' },
  saveBtn:{ backgroundColor:'#0ff', padding:12, borderRadius:8, marginBottom:10, width:'100%', alignItems:'center' },
  saveText:{ color:'#000', fontWeight:'bold' },
  cancelBtn:{ padding:10, borderRadius:8, borderWidth:1, borderColor:'#0ff', width:'100%', alignItems:'center' },
  cancelText:{ color:'#0ff', fontWeight:'600' }
});
