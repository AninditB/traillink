import React, { useState, useEffect, useCallback } from "react";
import { 
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity, 
  Alert, RefreshControl, ActivityIndicator 
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

const BACKEND_URL = "http://192.168.4.34:5000/api"; 

interface Post {
  _id: string;
  title: string;
  location: string;
  description: string;
  image?: string;
  createdBy: string; // Admin (creator) of the post
  members: string[]; // Users who have joined
}

interface DecodedToken {
  id: string;
  name: string;
  email: string;
}

export default function Explore(): JSX.Element {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<DecodedToken | null>(null);
  const router = useRouter();

  // ✅ Function to Get User Data from JWT
  const fetchLoggedInUser = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        const decoded: DecodedToken = jwtDecode(token);
        setLoggedInUser(decoded);
        console.log("Logged-in User:", decoded);
      }
    } catch (error) {
      console.error("Error decoding user JWT:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/posts/listPosts`);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      Alert.alert("Error", "Failed to load posts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchLoggedInUser(); // ✅ Get User Data on Load
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, []);

  const handleJoinPost = async (postId: string) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/posts/join/${postId}`, {}, { withCredentials: true });
      Alert.alert("Success", response.data.message);
      fetchPosts();
    } catch (error: unknown) {
      console.error("Join post error:", error);
  
      let errorMessage = "Failed to join post";
  
      // Check if error is an Axios error and extract the message safely
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
  
      Alert.alert("Error", errorMessage);
    }
  };
  
  const handleLeavePost = async (postId: string) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/posts/leave/${postId}`, {}, { withCredentials: true });
      Alert.alert("Success", response.data.message);
      fetchPosts();
    } catch (error: unknown) {
      console.error("Leave post error:", error);
  
      let errorMessage = "Failed to leave group";
  
      // Check if error is an Axios error and extract the message safely
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
  
      Alert.alert("Error", errorMessage);
    }
  };
  

  const handleDeletePost = async (postId: string) => {
    try {
      await axios.delete(`${BACKEND_URL}/posts/delete/${postId}`, { withCredentials: true });
      Alert.alert("Deleted", "Post has been deleted successfully.");
      fetchPosts();
    } catch (error) {
      console.error("Delete post error:", error);
      Alert.alert("Error", "Failed to delete post");
    }
  };

  const renderPostItem = ({ item }: { item: Post }) => {
    const isAdmin = loggedInUser?.id === item.createdBy; // ✅ Check if user is the post creator (admin)
    const isMember = item.members.includes(loggedInUser?.id ?? ""); // ✅ Check if user is in the post

    return (
      <View style={styles.card}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.image} />
        ) : (
          <Image source={{ uri: "https://source.unsplash.com/400x300/?hiking" }} style={styles.image} />
        )}
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.location}>📍 {item.location}</Text>
        <Text style={styles.description}>{item.description}</Text>

        {/* ✅ Conditional Buttons Based on User Role */}
        {isAdmin ? (
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePost(item._id)}>
            <Text style={styles.buttonText}>Delete Post</Text>
          </TouchableOpacity>
        ) : isMember ? (
          <TouchableOpacity style={styles.leaveButton} onPress={() => handleLeavePost(item._id)}>
            <Text style={styles.buttonText}>Leave Group</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.joinButton} onPress={() => handleJoinPost(item._id)}>
            <Text style={styles.buttonText}>Join Trek</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Explore Treks</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={renderPostItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      {/* Floating Create Button */}
      <TouchableOpacity 
        style={styles.createButton} 
        onPress={() => router.navigate("/main/createPost")}
      >
        <Text style={styles.createButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  location: {
    fontSize: 14,
    color: "gray",
    marginBottom: 5,
  },
  description: {
    fontSize: 12,
    color: "#555",
    marginBottom: 10,
  },
  joinButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 5,
  },
  leaveButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  createButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  createButtonText: {
    color: "#FFF",
    fontSize: 30,
    fontWeight: "bold",
  },
});

