import React from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Header from "./header";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";

const HelpAndSupport = () => {
  return (
    <>
      <Header title="અમને કૉલ કરો" iconName="arrow-back" backPath />
      <ScrollView style={styles.container}>
        <View style={styles.infoContainer}>
          {/* Call Section */}
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => Linking.openURL("tel:+919723963863")}
          >
            <Ionicons name="call" size={30} color="white" style={styles.icon} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>અમને કૉલ કરો</Text>
              <Text style={styles.number}>+91 97239 63863</Text>
            </View>
          </TouchableOpacity>

          {/* WhatsApp Section */}
          <TouchableOpacity 
            style={[styles.card, styles.whatsappCard]} 
            onPress={() => Linking.openURL("https://wa.me/919723963863")}
          >
            <Ionicons name="logo-whatsapp" size={30} color="white" style={styles.icon} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>અમને Whatsapp કરો</Text>
              <Text style={styles.number}>+91 97239 63863</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

export default HelpAndSupport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1a237e",
    marginBottom: 20,
  },
  infoContainer: {
    marginTop: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a237e",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  whatsappCard: {
    backgroundColor: "#25D366",
  },
  icon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  number: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f8f9fa",
  },
});
