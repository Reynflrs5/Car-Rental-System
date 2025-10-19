import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StyleSheet,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

const BASE_URL = "http://192.168.100.96:5000";

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    image: null as string | null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for profile image
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  // Pick image from gallery
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setUser({ ...user, image: result.assets[0].uri });
    }
  };

  // Take photo using camera
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setUser({ ...user, image: result.assets[0].uri });
    }
  };

  // Remove profile image via backend without token
  const removeProfileImage = async () => {
    Alert.alert(
      "Remove Profile Image",
      "Are you sure you want to remove your profile image?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              const storedUser = await AsyncStorage.getItem("user");
              if (!storedUser) return Alert.alert("Error", "User not found");

              const { id } = JSON.parse(storedUser);

              const response = await fetch(`${BASE_URL}/profile/avatar`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: id }),
              });

              const data = await response.json();

              if (response.ok) {
                setUser({ ...user, image: null });
                const updatedUser = { ...JSON.parse(storedUser), image: null };
                await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
                Alert.alert("Success", "Profile image removed successfully");
              } else {
                Alert.alert("Error", data.msg || "Failed to remove profile image");
              }
            } catch (err) {
              console.log(err);
              Alert.alert("Error", "Cannot connect to server");
            }
          },
        },
      ]
    );
  };

  // Fetch user from backend
  const fetchUser = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.push("/pages/login");
        return;
      }

      const response = await fetch(`${BASE_URL}/profile`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        const imageUrl = data.user.image
          ? data.user.image.startsWith("http")
            ? data.user.image
            : `${BASE_URL}/${data.user.image}`
          : null;
        const updatedUser = { ...data.user, image: imageUrl };
        setUser(updatedUser);
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        Alert.alert("Error", data.msg || "Failed to fetch profile");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Cannot connect to server");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Save profile changes
  const handleSave = async () => {
    setSaving(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.push("/pages/login");
        return;
      }

      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("phone", user.phone);

      if (user.image && !user.image.startsWith("http")) {
        const uriParts = user.image.split(".");
        const fileType = uriParts[uriParts.length - 1];
        formData.append("image", {
          uri: user.image,
          name: `profile.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      const response = await fetch(`${BASE_URL}/profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const updatedImage = data.user.image
          ? data.user.image.startsWith("http")
            ? data.user.image
            : `${BASE_URL}/${data.user.image}`
          : user.image;

        const updatedUser = { ...data.user, image: updatedImage };
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        Alert.alert("Success", "Profile updated successfully!");
        router.push("/pages/profile");
      } else {
        Alert.alert("Error", data.msg || "Failed to update profile");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Cannot connect to server");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4C6B61" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F8FAFB" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <Animated.View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
      >
        <View style={{ height: 90 }} />

        {/* Profile Image */}
        <View style={styles.profileHeader}>
          <Animated.View style={[styles.profileImageWrapper, { transform: [{ scale: pulseAnim }] }]}>
            <TouchableOpacity
              onPress={() =>
                Alert.alert("Change Profile Picture", "Choose an option", [
                  { text: "Camera", onPress: takePhoto },
                  { text: "Gallery", onPress: pickImage },
                  { text: "Remove", onPress: removeProfileImage, style: "destructive" },
                  { text: "Cancel", style: "cancel" },
                ])
              }
            >
              <View style={styles.profileBorder}>
                <Image
                  source={
                    user.image
                      ? { uri: user.image }
                      : require("../../assets/images/profile-icon.png")
                  }
                  style={styles.profileImage}
                />
                <View style={styles.editIcon}>
                  <Ionicons name="camera" size={20} color="#fff" />
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
          <Text style={styles.userName}>{user.name || ""}</Text>
        </View>

        {/* Profile Inputs */}
        <View style={styles.profileCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="person-outline" size={20} color="#777" style={styles.inputIcon} />
              <TextInput
                value={user.name}
                onChangeText={(text) => setUser({ ...user, name: text })}
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="mail-outline" size={20} color="#777" style={styles.inputIcon} />
              <TextInput
                value={user.email}
                onChangeText={(text) => setUser({ ...user, email: text })}
                style={styles.input}
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="call-outline" size={20} color="#777" style={styles.inputIcon} />
              <TextInput
                value={user.phone}
                onChangeText={(text) => setUser({ ...user, phone: text })}
                style={styles.input}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
            <Text style={styles.saveButtonText}>{saving ? "Saving..." : "Save Changes"}</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F8FAFB" },
  scrollContainer: { padding: 20, paddingBottom: 100 },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    backgroundColor: "#F8FAFB",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
    position: "absolute",
    top: 0,
    zIndex: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#333", textAlign: "center" },
  backButton: { position: "absolute", left: 15, height: "100%", justifyContent: "center" },
  profileHeader: { alignItems: "center", marginBottom: 30 },
  profileImageWrapper: { alignItems: "center", justifyContent: "center", marginBottom: 10 },
  profileBorder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: "#4C6B61",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  editIcon: { position: "absolute", bottom: 0, right: 0, backgroundColor: "#4C6B61", borderRadius: 12, padding: 4 },
  userName: { fontSize: 20, fontWeight: "600", color: "#4C6B61", marginTop: 5 },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, color: "#777", marginBottom: 5 },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F7FAFC",
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 16, color: "#333", paddingVertical: 12 },
  saveButton: {
    backgroundColor: "#4C6B61",
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
