import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import BottomTabs from "../../components/bottomtabs";

const BASE_URL = "http://192.168.100.96:5000";

export default function BookingsHistory() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState<{ [key: string]: string }>({});
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fetch all cars and map by name
  const fetchCars = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/cars`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const carMap: { [key: string]: string } = {};
        data.forEach((car: any) => {
          if (car.image) carMap[car.brand] = car.image; // map brand to image URL
        });
        setCars(carMap);
      }
    } catch (error) {
      console.error("❌ Fetch Cars Error:", error);
    }
  }, []);

  // Fetch booking history
  const fetchBookingHistory = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Unauthorized", "Please log in first.");
        router.push("/pages/login");
        return;
      }

      const res = await fetch(`${BASE_URL}/booking-history`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok && data?.bookings) setBookings(data.bookings);
      else setBookings([]);
    } catch (error) {
      console.error("❌ Fetch Booking History Error:", error);
      Alert.alert("Error", "Unable to fetch bookings.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchCars();
    fetchBookingHistory();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, fetchBookingHistory, fetchCars]);

  // Format date to local PH
  const formatLocalDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const localDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  };

  // Cancel Booking
  const handleCancelBooking = (id: string) => {
    Alert.alert("Cancel Booking", "Are you sure you want to cancel?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/cancel-booking/${id}`, {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
              Alert.alert("✅ Success", data.message);
              fetchBookingHistory();
            } else Alert.alert("❌ Failed", data.message);
          } catch (error) {
            Alert.alert("Error", "Failed to cancel booking.");
          }
        },
      },
    ]);
  };

  // Remove Booking
  const handleRemoveBooking = async (id: string) => {
    Alert.alert("Remove Booking", "Remove this booking permanently?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/delete-booking/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
              Alert.alert("✅ Success", data.message);
              fetchBookingHistory();
            } else Alert.alert("❌ Failed", data.message);
          } catch (error) {
            Alert.alert("Error", "Something went wrong while deleting.");
          }
        },
      },
    ]);
  };

  // Reschedule
  const handleReschedule = (booking: any) => {
    router.push({
      pathname: "/pages/reschedule",
      params: { bookingId: booking.booking_id.toString() },
    });
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F9FAFB",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#2F4F4F" />
        <Text style={{ color: "#555", marginTop: 10 }}>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 20,
          paddingVertical: 15,
          backgroundColor: "#F9FAFB",
          zIndex: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
          opacity: fadeAnim,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 6,
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "700", color: "#2F4F4F" }}>
          Booking History
        </Text>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 120, paddingTop: 70 }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {bookings.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 100 }}>
            <Ionicons name="car-outline" size={64} color="#9CA3AF" />
            <Text style={{ fontSize: 16, color: "#6B7280", marginTop: 10 }}>
              No bookings found
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/pages/car-category")}
              style={{
                backgroundColor: "#2F4F4F",
                paddingHorizontal: 25,
                paddingVertical: 10,
                borderRadius: 10,
                marginTop: 20,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
                Browse Cars
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          bookings.map((item, index) => {
            const carImage = cars[item.car_name]; // dynamic image URL
            const today = new Date().toISOString().split("T")[0];
            const bookingStatus =
              item.status || (item.end_date.split("T")[0] > today ? "Upcoming" : "Completed");
            const isCancelled = bookingStatus === "Cancelled";

            const slideIn = scrollY.interpolate({
              inputRange: [0, 100 * (index + 1)],
              outputRange: [30, 0],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={index}
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideIn }],
                  backgroundColor: "#fff",
                  borderRadius: 18,
                  marginBottom: 18,
                  padding: 15,
                  shadowColor: "#000",
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {carImage && (
                    <Image
                      source={{ uri: carImage }}
                      style={{
                        width: 90,
                        height: 60,
                        borderRadius: 12,
                        resizeMode: "contain",
                        marginRight: 15,
                      }}
                    />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 17, fontWeight: "600", color: "#1E293B" }}>
                      {item.car_name}
                    </Text>
                    <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 3 }}>
                      {formatLocalDate(item.start_date)} → {formatLocalDate(item.end_date)}
                    </Text>
                    <View
                      style={{
                        alignSelf: "flex-start",
                        backgroundColor:
                          bookingStatus === "Booked"
                            ? "#DBEAFE"
                            : bookingStatus === "Completed"
                            ? "#DCFCE7"
                            : "#FEE2E2",
                        borderRadius: 20,
                        paddingHorizontal: 10,
                        paddingVertical: 3,
                        marginTop: 6,
                      }}
                    >
                      <Text
                        style={{
                          color:
                            bookingStatus === "Booked"
                              ? "#1D4ED8"
                              : bookingStatus === "Completed"
                              ? "#15803D"
                              : "#DC2626",
                          fontWeight: "600",
                          fontSize: 12,
                        }}
                      >
                        {bookingStatus}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    marginTop: 10,
                    borderTopWidth: 1,
                    borderColor: "#E5E7EB",
                    paddingTop: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "700", color: "#111" }}>
                    ₱ {item.final_price || item.total_price}
                  </Text>

                  {!isCancelled ? (
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#2F4F4F",
                          borderRadius: 8,
                          paddingVertical: 6,
                          paddingHorizontal: 12,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                        onPress={() => handleCancelBooking(item.booking_id.toString())}
                      >
                        <Ionicons name="close" size={14} color="#fff" />
                        <Text style={{ color: "#fff", fontWeight: "600", marginLeft: 4 }}>
                          Cancel
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{
                          backgroundColor: "#2F4F4F",
                          borderRadius: 8,
                          paddingVertical: 6,
                          paddingHorizontal: 12,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                        onPress={() => handleReschedule(item)}
                      >
                        <Ionicons name="create" size={14} color="#fff" />
                        <Text style={{ color: "#fff", fontWeight: "600", marginLeft: 4 }}>
                          Reschedule
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#6B7280",
                        borderRadius: 8,
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                      onPress={() => handleRemoveBooking(item.booking_id.toString())}
                    >
                      <Ionicons name="trash" size={14} color="#fff" />
                      <Text style={{ color: "#fff", fontWeight: "600", marginLeft: 4 }}>
                        Remove
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Animated.View>
            );
          })
        )}
      </Animated.ScrollView>

      <BottomTabs scrollY={scrollY} />
    </View>
  );
}
