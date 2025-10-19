import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import forgetpasswordStyle from "../../assets/css/forgetpasswordStyle";

export default function ForgetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://192.168.100.96:5000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        Alert.alert("Success", data.msg);
        // ✅ Pass email using query string instead of params
        router.push(`/pages/entercode?email=${encodeURIComponent(email)}`);
      } else {
        Alert.alert("Error", data.msg || "Failed to send code");
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
          Enter your email to receive a verification code
        </Text>

        <Text style={forgetpasswordStyle.label}>Email</Text>
        <TextInput
          style={forgetpasswordStyle.input}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TouchableOpacity
          style={forgetpasswordStyle.continueButton}
          onPress={handleContinue}
          disabled={loading}
        >
          <Text style={forgetpasswordStyle.continueButtonText}>
            {loading ? "Sending..." : "Continue"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={forgetpasswordStyle.backButton} onPress={() => router.back()}>
          <Text style={forgetpasswordStyle.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
