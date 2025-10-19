import { StyleSheet } from "react-native";

const profileStyle = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2F4F4F",
    marginBottom: 25,
  },

  header: {
    alignItems: "center",
    marginBottom: 25,
  },

  profileIcon: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: "#2F4F4F",
  },

  inputWrapper: {
    width: "90%",
    alignItems: "center",
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2F4F4F",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    height: 50,
    width: "100%",
    backgroundColor: "#FAFAFA",
  },

  label: {
    fontSize: 13,
    color: "#2F4F4F",
    width: 80,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },

  editButton: {
    backgroundColor: "#4C6B61",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    width: "60%",
  },

  logoutButton: {
    backgroundColor: "#DC3545",
    marginTop: 12,
  },

  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

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


export default profileStyle;
