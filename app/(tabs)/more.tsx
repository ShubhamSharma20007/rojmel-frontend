import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import Header from "../components/header";
import { useRouter} from "expo-router";
import {getLocalStorage, removeLocalStorage} from "../../helper/asyncStorage"
import {handleSplitName} from "../../helper/splitName"
import { useFocusEffect } from "@react-navigation/native";


const More = () => {
  const router = useRouter();
  const [userDetails, getUserDetails] = useState("")
  function handleRedirection(pathname: any) {
    return router.push(pathname);
  }

  async function handleLogout() {
    await removeLocalStorage('auth_token');
    return router.push("/"); 
  }

  useFocusEffect(()=>{
    (async()=>{
      const userDetails = await getLocalStorage('school_name')
      getUserDetails(userDetails!);
    })
() }) 

  return (
    <View style={styles.container}>
      <Header title="પ્રોફાઇલ અને સેટિંગ્સ" key={"profile"} iconName="" />

      <ScrollView>
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{handleSplitName(userDetails)}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.businessName}>{userDetails}</Text>
              <TouchableOpacity style={styles.editButton}
              onPress={()=>router.push('/components/updateUserProfile')}
              >
                <Text style={styles.editButtonText}>ફેરફાર કરો</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.menuItems}>
            {[
              { icon: "calendar", title: "નાણાકીય વર્ષ", path: "/components/financialYearChange" },
              { icon: "card", title: "યોજનાઓ", path: "/components/subscription" },
              { icon: "receipt", title: "બિલિંગ ઇતિહાસ", path: "/components/purchaseHistory" },
              { icon: "help-circle", title: "કેવી રીતે ઉપયોગ કરવો ?", path: "https://www.youtube.com/watch?v=veyoAuaw_8w" },
              { icon: "call", title: "અમને કૉલ કરો", path: "/components/helpAndSupport" },
              { icon: "information-circle", title: "અમારા વિશે", path: "/components/aboutUs" },
              { icon: "shield-checkmark", title: "કેવી રીતે ઉપયોગ કરવો", path: "/components/privacyPolicy" },
              { icon: "document-text", title: "નિયમ અને શરતો", path: "/components/termsAndCondition" }
            ].map((item: any, index) => (
              <TouchableOpacity key={index} style={styles.menuItem} onPress={() => handleRedirection(item.path)}>
                <View style={styles.menuLeft}>
                  <Ionicons name={item.icon} size={24} color="#1a237e" />
                  <Text style={styles.menuText}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#666" />
              </TouchableOpacity>
            ))}

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="red" />
              <Text style={styles.logoutText}>લૉગ આઉટ</Text>
            </TouchableOpacity>

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
  profileSection: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: "#1a237e",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  avatarText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  profileInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  businessName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  editButton: {
    borderWidth: 1,
    borderColor: "#1a237e",
    backgroundColor: "#1a237e",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  editButtonText: {
    color: "white",
    fontWeight: "bold",
    letterSpacing: 0.5,
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
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: "#fff5f5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "red",
  },
  logoutText: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default More;
