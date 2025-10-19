import React, { useEffect, useState } from "react";
import {
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const BASE_URL = "http://192.168.100.96:5000";
const defaultCarImage = require("../../assets/images/default.png");

export default function CarDetailsPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const res = await fetch(`${BASE_URL}/cars/${id}`);
        const data = await res.json();

        if (data) {
          data.status = data.status?.toLowerCase() || "not available";
          data.image = data.image ? { uri: `${BASE_URL}/${data.image}` } : defaultCarImage; // dynamic image
        }

        setCar(data);
      } catch (error) {
        console.error("Error fetching car details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCarDetails();
  }, [id]);

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#4C6B61"
        style={{ marginTop: 120 }}
      />
    );

  if (!car)
    return (
      <Text style={{ textAlign: "center", marginTop: 50 }}>
        Car not found.
      </Text>
    );

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F5F4" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#4C6B61",
          paddingVertical: 15,
          paddingHorizontal: 20,
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 4,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
            flex: 1,
            textAlign: "center",
            marginRight: 22,
          }}
        >
          Car Details
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero Image */}
        <View style={{ alignItems: "center", marginTop: 15 }}>
          <Image
            source={car.image || defaultCarImage} // dynamic
            style={{
              width: width * 0.85,
              height: 230,
              resizeMode: "contain",
              borderRadius: 20,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 10,
            }}
          />
        </View>

        {/* Price and Brand */}
        <View
          style={{
            backgroundColor: "#E2E8E4",
            borderRadius: 15,
            marginHorizontal: 20,
            marginTop: 20,
            paddingVertical: 15,
            paddingHorizontal: 20,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 5,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#4C6B61" }}>
            {car.brand}
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "#4C6B61",
              marginTop: 5,
              fontWeight: "500",
            }}
          >
            ₱ {car.price?.toLocaleString()} / day
          </Text>
        </View>

        {/* Details Section */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            marginTop: 25,
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 26, fontWeight: "bold", color: "#4C6B61" }}>
              {car.brand}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor:
                  car.status === "available" ? "#CDE3DC" : "#FAD4D4",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 12,
              }}
            >
              <Ionicons
                name={car.status === "available" ? "checkmark-circle" : "close-circle"}
                size={16}
                color={car.status === "available" ? "#4C6B61" : "red"}
                style={{ marginRight: 5 }}
              />
              <Text
                style={{
                  color: car.status === "available" ? "#4C6B61" : "red",
                  fontWeight: "600",
                }}
              >
                {car.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={{ fontSize: 16, color: "#666", marginTop: 5 }}>
            {car.type}
          </Text>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: "#EEE", marginVertical: 20 }} />

          {/* Specs */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#4C6B61",
              marginBottom: 10,
              borderLeftWidth: 4,
              borderLeftColor: "#4C6B61",
              paddingLeft: 8,
            }}
          >
            Specifications
          </Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
            <SpecItem icon="speedometer" label="Transmission" value={car.transmission || "N/A"} />
            <SpecItem icon="color-palette" label="Color" value={car.color || "N/A"} />
            <SpecItem icon="flame" label="Fuel Type" value={car.fuel_type || "N/A"} />
            <SpecItem icon="people" label="Seats" value={car.seats?.toString() || "N/A"} />
          </View>

          {/* Description */}
          <Text style={{ fontSize: 16, color: "#555", marginTop: 20, lineHeight: 22 }}>
            {car.description ||
              "This car provides exceptional performance, comfort, and style for your travel needs. Perfect for family trips or solo adventures."}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function SpecItem({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View
      style={{
        width: "47%",
        backgroundColor: "#E2E8E4",
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 10,
        alignItems: "center",
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <Ionicons name={icon} size={22} color="#4C6B61" />
      <Text style={{ fontWeight: "600", color: "#4C6B61", marginTop: 5 }}>{label}</Text>
      <Text style={{ color: "#555", fontSize: 13, marginTop: 2 }}>{value}</Text>
    </View>
  );
}
