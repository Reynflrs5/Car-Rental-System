import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const indexStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4C6B61", // FULL SCREEN GREEN
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  headerRow: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  highlight: {
    color: "#9FE2BF",
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 30,
  },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#EAEAEA",
    textAlign: "center",
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: "80%",
    borderRadius: 12,
    paddingVertical: 15,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  whiteButton: {
    backgroundColor: "#fff", // Buttons still white
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  greenText: {
    color: "#4C6B61", // Text matches background for contrast
  },
});

export default indexStyle;
