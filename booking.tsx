import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.100.96:5000";
const defaultCarImage = require("../../assets/images/default.png");

export default function BookingPage() {
  const router = useRouter();
  const { car } = useLocalSearchParams();
  const carData = car ? JSON.parse(car as string) : null;

  const [contact, setContact] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const calculateTotalPrice = () => {
    if (!carData?.price || !startDate || !endDate) return 0;
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;
    return days * carData.price;
  };

  const handleConfirmBooking = async () => {
    if (!contact || !startDate || !endDate) {
      Alert.alert("Missing Information", "Please fill out all fields.");
      return;
    }

    const totalPrice = calculateTotalPrice();
    if (totalPrice <= 0) {
      Alert.alert("Invalid Dates", "Please check your start and end dates.");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Not Logged In", "Please log in first.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          car_id: carData?.car_id || carData?.id,
          car_name: carData?.brand || carData?.name,
          contact,
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
          total_price: totalPrice,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        const bookingId = data.bookingId;
        const updatedCarData = { ...carData, image: carData.image || defaultCarImage };

        Alert.alert(
          "Booking Confirmed ✅",
          `Car: ${carData?.brand}\n₱${carData?.price}/day\n\nFrom: ${startDate
            .toISOString()
            .split("T")[0]} to ${endDate.toISOString().split("T")[0]}\nTotal: ₱${totalPrice}`,
          [
            {
              text: "OK",
              onPress: () =>
                router.push({
                  pathname: "/pages/payment",
                  params: {
                    bookingId,
                    car: JSON.stringify(updatedCarData),
                    carId: carData?.car_id,
                    contact,
                    startDate: startDate.toISOString().split("T")[0],
                    endDate: endDate.toISOString().split("T")[0],
                    totalPrice,
                  },
                }),
            },
          ]
        );
      } else {
        Alert.alert("Booking Failed", data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("❌ Booking error:", error);
      setLoading(false);
      Alert.alert("Error", "Failed to connect to server");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking</Text>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressStep, { backgroundColor: "#4C6B61" }]} />
        <View style={styles.progressStep} />
      </View>
      <Text style={styles.progressText}>Step 1 of 2 - Booking Details</Text>

      {/* Car Card */}
      {carData && (
        <View style={styles.card}>
          <Image
            source={carData.image || defaultCarImage}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.carName}>{carData.brand}</Text>
          <Text style={styles.carPrice}>₱ {carData.price} / day</Text>
          <Text style={styles.carCategoryTag}>{carData?.category || "Sedan"}</Text>
          <Text style={styles.noteText}>
            ⚡ Hurry! Limited cars available for your selected dates.
          </Text>
        </View>
      )}

      {/* Booking Form */}
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Booking Details</Text>

        <View style={styles.inputRow}>
          <Ionicons name="call-outline" size={20} color="#555" />
          <TextInput
            style={styles.input}
            placeholder="Contact Number"
            placeholderTextColor="#777"
            keyboardType="phone-pad"
            value={contact}
            onChangeText={setContact}
          />
        </View>

        <TouchableOpacity style={styles.dateInput} onPress={() => setShowStartPicker(true)}>
          <Ionicons name="calendar-outline" size={20} color="#555" />
          <Text style={{ color: startDate ? "#000" : "#777", marginLeft: 8 }}>
            {startDate ? `Start Date: ${startDate.toISOString().split("T")[0]}` : "Select Start Date"}
          </Text>
        </TouchableOpacity>

        {showStartPicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, date) => {
              setShowStartPicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}

        <TouchableOpacity style={styles.dateInput} onPress={() => setShowEndPicker(true)}>
          <Ionicons name="calendar-outline" size={20} color="#555" />
          <Text style={{ color: endDate ? "#000" : "#777", marginLeft: 8 }}>
            {endDate ? `End Date: ${endDate.toISOString().split("T")[0]}` : "Select End Date"}
          </Text>
        </TouchableOpacity>

        {showEndPicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, date) => {
              setShowEndPicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}
      </View>

      {startDate && endDate && (
        <View style={styles.bottomContainer}>
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₱ {calculateTotalPrice().toLocaleString()}</Text>
          </View>

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4C6B61" />
          <Text style={{ color: "#4C6B61", marginTop: 10 }}>Processing...</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4C6B61",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  headerTitle: { color: "#fff", fontWeight: "700", fontSize: 18, marginLeft: 10 },
  progressContainer: { flexDirection: "row", justifyContent: "center", gap: 6, marginBottom: 10 },
  progressStep: { width: 35, height: 6, borderRadius: 4, backgroundColor: "#D3E5DF" },
  progressText: { textAlign: "center", color: "#555", fontSize: 13, marginBottom: 15 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#4C6B61",
    shadowOpacity: 0.25,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    marginBottom: 25,
  },
  image: { width: 230, height: 130 },
  carName: { fontSize: 20, fontWeight: "700", color: "#1A1A1A", marginTop: 10 },
  carPrice: { fontSize: 16, color: "#4C6B61", marginTop: 4, fontWeight: "600" },
  carCategoryTag: { marginTop: 6, backgroundColor: "#E9F6F2", color: "#4C6B61", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, fontSize: 13, fontWeight: "600" },
  noteText: { color: "#777", fontSize: 13, textAlign: "center", marginTop: 8 },
  form: { backgroundColor: "#fff", borderRadius: 18, padding: 20, shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 5, elevation: 3, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#1A1A1A", marginBottom: 15 },
  inputRow: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E5E5E5", borderRadius: 12, paddingHorizontal: 12, marginBottom: 12, backgroundColor: "#FAFAFA" },
  input: { flex: 1, padding: 10, fontSize: 15 },
  dateInput: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E5E5E5", borderRadius: 12, padding: 14, marginBottom: 12, backgroundColor: "#FAFAFA" },
  bottomContainer: { backgroundColor: "#fff", borderRadius: 18, padding: 20, shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 5, elevation: 3, marginTop: 10, marginBottom: 40 },
  totalBox: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  totalLabel: { fontSize: 16, fontWeight: "600", color: "#555" },
  totalValue: { fontSize: 18, fontWeight: "700", color: "#4C6B61" },
  confirmButton: { backgroundColor: "#4C6B61", paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  confirmButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  loadingOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(255,255,255,0.85)", justifyContent: "center", alignItems: "center", zIndex: 10 },
});
