import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, 
  Image 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useRouter } from "expo-router";

const BACKEND_URL = "http://192.168.4.34:5000/api";
const DEFAULT_IMAGE = "https://www.agoda.com/special-editions/responsible-travel/trekking-lightly-exploring-nature-one-step-at-a-time/";

export default function CreatePostScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreatePost = async () => {
    try {
      const postData = {
        title,
        description,
        location,
        image: image || DEFAULT_IMAGE, // Use default image if user doesn't upload one
      };

      const response = await axios.post(`${BACKEND_URL}/posts/createPost`, postData, { withCredentials: true });
      Alert.alert("Success", response.data.message);
      router.navigate("/main/tabs/explore"); // Redirect back to Explore screen
    } catch (error: unknown) {
      console.error("Create post error:", error);

      let errorMessage = "Failed to create post";

      if (axios.isAxiosError(error) && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a New Trek Post</Text>

      {/* Title Input */}
      <Text style={styles.label}>Trek Title</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter trek title" 
        value={title} 
        onChangeText={setTitle} 
      />

      {/* Description Input */}
      <Text style={styles.label}>Trek Description</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Describe the trek" 
        value={description} 
        onChangeText={setDescription} 
        multiline 
      />

      {/* Location Input */}
      <Text style={styles.label}>Trek Location</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter location" 
        value={location} 
        onChangeText={setLocation} 
      />

      {/* Image Upload Section */}
      <Text style={styles.label}>Upload Image</Text>
      <TouchableOpacity style={styles.imageButton} onPress={handleImagePicker}>
        <Text style={styles.imageButtonText}>Choose Image</Text>
      </TouchableOpacity>

      {/* Display Selected Image or Default Image */}
      <Image 
        source={{ uri: image || DEFAULT_IMAGE }} 
        style={styles.imagePreview} 
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleCreatePost}>
        <Text style={styles.buttonText}>Create Post</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#f8f9fa" 
  },
  header: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20, 
    textAlign: "center" 
  },
  label: { 
    fontSize: 16, 
    fontWeight: "bold", 
    marginBottom: 5 
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 15, 
    backgroundColor: "#fff" 
  },
  imageButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  imageButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: { 
    backgroundColor: "#28a745", 
    padding: 15, 
    borderRadius: 8, 
    alignItems: "center" 
  },
  buttonText: { 
    color: "#FFF", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
});
