import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import loginStyle from "../../assets/css/loginStyle";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://192.168.100.96:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.token) {
        // Store JWT and user info
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));

        Alert.alert("Success", "Login successful");
        router.push("/pages/dashboard");
      } else {
        Alert.alert("Error", data.msg || "Login failed");
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
      Alert.alert("Error", "Cannot connect to server");
    }
  };

  return (
    <View style={loginStyle.container}>
      <View style={loginStyle.topSection} />

      <View style={loginStyle.logoWrapper}>
        <Image
          source={require("../../assets/images/car-logo.png")}
          style={loginStyle.logo}
          resizeMode="contain"
        />
      </View>

      <View style={loginStyle.content}>
        <Text style={loginStyle.title}>
          Rent<Text style={loginStyle.highlight}>Go</Text>
        </Text>

        <Text style={loginStyle.welcome}>Welcome Back!</Text>
        <Text style={loginStyle.subtitle}>Login to continue</Text>

        <Text style={loginStyle.label}>Email or username</Text>
        <TextInput
          style={loginStyle.input}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={loginStyle.label}>Enter your password</Text>
        <View style={loginStyle.passwordContainer}>
          <TextInput
            style={loginStyle.passwordInput}
            placeholder="Enter your password"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={loginStyle.eyeIcon}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#4C6B61"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/pages/forgetpassword")}
          style={loginStyle.forgotPassword}
        >
          <Text style={loginStyle.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={loginStyle.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={loginStyle.loginText}>Log In</Text>
          )}
        </TouchableOpacity>

        <View style={loginStyle.signupContainer}>
          <Text style={loginStyle.signupText}>Don’t have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/pages/signup")}>
            <Text style={loginStyle.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
