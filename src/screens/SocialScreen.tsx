/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserPlus, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import axios from "./../config/axiosconfig";

interface Friend {
  id: number;
  name: string;
  avatar: string;
}

export default function SocialScreen({ navigation }: any) {
    const [loading, setLoading] = useState(true);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [posts, setPosts] = useState<any[]>([]);

    const fetchPosts = async () => {
        try {
        setLoading(true);
        const res = await axios.get(`/api/getNewpost`);
        const postsData = Array.isArray(res.data.data) ? res.data.data : [];
        // console.log(postsData)
        setPosts(postsData);

        // Dummy friends, bạn có thể fetch riêng từ API sau
        setFriends([
            { id: 1, name: 'David', avatar: 'https://picsum.photos/200' },
            { id: 2, name: 'Linda', avatar: 'https://picsum.photos/201' },
        ]);
        } catch (e) {
        console.error(e);
        Alert.alert("Lỗi khi tải bài viết");
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();

        const interval = setInterval(fetchPosts, 60000); // reload mỗi 1 phút

        return () => clearInterval(interval);
    }, []);

  const addFriend = (id: number) => {
    Alert.alert('Đã gửi lời mời kết bạn!');
  };

  const createPost = () => {
    Alert.alert('Đi đến màn hình tạo bài viết');
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Social Screen</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0ff" style={{ marginTop: 40 } as any} />
        ) : (
          <>
            {/* FRIEND SUGGESTIONS */}
            <Text style={styles.sectionTitle}>Gợi ý kết bạn</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 10 } as any}>
              {friends.map(f => (
                <View key={f.id} style={styles.friendCard}>
                  <Image source={{ uri: f.avatar }} style={styles.friendAvatar} />
                  <Text style={styles.friendName}>{f.name}</Text>
                  <TouchableOpacity style={styles.addFriendBtn} onPress={() => addFriend(f.id)}>
                    <FontAwesomeIcon icon={faUserPlus as IconProp} size={16} color="#000" />
                    <Text style={styles.addFriendText}>Kết bạn</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            {/* CREATE POST */}
            <TouchableOpacity style={styles.createPostBtn} onPress={createPost}>
              <FontAwesomeIcon icon={faPlusCircle as IconProp} size={22} color="#000" />
              <Text style={styles.createPostText}>Tạo bài viết</Text>
            </TouchableOpacity>

            {/* POSTS */}
            <Text style={styles.sectionTitle}>Bài viết mới</Text>
            {posts.length === 0 ? (
              <Text style={{ color: '#888', margin: 10 } as any}>Chưa có bài viết</Text>
            ) : (
              posts.map(p => {
                const imageUrl = p.file?.find((f: any) => f.type === "image")?.url;
                return (
                  <View key={p._id} style={styles.postCard}>
                    <Text style={styles.postUser}>{p.author || 'Người dùng'}</Text>
                    <Text style={styles.postTitle}>{p.title}</Text>
                    <Text style={styles.postContent}>{p.description}</Text>
                    {imageUrl && (
                      <Image
                        source={{ uri: imageUrl.startsWith('http') ? imageUrl : `http://your-api${imageUrl}` }}
                        style={styles.postImage}
                      />
                    )}
                  </View>
                );
              })
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    padding: 20,
    backgroundColor: '#111',
    borderBottomWidth: 1,
    borderColor: '#222',
    alignItems: 'center',
  },
  title: { color: '#0ff', fontSize: 22, fontWeight: 'bold' },
  sectionTitle: { color: '#0ff', fontSize: 18, marginTop: 20, marginLeft: 10, fontWeight: '600' },
  postTitle: { color:'#0ff', fontWeight:'bold', marginBottom:6 },
  friendCard: {
    width: 120,
    backgroundColor: '#111',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#0ff'
  },
  friendAvatar: { width: 70, height: 70, borderRadius: 40, marginBottom: 8 },
  friendName: { color: '#fff', fontWeight: '600', marginBottom: 8 },
  addFriendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addFriendText: { marginLeft: 5, fontWeight: '600' },
  createPostBtn: {
    flexDirection: 'row',
    backgroundColor: '#0ff',
    margin: 15,
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createPostText: { marginLeft: 8, fontWeight: '700' },
  postCard: {
    backgroundColor: '#111',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0ff',
  },
  postUser: { color: '#0ff', fontSize: 16, fontWeight: '700' },
  postContent: { color: '#fff', marginVertical: 10 },
  postImage: { width: '100%', height: 200, borderRadius: 10, marginTop: 10 },
});
