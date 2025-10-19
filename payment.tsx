import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.100.96:5000"; // backend URL
const defaultCarImage = require("../../assets/images/default.png");

export default function PaymentPage() {
  const router = useRouter();
  const { bookingId, car, carId, name, contact, startDate, endDate, totalPrice } =
    useLocalSearchParams();

  const carData = car ? JSON.parse(car as string) : null;

  const [discountType, setDiscountType] = useState("none");
  const [cash, setCash] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "gcash">("cash");

  const discountRate =
    discountType === "student" ? 0.2 : discountType === "senior" ? 0.3 : 0;
  const discountAmount = Number(totalPrice) * discountRate;
  const finalPrice = Number(totalPrice) - discountAmount;

  const safeName = Array.isArray(name) ? name[0] : name;
  const safeContact = Array.isArray(contact) ? contact[0] : contact;
  const safeStartDate = Array.isArray(startDate) ? startDate[0] : startDate;
  const safeEndDate = Array.isArray(endDate) ? endDate[0] : endDate;

  const submitPayment = async (method: "cash" | "gcash") => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Unauthorized. Please login.");

      let cashValue = 0;
      let change = 0;

      if (method === "cash") {
        if (!cash) {
          Alert.alert("Enter Cash Amount", "Please input your payment first.");
          setLoading(false);
          return;
        }

        const cashNum = Number(cash);
        if (cashNum < finalPrice) {
          Alert.alert(
            "Insufficient Amount",
            `You need ₱${finalPrice.toLocaleString()} but entered ₱${cashNum.toLocaleString()}`
          );
          setLoading(false);
          return;
        }
        cashValue = cashNum;
        change = cashNum - finalPrice;
      }

      if (method === "gcash") {
        const gcashRes = await fetch(`${BASE_URL}/create-gcash-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            amount: finalPrice,
            description: `Car Rental Payment for ${safeName}`,
            bookingId,
          }),
        });

        const gcashData = await gcashRes.json();
        if (!gcashRes.ok || !gcashData.checkout_url) {
          Alert.alert("GCash Payment Failed", gcashData.message || "Please try again.");
          setLoading(false);
          return;
        }

        // Open GCash checkout page
        Linking.openURL(gcashData.checkout_url);

        // Ask user to confirm after payment
        Alert.alert(
          "GCash Payment Started",
          "After completing payment in GCash, tap OK to record payment and view receipt.",
          [
            {
              text: "OK",
              onPress: async () => {
                try {
                  setLoading(true);
                  const recordRes = await fetch(`${BASE_URL}/payments`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({
                      booking_id: bookingId,
                      car_id: carId,
                      total_price: Number(totalPrice),
                      discount_type: discountType,
                      discount_amount: discountAmount,
                      final_price: finalPrice,
                      cash: 0,
                      change_amount: 0,
                      payment_method: "gcash",
                    }),
                  });

                  const recordData = await recordRes.json();
                  setLoading(false);
                  if (!recordRes.ok) {
                    Alert.alert("Payment Failed", recordData.message || "Please try again.");
                    return;
                  }

                  // Show receipt in-app
                  setShowReceipt(true);
                } catch (err: any) {
                  setLoading(false);
                  Alert.alert("Error", err.message || "Something went wrong.");
                }
              },
            },
          ]
        );

        setLoading(false);
        return;
      }

      // Record cash payment on backend
      const res = await fetch(`${BASE_URL}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          booking_id: bookingId,
          car_id: carId,
          total_price: Number(totalPrice),
          discount_type: discountType,
          discount_amount: discountAmount,
          final_price: finalPrice,
          cash: cashValue,
          change_amount: change,
          payment_method: method,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        Alert.alert("Payment Failed", data.message || "Please try again.");
        return;
      }

      setShowReceipt(true);
    } catch (err: any) {
      setLoading(false);
      console.error("💥 Payment Error:", err);
      Alert.alert("Error", err.message || "Something went wrong. Try again.");
    }
  };

  const handlePayNow = () => submitPayment(paymentMethod);
  const handleConfirm = () =>
    router.push(`/pages/booking-history?name=${encodeURIComponent(safeName)}`);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      {/* Car Card */}
      {carData && (
        <View style={styles.card}>
          <Image source={carData.image || defaultCarImage} style={styles.carImage} resizeMode="contain" />
          <Text style={styles.carName}>{carData.brand || carData.name}</Text>
          <Text style={styles.carPrice}>₱ {carData.price} / day</Text>
        </View>
      )}

      {/* Booking Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.sectionTitle}>Booking Summary</Text>
        <Text style={styles.summaryText}>Name: {safeName}</Text>
        <Text style={styles.summaryText}>Contact: {safeContact}</Text>
        <Text style={styles.summaryText}>
          Rental Period: {safeStartDate} → {safeEndDate}
        </Text>
        <Text style={styles.totalPrice}>Total: ₱ {totalPrice}</Text>
      </View>

      {/* Discount Selection */}
      <View style={styles.summaryCard}>
        <Text style={styles.sectionTitle}>Select Discount</Text>
        <View style={styles.discountButtons}>
          {["student", "senior", "none"].map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.discountButton, discountType === type && styles.discountActive]}
              onPress={() => setDiscountType(type)}
            >
              <Text style={[styles.discountText, discountType === type && styles.discountTextActive]}>
                {type === "student" ? "Student 20%" : type === "senior" ? "Senior 30%" : "None"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Payment Method */}
      <View style={styles.summaryCard}>
        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        <View style={styles.discountButtons}>
          {["cash", "gcash"].map((method) => (
            <TouchableOpacity
              key={method}
              style={[styles.discountButton, paymentMethod === method && styles.discountActive]}
              onPress={() => setPaymentMethod(method as "cash" | "gcash")}
            >
              <Text style={[styles.discountText, paymentMethod === method && styles.discountTextActive]}>
                {method.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Cash Input */}
      {paymentMethod === "cash" && (
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Enter Cash</Text>
          <TextInput
            style={styles.cashInput}
            placeholder="Enter amount"
            placeholderTextColor="#000"
            keyboardType="numeric"
            value={cash}
            onChangeText={setCash}
          />
        </View>
      )}

      {/* Pay Button */}
      <TouchableOpacity style={styles.payButton} onPress={handlePayNow} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.payButtonText}>Pay Now</Text>}
      </TouchableOpacity>

      {/* Receipt */}
      {showReceipt && (
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Receipt</Text>
          <Text style={styles.summaryText}>Payment Method: {paymentMethod.toUpperCase()}</Text>
          <Text style={styles.summaryText}>Original Price: ₱ {totalPrice}</Text>
          <Text style={styles.summaryText}>
            Discount: -₱ {discountAmount.toFixed(2)} ({discountType})
          </Text>
          <Text style={styles.summaryText}>Final Price: ₱ {finalPrice.toFixed(2)}</Text>
          {paymentMethod === "cash" && (
            <>
              <Text style={styles.summaryText}>Cash: ₱ {cash}</Text>
              <Text style={styles.totalPrice}>Change: ₱ {(Number(cash) - finalPrice).toFixed(2)}</Text>
            </>
          )}
          <TouchableOpacity style={[styles.payButton, { marginTop: 20 }]} onPress={handleConfirm}>
            <Text style={styles.payButtonText}>View Booking History</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

// Styles
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
    marginBottom: 20,
  },
  carImage: { width: 230, height: 130 },
  carName: { fontSize: 20, fontWeight: "700", color: "#1A1A1A", marginTop: 10 },
  carPrice: { fontSize: 16, color: "#4C6B61", marginTop: 4, fontWeight: "600" },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#1A1A1A", marginBottom: 10 },
  summaryText: { fontSize: 15, color: "#555", marginBottom: 5 },
  totalPrice: { fontSize: 18, fontWeight: "700", color: "#4C6B61", marginTop: 8 },
  discountButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  discountButton: { borderWidth: 1, borderColor: "#4C6B61", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 },
  discountActive: { backgroundColor: "#4C6B61" },
  discountText: { color: "#4C6B61", fontWeight: "600" },
  discountTextActive: { color: "#fff" },
  cashInput: { borderWidth: 1, borderColor: "#E5E5E5", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, backgroundColor: "#FAFAFA", color: "#000" },
  payButton: { backgroundColor: "#4C6B61", paddingVertical: 14, borderRadius: 12, alignItems: "center", marginBottom: 20 },
  payButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
