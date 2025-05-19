import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function GroupChatScreen() {
  const { id } = useLocalSearchParams(); // ✅ Get the group ID from the URL

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Group Chat</Text>
      <Text>Chat for Group ID: {id}</Text>
      {/* 🔥 We will build the actual chat here later */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
