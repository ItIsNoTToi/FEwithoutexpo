import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft , faBars } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import User from '../models/user';
import { getUser, logout_fe } from '../services/api/user.services';
import Progress from './Data/progressScreen';
import { useAuth } from '../hooks/AuthContext';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<User>();
  const { logout } = useAuth();
  useEffect(( ) => {
    getUser()
    .then(data => {
      // console.log('data:2',data.data);
      setUser(data.data);
    })
    .catch(error => console.error(error));
  },[]);

  // if(user){
  //   console.log('user2', user._id);
  // }

  const logoutBtn = async () => {
    try{
      await logout_fe()
      .then(data =>{
        data.success ? logout(): Alert.alert("Can't logout");
      })
    } catch (e){
      console.log(e);
    } finally{
      logout();
    }
  }

  function homepage(): any {
    return navigation.navigate('Home');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" } as any}>
      <ScrollView style={styles.scrollview} contentContainerStyle={{ paddingBottom: 40 } as any}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={homepage}>
              <FontAwesomeIcon icon={faArrowLeft  as IconProp} size={24} color="black" />
            </TouchableOpacity>
            {/* Avatar + Info */}
            <Image
              source={{ uri: user?.avatar || "https://picsum.photos/200/300?random=1" }}
              style={styles.avatar}
            />
            {/* taskbar icon */}
            <TouchableOpacity onPress={logoutBtn}>
              <FontAwesomeIcon icon={faBars as IconProp} size={24} color="black" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.username}>{user?.username || "Loading..."}</Text>
          <Text style={styles.bio}>{user?.bio || "Giới thiệu bản thân ở đây..."}</Text>

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
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editText}>Chỉnh sửa hồ sơ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('Ranking') as any}>
            <Text style={styles.ranking}>Ranking</Text>
          </TouchableOpacity>

          {/* Progress */}
          <View style={styles.progressBox}>
            {user?._id && <Progress userId={user._id} />}
          </View>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutBtn} onPress={logoutBtn}>
            <Text style={styles.btnlogout}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollview: {
    flex: 1, 
    backgroundColor: '#fff',
    paddingTop: getStatusBarHeight(),
  },
  header: {
    height: 85,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 0,
  },
  editBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 20,
  },
  progressBox: {
    width: "100%",
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginTop: 16,
  },
  logoutBtn: {
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 8,
    marginTop: 0,
    width: "60%",
    alignSelf: "center",
    alignItems: "center",
  },
  container: {
    width: '100%',
    height: '100%',
    paddingTop: 0,
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 60,
    marginBottom: 10,
  },
  username: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bio: {
    color: '#666',
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
    color: '#000',
  },
  statLabel: {
    color: '#888',
  },
  editText: {
    color: "#fff",
    fontWeight: "600",
  },
  ranking: { color: "#fff", fontWeight: "600" },
  btnlogout: { color: "#fff", fontWeight: "bold" },
});
