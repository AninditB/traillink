import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  StatusBar,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radiuses } from '../../../../constants/Colors';
import { useRouter } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768; // Basic threshold for tablet dimensions
const BackendURL = "http://192.168.4.34:5000";

const ProfileViewScreen = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchUserProfile();
      return () => {}; // cleanup function
    }, [])
  );

  // app/main/tabs/profile/index.tsx
// In the fetchUserProfile function, add a fallback for API failures:

const fetchUserProfile = async () => {
  try {
    setLoading(true);
    setError(null);
    
    // Get the JWT token from secure storage
    const token = await SecureStore.getItemAsync('userToken');
    
    if (!token) {
      // Use mock data if no token is found
      setUserData(getMockUserData());
      setLoading(false);
      return;
    }

    try {
      // Make API request with the token
      const response = await axios.get(`${BackendURL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUserData(response.data);
    } catch (apiError) {
      console.error('Error fetching profile:', apiError);
      // Use mock data if API fails
      setUserData(getMockUserData());
    }
    
    setLoading(false);
  } catch (error) {
    console.error('Error in profile fetch process:', error);
    setUserData(getMockUserData());
    setLoading(false);
  }
};

// Add this function to provide mock data
const getMockUserData = () => {
  return {
    name: 'John Doe',
    username: '@johndoe',
    profileImage: 'https://images.unsplash.com/photo-1521566652839-697aa473761a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc29ufGVufDB8fDB8fHww',
    bio: 'Software developer and tech enthusiast'
  };
};


  const handleLogout = async () => {
    try {
      // Clear the stored token
      await SecureStore.deleteItemAsync('userToken');
      
      // Redirect to login screen
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to log out properly');
    }
  };

  const handleEditProfile = () => {
    // Navigate to update profile screen
    router.push('/main/tabs/profile/updateProfile');
  };

  const handleMenuItemPress = (item: string) => {
    switch (item) {
      case 'Settings':
        router.push('/main/tabs/profile/settings');
        break;
      case 'Chats':
        router.push('/main/tabs/chats');
        break;
      case 'Notifications':
        router.push('/main/tabs/profile/notifications');
        break;
      case 'Support':
        router.push('/main/tabs/profile/support');
        break;
      case 'Share':
        // Implement share functionality
        Alert.alert('Share', 'Share functionality will be implemented soon');
        break;
      case 'About us':
        router.push('/main/tabs/profile/about');
        break;
      case 'Logout':
        Alert.alert(
          'Logout',
          'Are you sure you want to log out?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', onPress: handleLogout, style: 'destructive' }
          ]
        );
        break;
      default:
        break;
    }
  };

  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // Use placeholder data if userData is not available
  const name = userData?.name || 'User Name';
  const username = userData?.username || '@username';
  const profileImage = userData?.profileImage || 'https://images.unsplash.com/photo-1521566652839-697aa473761a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc29ufGVufDB8fDB8fHww';
  const bio = userData?.bio || '';

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      <View style={styles.profileCard}>
        <Image
          source={{ uri: profileImage }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.username}>{username}</Text>
        {bio ? <Text style={styles.bio}>{bio}</Text> : null}
        <TouchableOpacity 
          style={styles.editButton}
          onPress={handleEditProfile}
          activeOpacity={0.8}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.menu}>
        <MenuItem 
          label="Settings" 
          iconName="settings" 
          onPress={() => handleMenuItemPress('Settings')}
        />
        <MenuItem 
          label="Chats" 
          iconName="chat" 
          onPress={() => handleMenuItemPress('Chats')}
        />
        <MenuItem 
          label="Notifications" 
          iconName="notifications" 
          onPress={() => handleMenuItemPress('Notifications')}
        />
        <MenuItem 
          label="Support" 
          iconName="support-agent" 
          onPress={() => handleMenuItemPress('Support')}
        />
        <MenuItem 
          label="Share" 
          iconName="share" 
          onPress={() => handleMenuItemPress('Share')}
        />
        <MenuItem 
          label="About us" 
          iconName="info" 
          onPress={() => handleMenuItemPress('About us')}
        />
        <MenuItem 
          label="Logout" 
          iconName="logout" 
          onPress={() => handleMenuItemPress('Logout')}
          isDestructive
        />
      </View>
    </ScrollView>
  );
};

const MenuItem = ({ label, iconName, onPress, isDestructive = false }) => (
  <TouchableOpacity 
    style={styles.menuItem} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <MaterialIcons 
      name={iconName} 
      size={24} 
      color={isDestructive ? Colors.error : Colors.textPrimary} 
      style={styles.menuIcon} 
    />
    <Text style={[
      styles.menuItemText, 
      isDestructive && { color: Colors.error }
    ]}>
      {label}
    </Text>
    <MaterialIcons 
      name="keyboard-arrow-right" 
      size={24} 
      color={isDestructive ? Colors.error : Colors.textSecondary} 
      style={styles.menuArrow} 
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  loadingText: {
    marginTop: Spacing.md,
    color: Colors.textSecondary,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  errorText: {
    marginTop: Spacing.md,
    color: Colors.error,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: Radiuses.small,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: 16,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginTop: Platform.OS === 'ios' ? 50 : 30,
    borderRadius: Radiuses.medium,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: Radiuses.small,
    elevation: 4,
    marginBottom: Spacing.md,
    alignSelf: 'center',
    width: width * 0.9,  // Responsive width
  },
  profileImage: {
    width: isTablet ? 200 : width * 0.4,  // Conditional size for tablet
    height: isTablet ? 200 : width * 0.4,
    borderRadius: isTablet ? 100 : width * 0.2,  // Fully circular
    marginBottom: Spacing.md,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  username: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  bio: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  editButton: {
    width: "80%",  // Responsive width
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: Spacing.md,
  },
  editButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: Fonts.regular,
  },
  menu: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radiuses.medium,
    marginHorizontal: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: Radiuses.small,
    elevation: 2,
    marginBottom: Spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemText: {
    flex: 1,
    fontSize: 18,
    fontFamily: Fonts.regular,
    color: Colors.textPrimary,
    paddingLeft: Spacing.md,
  },
  menuIcon: {
    marginRight: Spacing.sm,
  },
  menuArrow: {
    marginLeft: Spacing.sm,
  },
});

export default ProfileViewScreen;
