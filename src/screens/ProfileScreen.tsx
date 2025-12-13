import { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, Image, TouchableOpacity, 
  ScrollView, ActivityIndicator, Alert, Modal 
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft , faBars, faCamera } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import User from '../models/user';
import { getUser, logout_fe, SaveUser, uploadAvatar } from '../services/api/user.services';
import Progress from './Data/progressScreen';
import { useAuth } from '../hooks/AuthContext';
import { SafeAreaView } from "react-native-safe-area-context";
import UserDetail from '../models/userdetail';
import { launchImageLibrary } from "react-native-image-picker";
import ProfileInformation from './ProfileInformation';

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<User>();
  const [userDetail, setUserDetail] = useState<UserDetail>();
  const [loading, setLoading] = useState(true);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const { logout } = useAuth();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  // Load user info
  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await getUser();
      setUser(data.data);
      setUserDetail(data.data.UserDetail);
    } catch (err) {
      console.error("Lỗi load user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logoutBtn = async () => {
    try {
      const type = user?.loginType;
      const data = await logout_fe(type as string);
      if (data.success) {
        logout();
      } else {
        Alert.alert("Can't logout");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 1,
      },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorCode) {
          console.log("ImagePicker Error: ", response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          setImageUri(uri || null);
        }
      }
    );
  };

  const HandleuploadAvatar = async () => {
    if (!imageUri) return Alert.alert("Chưa chọn ảnh");

    const formData = new FormData();
    formData.append("avatar", {
      uri: imageUri,
      name: "avatar.jpg",
      type: "image/jpg"
    } as any);

    uploadAvatar(user?._id, formData)
    .then(data =>
    {
      if(data.success){
        Alert.alert("Upload thành công");
        setUserDetail({...userDetail, avatar: data.avatar} as UserDetail);
        setShowAvatarModal(false);
      }
    });
  }

  function homepage(): any {
    return navigation.navigate('Home');
  }

  const handleSave = async (updatedUser: User) => {
    try {
      setLoading(true);
      const data = await SaveUser(updatedUser);

      if (data.success) {
        Alert.alert(data.message || "Lưu thông tin thành công");
        setShowEditForm(false);
        fetchUser();
      } else {
        Alert.alert("Có lỗi khi lưu thông tin");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" } as any}>
      <ScrollView style={styles.scrollview} contentContainerStyle={{ paddingBottom: 40 } as any}>
        
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size="large" color="#00FFFF" style={{ marginTop: 50 } as any} />
          ) : (
            <>
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity onPress={homepage}>
                  <FontAwesomeIcon icon={faArrowLeft as IconProp} size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Hồ sơ</Text>
                <TouchableOpacity onPress={logoutBtn}>
                  <FontAwesomeIcon icon={faBars as IconProp} size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Avatar */}
              <View style={styles.avatarBox}>
                <TouchableOpacity onPress={() => setShowAvatarModal(true)}>
                  <Image 
                    source={{ uri: imageUri || userDetail?.avatar || "https://picsum.photos/200" }} 
                    style={styles.avatar} 
                  />
                  <View style={styles.cameraIcon}>
                    <FontAwesomeIcon icon={faCamera as IconProp} size={18} color="#fff" />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Info */}
              <Text style={styles.Name}>{user?.UserDetail?.FirstName} {user?.UserDetail?.LastName}</Text>
              <Text style={styles.username}>@{user?.username}</Text>
              <Text style={styles.bio}>{user?.UserDetail?.bio || "Giới thiệu bản thân ở đây..."}</Text>

              {/* Stats */}
              <View style={styles.statsContainer}>
                {[
                  { number: 120, label: "Bài viết" },
                  { number: 340, label: "Người theo dõi" },
                  { number: 180, label: "Đang theo dõi" },
                ].map((stat, i) => (
                  <View key={i} style={styles.stat}>
                    <Text style={styles.statNumber}>{stat.number}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                ))}
              </View>

              {/* Edit profile */}
              <TouchableOpacity style={styles.editBtn} onPress={() => setShowEditForm(!showEditForm)}>
                <Text style={styles.editText}>Chỉnh sửa hồ sơ</Text>
              </TouchableOpacity>
              <View style={{flexDirection: 'row'} as any }>
                <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('Ranking') as any}>
                  <Text style={styles.editText}>Ranking</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.editBtn} onPress={() => setShowProgress(!showProgress)}>
                  <Text style={styles.editText}>Progress</Text>
                </TouchableOpacity>
              </View>

              {
                showEditForm &&
                <View style={styles.progressBox}>
                  <ProfileInformation user={user as any} onSave={handleSave} />
                </View>
              }

              {/* Progress */}
              {
                showProgress &&
                <View style={styles.progressBox}>
                  <Progress userId={user!._id} />
                </View>
              }

              {/* Logout */}
              <TouchableOpacity style={styles.logoutBtn} onPress={logoutBtn}>
                <Text style={styles.btnlogout}>Đăng xuất</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      {/* Modal pick + save avatar */}
      <Modal visible={showAvatarModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cập nhật Avatar</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={pickImage}>
              <Text style={styles.modalBtnText}>Chọn ảnh từ thư viện</Text>
            </TouchableOpacity>
            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.previewAvatar} />
            )}
            <TouchableOpacity style={styles.saveBtn} onPress={HandleuploadAvatar}>
              <Text style={styles.saveText}>Lưu Avatar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAvatarModal(false)}>
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollview: {
    flex: 1, 
    backgroundColor: '#000',
  },
  container: {
    width: '100%',
    minHeight: '100%',
    paddingTop: 0,
    alignItems: 'center',
    backgroundColor: '#000',
    flex: 1,
  },
  header: {
    height: 85,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#111",
    borderBottomWidth: 1,
    borderBottomColor: "#222"
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold"
  },
  avatarBox: {
    marginTop: 20,
    alignItems: "center",
    position: "relative"
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#0ff",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    padding: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#000"
  },
  Name: {
    color: '#0ff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
  },
  username: {
    color: 'rgba(96, 241, 241, 1)',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 12,
  },
  bio: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
  },
  statLabel: {
    color: '#aaa',
  },
  editBtn: {
    backgroundColor: "#222",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#0ff",
  },
  editText: {
    color: "#0ff",
    fontWeight: "600",
  },
  progressBox: {
    width: "100%",
    padding: 20,
    backgroundColor: "#111",
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#0ff",
  },
  logoutBtn: {
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: "60%",
    alignSelf: "center",
    alignItems: "center",
  },
  btnlogout: { color: "#fff", fontWeight: "bold" },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0ff"
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0ff",
    marginBottom: 16
  },
  modalBtn: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "600"
  },
  previewAvatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginVertical: 12,
    borderWidth: 2,
    borderColor: "#0ff"
  },
  saveBtn: {
    backgroundColor: "#0ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
    alignItems: "center"
  },
  saveText: { color: "#000", fontWeight: "bold" },
  cancelBtn: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0ff",
    width: "100%",
    alignItems: "center"
  },
  cancelText: { color: "#0ff", fontWeight: "600" }
});
