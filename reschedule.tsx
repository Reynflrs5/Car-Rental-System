import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  Image,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

const BASE_URL = "http://192.168.100.96:5000";

const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function Rescheduling() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState<{ [key: string]: string }>({});
  const [newStartDate, setNewStartDate] = useState(new Date());
  const [newEndDate, setNewEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch all cars for dynamic images
  const fetchCars = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/cars`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const carMap: { [key: string]: string } = {};
        data.forEach((car: any) => {
          if (car.image) carMap[car.brand] = car.image;
        });
        setCars(carMap);
      }
    } catch (err) {
      console.error("❌ Fetch cars error:", err);
    }
  }, []);

  // Fetch specific booking
  const fetchBooking = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "You are not logged in.");
        router.push("/");
        return;
      }

      const res = await fetch(`${BASE_URL}/booking-history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const foundBooking = data.bookings.find(
        (b: any) => b.booking_id.toString() === bookingId?.toString()
      );

      if (!foundBooking) {
        Alert.alert("Error", "Booking not found.");
        router.back();
        return;
      }

      setBooking(foundBooking);
      setNewStartDate(new Date(foundBooking.start_date));
      setNewEndDate(new Date(foundBooking.end_date));
      setReason(foundBooking.reason || "");
    } catch (err) {
      console.error("❌ Booking fetch error:", err);
      Alert.alert("Error", "Failed to fetch booking details.");
      router.back();
    } finally {
      setLoading(false);
    }
  }, [bookingId, router]);

  useEffect(() => {
    fetchCars();
    if (bookingId) fetchBooking();
  }, [bookingId, fetchBooking, fetchCars]);

  const handleReschedule = () => {
    Alert.alert(
      "Confirm Reschedule",
      "Are you sure you want to reschedule this booking?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            const originalStart = new Date(booking.start_date);
            const originalEnd = new Date(booking.end_date);

            const originalDuration =
              Math.ceil((originalEnd.getTime() - originalStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

            const newDuration =
              Math.ceil((newEndDate.getTime() - newStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

            if (newEndDate < newStartDate) {
              Alert.alert("Invalid Dates", "End date must be after start date.");
              return;
            }

            if (newDuration !== originalDuration) {
              Alert.alert(
                "Invalid Reschedule",
                `The rescheduled booking must be exactly ${originalDuration} day(s).`
              );
              return;
            }

            setSubmitting(true);

            try {
              const token = await AsyncStorage.getItem("token");
              const res = await fetch(`${BASE_URL}/bookings/${booking.booking_id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  start_date: formatLocalDate(newStartDate),
                  end_date: formatLocalDate(newEndDate),
                  reason,
                }),
              });

              const data = await res.json();

              if (res.ok) {
                Alert.alert(
                  "Success",
                  "Booking rescheduled successfully. An email with your updated booking details has been sent."
                );
                router.push("/pages/booking-history");
              } else {
                Alert.alert("Error", data.message || "Failed to reschedule booking.");
              }
            } catch (err) {
              console.error("❌ Reschedule error:", err);
              Alert.alert("Error", "Server error while rescheduling.");
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  if (loading || !booking) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#2F4F4F" />
        <Text style={{ marginTop: 10 }}>Loading booking...</Text>
      </View>
    );
  }

  const carImage = cars[booking.car_name] || null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2F4F4F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reschedule Booking</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Car Card */}
      <View style={styles.card}>
        {carImage && <Image source={{ uri: carImage }} style={styles.carImage} />}
        <Text style={styles.carName}>{booking.car_name}</Text>
        <Text style={styles.carPrice}>₱ {booking.total_price}</Text>
        <View style={styles.dateRow}>
          <Text style={styles.label}>Current Schedule:</Text>
          <Text style={styles.value}>
            {formatLocalDate(new Date(booking.start_date))} → {formatLocalDate(new Date(booking.end_date))}
          </Text>
        </View>
      </View>

      {/* New Dates */}
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Select New Dates</Text>

        <Text style={styles.label}>New Start Date</Text>
        <TouchableOpacity style={styles.datePicker} onPress={() => setShowStartPicker(true)}>
          <Ionicons name="calendar-outline" size={20} color="#2F4F4F" />
          <Text style={styles.dateText}>{formatLocalDate(newStartDate)}</Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={newStartDate}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "spinner"}
            onChange={(e, d) => {
              setShowStartPicker(false);
              if (d) setNewStartDate(d);
            }}
          />
        )}

        <Text style={[styles.label, { marginTop: 15 }]}>New End Date</Text>
        <TouchableOpacity style={styles.datePicker} onPress={() => setShowEndPicker(true)}>
          <Ionicons name="calendar-outline" size={20} color="#2F4F4F" />
          <Text style={styles.dateText}>{formatLocalDate(newEndDate)}</Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={newEndDate}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "spinner"}
            onChange={(e, d) => {
              setShowEndPicker(false);
              if (d) setNewEndDate(d);
            }}
          />
        )}
      </View>

      {/* Reason */}
      <View style={styles.notesBox}>
        <Text style={styles.label}>Reason for Rescheduling (Optional)</Text>
        <TextInput
          placeholder="Write your reason here..."
          placeholderTextColor="#999"
          style={styles.textArea}
          multiline
          value={reason}
          onChangeText={setReason}
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => router.push("/pages/booking-history")}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.confirmButton]}
          onPress={handleReschedule}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[styles.buttonText, { color: "#fff" }]}>Confirm</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#fdfdfd", padding: 20, paddingBottom: 60 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 25 },
  backButton: { padding: 6, borderRadius: 10, backgroundColor: "#f1f1f1" },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#2F4F4F" },
  card: { backgroundColor: "#fff", borderRadius: 15, padding: 20, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, elevation: 4, marginBottom: 25 },
  carImage: { width: 200, height: 100, resizeMode: "contain" },
  carName: { fontSize: 20, fontWeight: "700", color: "#111", marginTop: 12 },
  carPrice: { fontSize: 16, color: "#2F4F4F", marginTop: 5 },
  dateRow: { marginTop: 12, alignItems: "center" },
  label: { fontSize: 14, color: "#666", marginBottom: 5, fontWeight: "500" },
  value: { fontSize: 15, fontWeight: "600", color: "#333" },
  form: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#2F4F4F", marginBottom: 15 },
  datePicker: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 12, padding: 12, backgroundColor: "#f4f6f8" },
  dateText: { marginLeft: 10, color: "#111", fontSize: 15 },
  notesBox: { marginBottom: 30 },
  textArea: { borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 12, padding: 12, minHeight: 100, textAlignVertical: "top", color: "#111", backgroundColor: "#f9fafb" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  button: { flex: 1, padding: 15, borderRadius: 12, alignItems: "center" },
  cancelButton: { backgroundColor: "#f1f1f1", marginRight: 12 },
  confirmButton: { backgroundColor: "#2F4F4F", marginLeft: 12 },
  buttonText: { fontSize: 16, fontWeight: "600", color: "#333" },
});
