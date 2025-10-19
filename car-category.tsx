import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import carCategoryStyle from "../../assets/css/carCategoryStyle";
import dashboardStyle from "../../assets/css/dashboardStyle";
import BottomTabs from "../../components/bottomtabs";

export default function CarCategoryPage() {
  const router = useRouter();
  const BASE_URL = "http://192.168.100.96:5000";

  const scrollY = useRef(new Animated.Value(0)).current;

  const categories = [
    "All",
    "Sedan",
    "SUV",
    "Van",
    "Pickup Truck",
    "Sports Car",
    "Hatchback",
  ];

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<any>(null);

  const defaultCarImage = require("../../assets/images/default.png");

  // ---------------- Fetch Cars ----------------
  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/cars`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      // Normalize data & add dynamic image field
      const normalized = data.map((car: any) => ({
        ...car,
        status: car.status?.toLowerCase() || "not available",
        image: car.image ? { uri: car.image } : defaultCarImage,
      }));

      setCars(normalized);
    } catch (error) {
      console.error("Error fetching cars:", error);
      Alert.alert("Error", "Failed to fetch car list.");
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // ---------------- Filtered Cars ----------------
  const filteredCars = cars.filter((car) => {
    const matchCategory =
      activeCategory === "All" ||
      car.category?.toLowerCase() === activeCategory.toLowerCase();
    const matchSearch = car.brand?.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  // ---------------- Mark Car Unavailable ----------------
  const markCarUnavailable = async (carId: number) => {
    try {
      setCars((prev) =>
        prev.map((car) =>
          car.car_id === carId ? { ...car, status: "unavailable" } : car
        )
      );

      const res = await fetch(`${BASE_URL}/cars/${carId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "unavailable" }),
      });

      if (!res.ok) throw new Error("Failed to update car status on server");
    } catch (error) {
      console.error("Error updating status:", error);
      Alert.alert("Error", "Failed to update car status. Please try again.");
      fetchCars(); // revert UI if failed
    }
  };

  // ---------------- Book Now ----------------
  const handleBookNow = () => {
    if (selectedCar && selectedCar.status === "available") {
      markCarUnavailable(selectedCar.car_id);
      router.push({
        pathname: "/pages/booking",
        params: { car: JSON.stringify(selectedCar) },
      });
      setSelectedCar(null);
    } else {
      Alert.alert("Unavailable", "This car is currently unavailable for booking.");
    }
  };

  return (
    <View style={carCategoryStyle.container}>
      {/* Title */}
      <Text style={carCategoryStyle.title}>Cars</Text>

      {/* Search Bar */}
      <View style={carCategoryStyle.searchContainer}>
        <Ionicons name="search" size={18} color="#777" />
        <TextInput
          placeholder="Search cars..."
          style={carCategoryStyle.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Category Buttons */}
      <View style={{ marginBottom: 15 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, alignItems: "center" }}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.8}
              style={[
                carCategoryStyle.categoryButton,
                activeCategory === cat && carCategoryStyle.categoryButtonActive,
              ]}
            >
              <Text
                style={[
                  carCategoryStyle.categoryText,
                  activeCategory === cat && carCategoryStyle.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Cars List */}
      {loading ? (
        <ActivityIndicator size="large" color="#819A91" style={{ marginTop: 50 }} />
      ) : (
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {filteredCars.length > 0 ? (
            filteredCars.map((car) => (
              <View key={car.car_id} style={carCategoryStyle.carCard}>
                <Image
                  source={car.image}
                  style={carCategoryStyle.carImage}
                  resizeMode="contain"
                />
                <View style={{ flex: 1 }}>
                  <Text style={carCategoryStyle.carName}>{car.brand}</Text>
                  <Text style={carCategoryStyle.carType}>
                    {car.category || car.type || "N/A"}
                  </Text>
                  <Text
                    style={[
                      carCategoryStyle.carAvailable,
                      { color: car.status === "available" ? "#4C6B61" : "#C0392B" },
                    ]}
                  >
                    {car.status === "available" ? "Available" : "Not Available"}
                  </Text>
                  <Text style={carCategoryStyle.carPrice}>
                    ₱ {car.price?.toLocaleString()} / day
                  </Text>

                  {/* Buttons */}
                  <View style={carCategoryStyle.buttonRow}>
                    <TouchableOpacity
                      style={[
                        carCategoryStyle.bookButton,
                        car.status !== "available" && { backgroundColor: "#ccc" },
                      ]}
                      onPress={() => setSelectedCar(car)}
                      disabled={car.status !== "available"}
                    >
                      <Text style={carCategoryStyle.bookButtonText}>Book Now</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={carCategoryStyle.detailsButton}
                      onPress={() =>
                        router.push({
                          pathname: "/pages/car-details",
                          params: { id: car.car_id?.toString() },
                        })
                      }
                    >
                      <Text style={carCategoryStyle.detailsButtonText}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20 }}>No cars available</Text>
          )}
        </Animated.ScrollView>
      )}

      {/* Modal */}
      <Modal visible={!!selectedCar} transparent animationType="slide">
        <View style={dashboardStyle.modalContainer}>
          <View style={dashboardStyle.modalContent}>
            {selectedCar && (
              <>
                <Image
                  source={selectedCar.image}
                  style={dashboardStyle.modalImage}
                  resizeMode="contain"
                />
                <Text style={dashboardStyle.modalTitle}>{selectedCar.brand}</Text>
                <Text style={dashboardStyle.modalPrice}>
                  ₱ {selectedCar.price?.toLocaleString()} / day
                </Text>
                <Text
                  style={[
                    dashboardStyle.modalAvailable,
                    { color: selectedCar.status === "available" ? "#10B981" : "#B91C1C" },
                  ]}
                >
                  Status: {selectedCar.status === "available" ? "Available" : "Not Available"}
                </Text>

                <TouchableOpacity
                  style={[
                    dashboardStyle.bookButton,
                    selectedCar.status !== "available" && { backgroundColor: "#ccc" },
                  ]}
                  onPress={handleBookNow}
                  disabled={selectedCar.status !== "available"}
                >
                  <Text style={dashboardStyle.bookButtonText}>Book Now</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={dashboardStyle.closeButton}
                  onPress={() => setSelectedCar(null)}
                >
                  <Text style={dashboardStyle.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      <BottomTabs scrollY={scrollY} />
    </View>
  );
}
