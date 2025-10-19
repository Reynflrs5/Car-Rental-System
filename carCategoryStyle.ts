import { StyleSheet } from "react-native";

const carCategoryStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2F4F4F",
    marginBottom: 10,
  },

   // carCategoryStyle.ts (replace only this part)
searchContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#FFFFFF", // brighter white for contrast
  borderRadius: 25, // pill-style
  paddingHorizontal: 15,
  height: 50,
  marginBottom: 20,
  borderWidth: 1, // visible outline
  borderColor: "#D0D0D0", // light gray border
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 3, // Android shadow
},

searchInput: {
  flex: 1,
  marginLeft: 10,
  fontSize: 17,
  color: "#333",
  paddingVertical: 5,
},


// ✅ Category Buttons
  categoryScroll: {
    marginBottom: 15,
  },

  categoryButton: {
    backgroundColor: "#D9E9CF",
    height: 40,
    minWidth: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginRight: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },

  categoryButtonActive: {
    backgroundColor: "#819A91",
  },

  categoryText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },

  categoryTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  // ✅ Car Cards
  carCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  carImage: {
    width: 100,
    height: 60,
    resizeMode: "contain",
    marginRight: 10,
  },

  carName: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#2F4F4F",
  },

  carType: {
    fontSize: 13,
    color: "#666",
  },

  carAvailable: {
    fontSize: 13,
    color: "#4C6B61",
    fontWeight: "600",
  },

  carPrice: {
    fontSize: 13,
    color: "#000",
  },

  // ✅ Button Row
  buttonRow: {
    flexDirection: "row",
    marginTop: 8,
  },

  // ✅ Buttons
  bookButton: {
    backgroundColor: "#819A91",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },

  bookButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  detailsButton: {
    backgroundColor: "#2F4F4F",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },

  detailsButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  
});


export default carCategoryStyle;
