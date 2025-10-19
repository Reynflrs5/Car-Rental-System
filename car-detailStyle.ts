import { StyleSheet } from "react-native";

const cardetailStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2F4F4F",
    marginLeft: 15,
  },
  imageContainer: {
    width: "100%",
    height: 250,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  carImage: {
    width: "90%",
    height: "90%",
  },
  infoContainer: {
    padding: 20,
    backgroundColor: "#fff",
  },
  carName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2F4F4F",
    marginBottom: 5,
  },
  carType: {
    fontSize: 16,
    color: "#777",
    marginBottom: 15,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    color: "#fff",
  },
  available: {
    backgroundColor: "#28A745",
  },
  notAvailable: {
    backgroundColor: "#DC3545",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2F4F4F",
  },
  bookButton: {
    backgroundColor: "#2F4F4F",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default cardetailStyle;
