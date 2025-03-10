import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ImageBackground,
  Image,  // Import Image
  KeyboardAvoidingView,
  Alert,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Link, Redirect, router, useFocusEffect } from "expo-router";
import Toast from "react-native-toast-message";
import { Instance } from "@/lib/instance";
import { LOGIN } from "@/constant/apis";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { removeLocalStorage, setLocalStorage, getLocalStorage } from "@/helper/asyncStorage";
import CustomButton from "@/app/components/customButton";
import { CustomTextInput } from "./components/customTextInput";
import { getFinancialYears } from "@/helper/api-communication";

export default function Login() {
  const router = useRouter();
  const [inputsValue, setInputsValue] = useState({
    identifier: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert("Exit App", "Are you sure you want to exit?", [
          { text: "Cancel", style: "cancel" },
          { text: "Exit", onPress: () => BackHandler.exitApp() },
        ]);
        return true; // Prevent default back action
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );

  const handleSubmit = async () => {
    try {
  
      const response = await Instance.post(LOGIN, inputsValue);
      if (response.status === 200 || response.status === 201) {
        const token = response?.data?.data?.token;
        const userDetail = response?.data?.data?.userDetail || {};
  
        await removeLocalStorage("auth_token");
        await setLocalStorage("auth_token", token);
        await setLocalStorage("user_id", userDetail?.user_id || ""); // ✅ Safe default value
        await setLocalStorage("school_name", userDetail?.school_name || "");
  
        // ✅ Only set `subscription_id` if it exists (not `null`)
        if (userDetail?.current_subscription_id) {
          await setLocalStorage("subscription_id", userDetail.current_subscription_id);
        }
  
        Toast.show({
          visibilityTime: 1000,
          type: "success",
          text1: "✅ Success",
          text2: "Login Successful",
          text2Style: { fontSize: 12 },
          onHide: async () => {
            if (!userDetail?.current_subscription_id) {
              return router.push("/components/premiumSubscription");
            }
            return router.push("/(tabs)/home");
          },
        });
  
        setInputsValue({ identifier: "", password: "" });
  
        // ✅ Only update the current financial year plan if `subscription_id` exists
        if (userDetail?.current_subscription_id) {
          const plan = await getFinancialYears();
          const { data } = plan;
          
          const subscriptionId = userDetail.current_subscription_id.toString();
          const findPlan = data?.find((plan: any) => plan._id?.toString() === subscriptionId);
  
          if (findPlan) {
            const handleYear = findPlan?.plan_name?.split(" ")[1] || "";
            await setLocalStorage("yearPlan", JSON.stringify(handleYear));
          }
        }
      }
    } catch (err: any) {
      console.log("Error:", err);
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: err.response?.data?.message || err?.message,
        text2Style: { fontSize: 12 },
      });
    }
  };
  


  return (
    <>
    {/* <Redirect href={"/components/subscription"}/> */}
      <ImageBackground
        source={require("../assets/images/background_image.jpg")}
        style={styles.backgroundImage}
      >
        <View style={styles.mainContainer}>
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <Image source={require("../assets/images/icon.png")} style={styles.logo} />
          </View>

          {/* Sign In Text */}
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: "#1a237e" }]}>Sign In</Text>
            <Text style={styles.desc}>Welcome back you've</Text>
            <Text style={styles.desc}>been missed!</Text>
          </View>

          {/* Input Fields */}
          <View style={{ marginBottom: 10 }}>
            <CustomTextInput
              value={inputsValue.identifier}
              onChangeText={(text) =>
                setInputsValue((prev) => ({ ...prev, identifier: text }))
              }
              placeholder="Email or Mobile No"
              label="Email or Mobile No"
              type={"default"}
            />

            {/* Password Input with Eye Icon */}
              <CustomTextInput
                value={inputsValue.password}
                onChangeText={(text) =>
                  setInputsValue((prev) => ({ ...prev, password: text }))
                }
                placeholder="Password"
                label="Password"
                secureTextEntry={!showPassword}
                type="default"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="#666" />
              </TouchableOpacity>
            <View>
              <Link
                href="/resetPassword"
                style={styles.forgotPassword}
              >
                Forgot your password?
              </Link>
            </View>
          </View>

          {/* Login Button */}
          <CustomButton text="Login" key={"login"} handlePress={handleSubmit} />

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={{ textAlign: "center", fontSize: 16 }}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  
  eyeIcon: {
    position: "absolute",
    right: 15,
    bottom :54
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 50, // Adjust as needed
  },
  logo: {
    width: 120, // Adjust size as needed
    height: 120,
    resizeMode: "contain",
  },
  headerContainer: {
    height: 150,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  desc: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
  },
  forgotPassword: {
    textAlign: "right",
    fontSize: 16,
    fontWeight: "600",
    color: "#1a237e",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 20,
  },
  signupText: {
    textAlign: "center",
    fontSize: 16,
    color: "#1a237e",
    fontWeight: "700",
  },
});

