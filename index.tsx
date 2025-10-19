import React from "react";
import { View, Text, Image, TouchableOpacity, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import styles from '../../assets/css/indexStyle';

export default function HomePage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4C6B61" />

      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          Rent<Text style={styles.highlight}>Go</Text>
        </Text>
      </View>

      {/* Logo */}
      <Image
        source={require("../../assets/images/car-logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Welcome Text */}
      <Text style={styles.welcome}>Hello, Welcome!</Text>
      <Text style={styles.subtitle}>
        Affordable Rides, Endless Adventures.
      </Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.whiteButton]}
          onPress={() => router.push("/pages/login")}
        >
          <Text style={[styles.buttonText, styles.greenText]}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.whiteButton]}
          onPress={() => router.push("/pages/signup")}
        >
          <Text style={[styles.buttonText, styles.greenText]}>Signup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
