import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import forgetpasswordStyle from "../../assets/css/forgetpasswordStyle";

export default function EnterCode() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = params.email;

  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState(false);

  if (!email) {
    Alert.alert("Error", "Email not provided.");
    router.push("/pages/forgetpassword");
    return null;
  }

  const handleVerify = async () => {
    if (!code) {
      Alert.alert("Error", "Please enter the verification code.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://192.168.100.96:5000/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        Alert.alert("Success", data.msg);
        router.push(
          `/pages/enternewpassword?email=${encodeURIComponent(
            email
          )}&code=${encodeURIComponent(code)}`
        );
      } else {
        Alert.alert("Error", data.msg || "Invalid code");
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={forgetpasswordStyle.container}
          keyboardShouldPersistTaps="handled"
        >
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
              Enter the verification code sent to your email
            </Text>

            <Text style={forgetpasswordStyle.label}>Verification Code</Text>
            <TextInput
              style={forgetpasswordStyle.input}
              placeholder="Enter 6-digit code"
              placeholderTextColor="#999"
              value={code}
              onChangeText={setCode}
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />

            <TouchableOpacity
              style={forgetpasswordStyle.continueButton}
              onPress={handleVerify}
              disabled={loading}
            >
              <Text style={forgetpasswordStyle.continueButtonText}>
                {loading ? "Verifying..." : "Verify"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={forgetpasswordStyle.backButton}
              onPress={() => router.back()}
            >
              <Text style={forgetpasswordStyle.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
