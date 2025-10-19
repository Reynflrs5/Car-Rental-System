import { StyleSheet } from "react-native";

const forgetpasswordStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topSection: {
    backgroundColor: "#4C6B61",
    height: 160,
    width: "100%",
  },
  logoWrapper: {
    alignItems: "center",
    marginTop: -90,
  },
  logo: {
    width: 180,
    height: 180,
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 25,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#4C6B61",
    marginBottom: 5,
  },
  highlight: {
    color: "#6DBF77",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 14,
    color: "#333",
  },
  continueButton: {
    backgroundColor: "#4C6B61",
    borderRadius: 10,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  backButton: {
    backgroundColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default forgetpasswordStyle;
