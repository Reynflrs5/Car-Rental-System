import { StyleSheet } from "react-native";

const dashboardStyle = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    backgroundColor: "#4C6B61",
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  logo: { width: 40, height: 40, marginRight: 8 },
  brand: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  highlight: { color: "#6DBF77" },
  headerTitle: { fontSize: 16, color: "#fff", fontWeight: "600" },

  scrollArea: { flex: 1, padding: 15 },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchIcon: { marginRight: 5 },
  searchInput: { flex: 1, paddingVertical: 8, fontSize: 14, color: "#333" },

  promoImageFull: {
    width: "100%",
    height: 120,
    marginBottom: 20,
  },

  carsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  carCard: {
    backgroundColor: "#fff",
    width: "48%",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  carImage: { width: "100%", height: 70 },
  available: { fontSize: 12, color: "#6DBF77", marginTop: 5 },
  carName: { fontSize: 13, fontWeight: "600", marginTop: 3, color: "#333" },
  carPrice: { fontSize: 12, color: "#555", marginTop: 2 },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalImage: { width: 150, height: 100, marginBottom: 15 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  modalPrice: { fontSize: 16, color: "#555", marginBottom: 5 },
  modalAvailable: { fontSize: 14, color: "#6DBF77", marginBottom: 15 },

  bookButton: {
    backgroundColor: "#4C6B61",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  bookButtonText: { color: "#fff", fontWeight: "bold" },

  closeButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  closeButtonText: { color: "#333", fontWeight: "bold" },

  bottomTabs: {
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
  backgroundColor: "#fff",
  paddingVertical: 10,
  borderTopWidth: 1,
  borderTopColor: "#ddd",
},
tabItem: {
  flex: 1,
  alignItems: "center",
},
tabLabel: {
  fontSize: 12,
  color: "#2F4F4F",
  marginTop: 2,
},



});

export default dashboardStyle;
