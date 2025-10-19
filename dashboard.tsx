import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Animated,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomTabs from "../../components/bottomtabs";

const defaultCarImage = require("../../assets/images/default.png");
const { width } = Dimensions.get("window");

export default function Dashboard() {
  const router = useRouter();
  const [cars, setCars] = useState<any[]>([]);
  const [filteredCars, setFilteredCars] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const adScale = useRef(new Animated.Value(0)).current;
  const [user, setUser] = useState<any>(null);
  const adRef = useRef<FlatList>(null);
  const [currentAd, setCurrentAd] = useState(0);

  const BASE_URL = "http://192.168.100.96:5000";

  // ---------------- Load User ----------------
  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) setUser(JSON.parse(userData));
    } catch (error) {
      console.log("Failed to load user", error);
    }
  };

  // ---------------- Fetch Cars ----------------
  const fetchCars = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/cars`);
      const data = await res.json();

      // Map images dynamically from backend (fallback to default)
      const carsWithImages = data.map((car: any) => ({
        ...car,
        image: car.image ? { uri: car.image } : defaultCarImage,
        status: (car.status || "available").toLowerCase().trim(),
      }));

      setCars(carsWithImages);
      setFilteredCars(carsWithImages);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to load cars.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUser();
      fetchCars();
    }, [])
  );

  // ---------------- Filter Cars ----------------
  useEffect(() => {
    if (!searchQuery.trim()) setFilteredCars(cars);
    else {
      const lowerQuery = searchQuery.toLowerCase();
      setFilteredCars(cars.filter((car) => car.brand.toLowerCase().includes(lowerQuery)));
    }
  }, [searchQuery, cars]);

  // ---------------- Ads ----------------
  const ads = [
    {
      image: require("../../assets/images/ads1.png"),
      description: "Students Discount\nDiscount: 20% OFF\nAffordable rides for students",
    },
    {
      image: require("../../assets/images/ads2.png"),
      description: "Senior Citizen Discount\nDiscount: 30% OFF\nSafe and comfortable rides for seniors",
    },
    {
      image: require("../../assets/images/ads3.png"),
      description: "Luxury / Premium Cars\nDiscount: Starting at ₱1500/day\nDrive a premium car for special occasions",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (currentAd + 1) % ads.length;
      setCurrentAd(nextIndex);
      adRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3000);
    return () => clearInterval(interval);
  }, [ads.length, currentAd]);

  // ---------------- Mark Car Unavailable ----------------
  const markCarUnavailable = async (carId: number) => {
    try {
      await fetch(`${BASE_URL}/cars/${carId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "unavailable" }),
      });
      fetchCars(); // Refresh list immediately
    } catch (error) {
      console.error("Failed to update car status:", error);
    }
  };

  // ---------------- Book Now ----------------
  const handleBookNow = async () => {
    if (selectedCar && selectedCar.status === "available") {
      try {
        await markCarUnavailable(selectedCar.car_id || selectedCar.id);
        router.push({
          pathname: "/pages/booking",
          params: { car: JSON.stringify(selectedCar) },
        });
        setSelectedCar(null);
      } catch (error) {
        Alert.alert("Error", "Failed to book car. Try again.");
      }
    } else {
      Alert.alert("Unavailable", "This car is currently unavailable for booking.");
    }
  };

  // ---------------- Ad Modal ----------------
  const openAdModal = (ad: any) => {
    setSelectedAd(ad);
    adScale.setValue(0);
    Animated.spring(adScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
      tension: 80,
    }).start();
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4C6B61" />
        <Text style={{ marginTop: 10, color: "#555", fontWeight: "500" }}>Loading cars...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require("../../assets/images/car-logo.png")} style={styles.logo} />
          <Text style={styles.brand}>
            Rent<Text style={styles.highlight}>Go</Text>
          </Text>
        </View>
        <TouchableOpacity style={styles.profileContainer} onPress={() => router.push("/pages/profile")}>
          <Image
            source={user?.image ? { uri: user.image } : require("../../assets/images/profile-icon.png")}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Search */}
      <Animated.View style={[styles.searchContainer, { top: 100 }]}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          placeholder="Search car brand..."
          placeholderTextColor="#888"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </Animated.View>

      {/* Cars + Ads */}
      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 140, paddingTop: 160 }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        {/* Ads */}
        <View style={{ marginBottom: 15 }}>
          <FlatList
            ref={adRef}
            data={ads}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            renderItem={({ item }) => (
              <View>
                <Image source={item.image} style={styles.adImage} resizeMode="cover" />
                <TouchableOpacity style={styles.viewButton} onPress={() => openAdModal(item)}>
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <View style={styles.dotsContainer}>
            {ads.map((_, index) => (
              <View key={index} style={[styles.dot, { opacity: index === currentAd ? 1 : 0.3 }]} />
            ))}
          </View>
        </View>

        {/* Cars Grid */}
        <View style={styles.carsGrid}>
          {filteredCars.length === 0 ? (
            <Text style={styles.noCars}>No cars found.</Text>
          ) : (
            filteredCars.map((car, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.carCard, car.status !== "available" && { opacity: 0.5 }]}
                onPress={() => setSelectedCar(car)}
              >
                <View style={styles.imageWrapper}>
                  <Image source={car.image} style={styles.carImage} resizeMode="contain" />
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    car.status === "available" ? { backgroundColor: "#224a35ff" } : { backgroundColor: "#7e2323ff" },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: "#fff", textTransform: "capitalize" } // White text
                    ]}
                  >
                    {car.status}
                  </Text>
                </View>
                <Text style={styles.carName}>{car.brand}</Text>
                <Text style={styles.carPrice}>₱ {car.price}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </Animated.ScrollView>

      {/* Car Modal */}
      {selectedCar && (
        <Modal visible transparent animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image source={selectedCar.image} style={styles.modalImage} resizeMode="contain" />
              <Text style={styles.modalTitle}>{selectedCar.brand}</Text>
              <Text style={styles.modalPrice}>₱ {selectedCar.price}</Text>
              <Text
                style={[
                  styles.modalAvailable,
                  { color: "#fff", fontWeight: "bold", textTransform: "capitalize" }, // White text
                  selectedCar.status === "available" ? { backgroundColor: "#224a35ff", padding: 5, borderRadius: 8 } : { backgroundColor: "#7e2323ff", padding: 5, borderRadius: 8 },
                ]}
              >
                Status: {selectedCar.status}
              </Text>

              <TouchableOpacity
                style={[styles.bookButton, selectedCar.status !== "available" && { backgroundColor: "#ccc" }]}
                onPress={handleBookNow}
                disabled={selectedCar.status !== "available"}
              >
                <Text style={styles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedCar(null)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Ad Modal */}
      {selectedAd && (
        <Modal visible transparent animationType="fade">
          <View style={styles.modalContainer}>
            <Animated.View style={[styles.modalContent, { transform: [{ scale: adScale }] }]}>
              <Image source={selectedAd.image} style={{ width: "100%", height: 250, borderRadius: 20 }} resizeMode="contain" />
              <Text style={styles.adDescription}>{selectedAd.description}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedAd(null)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      )}

      <BottomTabs scrollY={scrollY} />
    </View>
  );
}

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { position: "absolute", top: 0, left: 0, right: 0, backgroundColor: "#4C6B61", paddingHorizontal: 20, paddingVertical: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomLeftRadius: 25, borderBottomRightRadius: 25, zIndex: 100, elevation: 6 },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  logo: { width: 50, height: 50, marginRight: 12 },
  brand: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  highlight: { color: "#A3E635" },
  profileContainer: { width: 50, height: 50, borderRadius: 25, overflow: "hidden", backgroundColor: "#fff", justifyContent: "center", alignItems: "center", borderWidth: 2.5, borderColor: "#fff", shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 5, shadowOffset: { width: 0, height: 3 }, elevation: 5 },
  profileIcon: { width: "100%", height: "100%", borderRadius: 25, resizeMode: "cover" },
  searchContainer: { position: "absolute", left: 20, right: 20, backgroundColor: "#fff", borderRadius: 15, flexDirection: "row", alignItems: "center", paddingHorizontal: 15, height: 45, zIndex: 99, elevation: 4 },
  searchInput: { flex: 1, fontSize: 15, color: "#333" },
  adImage: { width: width - 40, height: 160, borderRadius: 20, marginHorizontal: 10 },
  viewButton: { position: "absolute", bottom: 10, right: 15, backgroundColor: "#4C6B61", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  viewButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  adDescription: { marginTop: 12, fontSize: 15, color: "#333", textAlign: "center", lineHeight: 20 },
  dotsContainer: { flexDirection: "row", justifyContent: "center", marginTop: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#4C6B61", marginHorizontal: 4 },
  carsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 15 },
  carCard: { width: "48%", backgroundColor: "#fff", borderRadius: 20, marginBottom: 15, padding: 12, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 4, borderWidth: 1, borderColor: "#E5E7EB" },
  imageWrapper: { width: "100%", height: 100, borderRadius: 15, overflow: "hidden", marginBottom: 10, justifyContent: "center", alignItems: "center", backgroundColor: "#F3F4F6" },
  carImage: { width: "90%", height: "90%" },
  statusBadge: { borderRadius: 50, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 5 },
  statusText: { fontSize: 12, fontWeight: "600" },
  carName: { fontSize: 15, fontWeight: "600", marginBottom: 3, color: "#111827" },
  carPrice: { fontSize: 13, color: "#6B7280" },
  noCars: { textAlign: "center", marginTop: 30, color: "#9CA3AF", fontSize: 16 },
  modalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#fff", borderRadius: 25, padding: 25, width: "85%", alignItems: "center", elevation: 8 },
  modalImage: { width: 180, height: 120, marginBottom: 15 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 6 },
  modalPrice: { fontSize: 17, color: "#4B5563", marginBottom: 6 },
  modalAvailable: { fontSize: 14, marginBottom: 15 },
  bookButton: { backgroundColor: "#4C6B61", padding: 14, borderRadius: 12, width: "100%", alignItems: "center", marginBottom: 12 },
  bookButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  closeButton: { backgroundColor: "#E5E7EB", padding: 12, borderRadius: 12, width: "100%", alignItems: "center" },
  closeButtonText: { color: "#111827", fontWeight: "bold", fontSize: 15 },
});
