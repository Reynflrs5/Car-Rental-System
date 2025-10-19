import { StyleSheet } from "react-native";

const bookingsHistoryStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2F4F4F",
    marginBottom: 15,
  },

  bookingCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 18,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  carImage: {
    width: 100,
    height: 80,
    borderRadius: 10,
    marginRight: 14,
  },

  bookingInfo: {
    flex: 1,
  },

  carName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2F4F4F",
  },

  bookingDate: {
    fontSize: 13,
    color: "#555",
    marginVertical: 2,
  },

  upcoming: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#2e8b57",
  },

  completed: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#555",
  },

  canceled: {   // ✅ Added this
    fontSize: 13,
    fontWeight: "bold",
    color: "red",
  },

  cardBottom: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
  },

  emptyBox: {
    marginTop: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 30,
  },

  emptyText: {
    fontSize: 14,
    color: "#555",
    marginTop: 10,
    marginBottom: 10,
  },

  browseButton: {
    backgroundColor: "#2F4F4F",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  /** Modern Bottom Tabs */
  bottomTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingVertical: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  tabItem: {
    alignItems: "center",
    flex: 1,
  },

  tabLabel: {
    fontSize: 11,
    color: "#2F4F4F",
    marginTop: 3,
    fontWeight: "600",
  },

  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },

  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#999",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },

  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2F4F4F",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  actionButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 5,
  },
  
removeButton: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#e74c3c", // red color
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 20,
  marginRight: 10,  
},
headerContainer: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 15,
},

statusBadge: {
  alignSelf: "flex-start",
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 20,
  marginTop: 5,
},

statusText: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 12,
},



});

export default bookingsHistoryStyle;
