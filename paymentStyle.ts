import { StyleSheet } from "react-native";

const paymentStyle = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },

  carCard: { alignItems: "center", marginBottom: 20 },
  carImage: { width: 200, height: 120, marginBottom: 10 },
  carName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  carPrice: { fontSize: 16, color: "#4C6B61", marginTop: 5 },

  summaryCard: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  summaryText: { fontSize: 14, color: "#333", marginBottom: 5 },
  totalPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4C6B61",
    marginTop: 10,
  },

  discountBox: { marginBottom: 20 },
  discountButtons: { flexDirection: "row", justifyContent: "space-between" },
  discountButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: "#eee",
    alignItems: "center",
  },
  discountActive: { backgroundColor: "#4C6B61" },
  discountText: { fontSize: 14, fontWeight: "bold", color: "#333" },
  discountTextActive: { color: "#fff" },

  cashBox: { marginBottom: 20 },
  cashInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },

  payButton: {
    backgroundColor: "#4C6B61",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  payButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  receiptCard: {
    backgroundColor: "#f1f1f1",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },

  cancelButton: {
    backgroundColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: { color: "#333", fontWeight: "bold", fontSize: 16 },
});

export default paymentStyle;
