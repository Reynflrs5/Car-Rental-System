import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import signupStyle from "../../assets/css/signupStyle";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !email || !phone || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://192.168.100.96:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, phone, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        Alert.alert("Success", data.msg);
        router.push("/pages/login");
      } else {
        Alert.alert("Error", data.msg || "Signup failed");
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
      Alert.alert("Error", "Cannot connect to server");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor: "#fff" }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Section */}
        <View style={signupStyle.topSection} />

        {/* Logo */}
        <View style={signupStyle.logoWrapper}>
          <Image
            source={require("../../assets/images/car-logo.png")}
            style={signupStyle.logo}
            resizeMode="contain"
          />
        </View>

        {/* Content */}
        <View style={signupStyle.content}>
          <Text style={signupStyle.title}>
            Rent<Text style={signupStyle.highlight}>Go</Text>
          </Text>
          <Text style={signupStyle.welcome}>Create Account</Text>
          <Text style={signupStyle.subtitle}>Sign up to get started</Text>

          {/* Form */}
          <Text style={signupStyle.label}>Full Name</Text>
          <TextInput
            style={signupStyle.input}
            placeholder="Enter your full name"
            placeholderTextColor="#999"
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={signupStyle.label}>Email</Text>
          <TextInput
            style={signupStyle.input}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={signupStyle.label}>Phone Number</Text>
          <TextInput
            style={signupStyle.input}
            placeholder="Enter your phone number"
            placeholderTextColor="#999"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={signupStyle.label}>Password</Text>
          <View style={signupStyle.passwordContainer}>
            <TextInput
              style={signupStyle.passwordInput}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={signupStyle.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#4C6B61"
              />
            </TouchableOpacity>
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            style={signupStyle.signupButton}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={signupStyle.signupText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Already have account */}
          <View style={signupStyle.loginContainer}>
            <Text style={signupStyle.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/pages/login")}>
              <Text style={signupStyle.loginLink}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
