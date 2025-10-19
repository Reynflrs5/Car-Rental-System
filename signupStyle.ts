import { StyleSheet } from "react-native";

const signupStyle = StyleSheet.create({
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
    marginTop: -90, // overlap effect like login
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
  fontSize: 14,  // or 18 if you want same size as login
  color: "#666", // gray color
  marginBottom: 20,
  fontWeight: "400", // normal weight
  textAlign: "center", // keep it centered
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
    marginBottom: 15,
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
  signupButton: {
    backgroundColor: "#4C6B61",
    borderRadius: 10,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  signupText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  loginContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  loginText: {
    fontSize: 13,
    color: "#333",
  },
  loginLink: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4C6B61",
  },
  welcome: {
  fontSize: 20,
  fontWeight: "bold",
  color: "#333",
  marginBottom: 5,
},

});

export default signupStyle;
