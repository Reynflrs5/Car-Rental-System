import React, { useEffect, useState, useRef } from "react";
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
import BottomTabs from "../../components/bottomtabs";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    image: "",
    verified: false,
  });
  const [loading, setLoading] = useState(true);

  const scrollY = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation
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

  // Fetch user profile
  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.push("/pages/login");
        return;
      }

      const response = await fetch("http://192.168.100.96:5000/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        const userData = {
          name: data.user?.name ?? "",
          email: data.user?.email ?? "",
          phone: data.user?.phone ?? "",
          image: data.user?.image ?? "",
          verified: !!data.user?.verified,
        };
        setUser(userData);
        await AsyncStorage.setItem("user", JSON.stringify(userData));
      } else {
        Alert.alert("Error", data.msg ?? "Failed to fetch profile");
        if (data.msg === "Invalid token" || data.msg === "No token provided") {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("user");
          router.push("/pages/login");
        }
      }
    } catch (err) {
      console.log("Fetch error:", err);
      Alert.alert("Error", "Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("user");
          router.push("/pages/login");
        },
      },
    ]);
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
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          {
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, -5],
                  extrapolate: "clamp",
                }),
              },
            ],
            opacity: scrollY.interpolate({
              inputRange: [0, 50],
              outputRange: [1, 0.95],
              extrapolate: "clamp",
            }),
          },
        ]}
      >
        <Text style={styles.headerTitle}>Profile</Text>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={{ height: 80 }} />

        {/* Profile Image */}
        <View style={styles.profileHeader}>
          <Animated.View
            style={[
              styles.profileImageWrapper,
              { transform: [{ scale: pulseAnim }] },
            ]}
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
              {/* Verified Badge */}
              {user.verified ? (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={28} color="#1877F2" />
                </View>
              ) : null}
            </View>
          </Animated.View>
          <Text style={styles.userName}>{user.name ?? ""}</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#777"
                style={styles.inputIcon}
              />
              <TextInput
                value={user.name ?? ""}
                style={styles.input}
                editable={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#777"
                style={styles.inputIcon}
              />
              <TextInput
                value={user.email ?? ""}
                style={styles.input}
                editable={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons
                name="call-outline"
                size={20}
                color="#777"
                style={styles.inputIcon}
              />
              <TextInput
                value={user.phone ?? ""}
                style={styles.input}
                editable={false}
              />
            </View>
          </View>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push("/pages/edit-profile")}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </Animated.ScrollView>

      <BottomTabs scrollY={scrollY} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFB" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFB",
  },
  scrollContainer: { padding: 20, paddingBottom: 80 },
  header: {
    width: "100%",
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
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#333" },
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
  verifiedBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    elevation: 3,
  },
  userName: { fontSize: 20, fontWeight: "600", color: "#4C6B61", marginTop: 8 },
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
  editButton: {
    backgroundColor: "#4C6B61",
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
  },
  editButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  logoutButton: { backgroundColor: "#FF6B6B", paddingVertical: 15, borderRadius: 12, alignItems: "center" },
  logoutButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
