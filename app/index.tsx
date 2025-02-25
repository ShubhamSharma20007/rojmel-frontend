import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ImageBackground,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Link, Redirect, router } from "expo-router";
import Toast from "react-native-toast-message";
import { Instance } from "@/lib/instance";
import { LOGIN } from "@/constant/apis";
import { useRouter } from "expo-router";
import { setLocalStorage } from "@/helper/asyncStorage";
import CustomButton from "@/app/components/customButton";
import { CustomTextInput } from "./components/customTextInput";

import { StatusBar } from "expo-status-bar";
import RazorpayCheckout from "react-native-razorpay";
type InputsType = {
  bank_account_no: string;
  password: string;
};

export default function Login() {
  const router = useRouter();
  const [inputsValue, setInputsValue] = useState<InputsType>({
    bank_account_no: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);


  const handleSubmit = async () => {

    try {
      if (!inputsValue.bank_account_no || !inputsValue.password) {
        Toast.show({
          type: "error",
          text1: "❌ Error",
          text2: "Both fields are required!",
        });
        return;
      }

      const response = await Instance.post(LOGIN, inputsValue);
      if (response.status === 200 || response.status === 201) {
        console.log("Response:", response.data);
        const token = response.data.data.token;
        await setLocalStorage("auth_token", token);
        Toast.show({
          visibilityTime:1000,
          type: "success",
          text1: "✅ Success",
          text2: "Login Successful",
          text2Style: {
            fontSize: 12,
          },
          
          onHide: async() => {
            // router.push("/(tabs)/home");
            router.push("/components/premiumSubscription");
          }
          
        });
        setInputsValue({
          bank_account_no: '',
          password: ''
        })
    
      }
    } catch (err: any) {
      console.log("Error:",err);
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2:err.response?.data?.message|| err?.message,
        text2Style: {
          fontSize: 12,
        },
      });
    }
  };



  return (
    <>
       {/* <StatusBar translucent style="dark"/> */}
      {/* <Redirect href={"/index"} /> */}
      {/* <Redirect href={"/components/premiumSubscription"} /> */}
      <ImageBackground
        source={require("../assets/images/background_image.jpg")}
        style={styles.backgroundImage}
      >
        <View
          style={styles.mainContainer}>
          <View
            style={{
              height: 260,
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Text style={[styles.title, { color: "#1a237e" }]}>Sign In</Text>
            <Text style={styles.desc}>Welcome back you've</Text>
            <Text style={styles.desc}>been missed!</Text>
          </View>
          {/* <CustomTextInput
            value={formData.amount}
            onChangeText={(value) => handleChange('amount', value)}
            placeholder="Amount"
            label="Amount"
            type={'numeric'}
          />    */}
          <View style={{ marginBottom: 10 }}>
           
              <CustomTextInput
                value={inputsValue.bank_account_no}
                onChangeText={(text) =>
                  setInputsValue((prev) => ({
                    ...prev,
                    bank_account_no: text,
                  }))}
                placeholder="Account Number"
                label="Account Number"
                type={'numeric'}
              />
  
               <CustomTextInput
                value={inputsValue.password}
                onChangeText={(text) =>
                  setInputsValue((prev) => ({ ...prev, password: text }))}
                placeholder="Password"
                label="Password"
                type={'default'}
                secureTextEntry={true}
              />
        
            <View>
              <Link
                href="/resetPassword"
                style={{
                  textAlign: "right",
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#1a237e",
                }}
              >
                Forgot your password?
              </Link>
            </View>
          </View>
          {/* <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleSubmit();
            }}
          >
            <Text style={styles.textButton}>Login</Text>
          </TouchableOpacity> */}
          <CustomButton text="Login" key={"login"} handlePress={handleSubmit} />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 6,
              marginTop: 20,
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 16 }}>
              Don't have an account?
            </Text>

            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  color: "#1a237e",
                  fontWeight: "700",
                }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F1F4FF",
    paddingLeft: 20,
    paddingRight: 10,
    borderRadius: 10,
    color: "black",
    fontSize: 14,
    fontWeight: "semibold",
  },
  button: {
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#1a237e",
    borderRadius: 10,
  },
  textButton: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
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
});
