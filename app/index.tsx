import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

import WelcomeImage from "@/assets/images/welcome.png";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";

const WELCOME_IMAGE = Image.resolveAssetSource(WelcomeImage);

const Index = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={WELCOME_IMAGE} style={styles.welcomeImage} />
        <Text style={styles.headline}>Welcome to WhatsApp Clone</Text>
        <Text style={styles.info}>
          Read our <Text style={styles.link}>Privacy Policy.</Text> Tap "Agree &
          Continue" to accept the{" "}
          <Text style={styles.link}>Terms of Service</Text>
        </Text>
        <Link href="/otp" replace asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Agree & Continue</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFf",
  },
  content: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeImage: {
    width: "90%",
    height: 350,
    objectFit: "cover",
    marginBottom: 60,
  },
  headline: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  info: {
    textAlign: "center",
    marginTop: 20,
    color: Colors.gray,
  },
  link: {
    color: Colors.primary,
  },
  button: {
    marginTop: 40,
  },
  buttonText: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 20,
  },
});
