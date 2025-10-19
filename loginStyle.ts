import { StyleSheet } from "react-native";

const loginStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // default white
  },
  topSection: {
    backgroundColor: "#4C6B61",
    height: 160, // green bar
    width: "100%",
  },
  logoWrapper: {
    alignItems: "center",
    marginTop: -90, // overlap effect
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
  welcome: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10, // tighter spacing before "Forgot password"
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    color: "#333",
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4C6B61",
  },
  loginButton: {
    backgroundColor: "#4C6B61",
    borderRadius: 10,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  loginText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  signupText: {
    fontSize: 13,
    color: "#333",
  },
  signupLink: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4C6B61",
  },
});

export default loginStyle;
