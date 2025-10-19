import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import forgetpasswordStyle from "../../assets/css/forgetpasswordStyle";

export default function EnterNewPassword() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; code?: string }>();
  const email = params.email;
  const code = params.code;

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  if (!email || !code) {
    Alert.alert("Error", "Missing email or verification code.");
    router.push("/pages/forgetpassword");
    return null;
  }

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://192.168.100.96:5000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        Alert.alert("Success", data.msg);
        router.push("/pages/login");
      } else {
        Alert.alert("Error", data.msg || "Failed to reset password");
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
      Alert.alert("Error", "Cannot connect to server");
    }
  };

  return (
    <View style={forgetpasswordStyle.container}>
      <View style={forgetpasswordStyle.topSection} />
      <View style={forgetpasswordStyle.logoWrapper}>
        <Image
          source={require("../../assets/images/car-logo.png")}
          style={forgetpasswordStyle.logo}
          resizeMode="contain"
        />
      </View>
      <View style={forgetpasswordStyle.content}>
        <Text style={forgetpasswordStyle.title}>
          Rent<Text style={forgetpasswordStyle.highlight}>Go</Text>
        </Text>
        <Text style={forgetpasswordStyle.subtitle}>
          Enter your new password
        </Text>

        <Text style={forgetpasswordStyle.label}>New Password</Text>
        <TextInput
          style={forgetpasswordStyle.input}
          placeholder="Enter new password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={forgetpasswordStyle.label}>Confirm Password</Text>
        <TextInput
          style={forgetpasswordStyle.input}
          placeholder="Confirm new password"
          placeholderTextColor="#999"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={forgetpasswordStyle.continueButton}
          onPress={handleReset}
          disabled={loading}
        >
          <Text style={forgetpasswordStyle.continueButtonText}>
            {loading ? "Resetting..." : "Reset Password"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={forgetpasswordStyle.backButton} onPress={() => router.back()}>
          <Text style={forgetpasswordStyle.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
