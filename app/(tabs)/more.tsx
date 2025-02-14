import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";

const More = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="book-outline" size={24} color="white" />
          <Text style={styles.headerTitle}>My Business</Text>
        </View>
        <Ionicons name="pencil" size={24} color="white" />
      </View>

      <ScrollView>
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>MB</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.businessName}>My Business</Text>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.strengthSection}>
            <Text style={styles.strengthText}>
              Profile strength : <Text style={styles.weakText}>Weak</Text>
            </Text>
            <Text style={styles.percentageText}>0%</Text>
          </View>

          <TouchableOpacity style={styles.businessCard}>
            <Text style={styles.cardTitle}>
              Fill missing details for a FREE
            </Text>
            <Text style={styles.cardSubtitle}>Business Card</Text>
            <TouchableOpacity style={styles.proceedButton}>
              <Text style={styles.proceedText}>PROCEED</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionItem}>
              <View style={[styles.actionIcon, { backgroundColor: "#E3F2FD" }]}>
                <MaterialCommunityIcons
                  name="currency-inr"
                  size={24}
                  color="#1976D2"
                />
              </View>
              <Text style={styles.actionText}>Cashbook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <View style={[styles.actionIcon, { backgroundColor: "#FFF8E1" }]}>
                <FontAwesome5 name="user-plus" size={20} color="#FFA000" />
              </View>
              <Text style={styles.actionText}>Staff</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <View style={[styles.actionIcon, { backgroundColor: "#FFF3E0" }]}>
                <FontAwesome5 name="calendar-alt" size={20} color="#F57C00" />
              </View>
              <Text style={styles.actionText}>Collection</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuItems}>
            {[
              { icon: "settings", title: "Settings" },
              { icon: "help-circle", title: "Help & Support" },
              { icon: "information-circle", title: "About Us" },
            ].map((item: any, index) => (
              <TouchableOpacity key={index} style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <Ionicons name={item.icon} size={24} color="#1976D2" />
                  <Text style={styles.menuText}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 40,
    backgroundColor: "#1a237e",
    paddingVertical: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
  },
  profileSection: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1976D2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatarText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  profileInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  businessName: {
    fontSize: 24,
    fontWeight: "500",
  },
  editButton: {
    borderWidth: 1,
    borderColor: "#1976D2",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  editButtonText: {
    color: "#1976D2",
  },
  strengthSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  strengthText: {
    fontSize: 16,
  },
  weakText: {
    color: "red",
  },
  percentageText: {
    color: "red",
  },
  businessCard: {
    backgroundColor: "#1976D2",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  cardTitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 4,
  },
  cardSubtitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 16,
  },
  proceedButton: {
    backgroundColor: "white",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  proceedText: {
    color: "#1976D2",
    fontWeight: "500",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  actionItem: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    marginHorizontal: 4,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 13,
  },
  menuItems: {
    gap: 16,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  menuText: {
    fontSize: 16,
  },
});

export default More;
