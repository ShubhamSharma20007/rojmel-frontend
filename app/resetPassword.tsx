import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import {
  forgetPasswordApi,
  resetPasswordApi,
} from "@/helper/api-communication";
import Toast from "react-native-toast-message";
import send from "@expo/vector-icons/Feather";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";

const windowWidth = Dimensions.get("window").width;
const Reset = () => {
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [otp, setOtp] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // For button loading state
  const router = useRouter();
  const handleForgetPassword = async () => {
    setLoading(true);
    const request = await forgetPasswordApi(email);
    console.log(request);

    if (request.data && request.statusCode === 200) {
      setOtp(true);
      setLoading(false);
    } else {
      console.log("Request failed");
    }
    if (!request) {
      setLoading(false);
    }
  };

  // validation of password and confirm password
  const validation = (password: string, confirmPassword: string) => {
    if (password.trim() !== confirmPassword.trim()) {
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2Style: {
          fontSize: 12,
        },
        text2: "Password ConfirmPassword does not match.",
      });
      return false;
    } else if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2Style: {
          fontSize: 12,
        },
        text2: "Passoword should be atleast 6 characters.",
      });
      return false;
    }
    return true;
  };
  const handleResetPassword = async () => {
    const cond = validation(newPassword, confirmPassword);
    console.log(cond, 12);
    if (validation(newPassword, confirmPassword)) {
      const request = await resetPasswordApi(email, otpValue, newPassword);
      console.log(request);
      if (request.statusCode === 200) {
        Toast.show({
          type: "success",
          text1: "✅ Success",
          text2Style: {
            fontSize: 12,
          },
          text2: "Password reset successfully",
        });

        router.push("/");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address to reset your password
          </Text>

          <View>
            <TextInput
              style={styles.input}
              placeholder="Enter your registered email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#666"
              editable={!otp}
            />

            {/* Password container */}
            {otp && (
              <>
                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,

                    marginBottom: 15,
                  }}
                >
                  <TextInput
                    style={[
                      styles.input,
                      {
                        flex: 1,
                        marginBottom: 0,
                      },
                    ]}
                    placeholder="Enter the OTP"
                    value={otpValue}
                    onChangeText={setOtpValue}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor="#666"
                  />
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                      height: 50,
                      display: "flex",
                      flexDirection: "row",
                      backgroundColor: "#1a237e",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 10,
                      gap: 10,
                      paddingHorizontal: 10,
                    }}
                  >
                    {/* <Feather name="send" size={20} color="white" /> */}
                    <Text
                      style={{
                        color: "white",
                      }}
                    >
                      Resend OTP
                    </Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="New Password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#666"
                  secureTextEntry
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#666"
                  secureTextEntry
                />
              </>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              (loading ||
                (!otp && email.trim() === "") ||
                (otp && otpValue.trim() === "")) &&
                styles.disabledButton,
            ]}
            onPress={!otp ? handleForgetPassword : handleResetPassword}
            activeOpacity={0.8}
            disabled={
              loading ||
              (!otp && email.trim() === "") ||
              (otp && otpValue.trim() === "")
            }
          >
            {loading ? (
              <ActivityIndicator color={"white"} />
            ) : (
              <Text style={styles.textButton}>
                {otp ? "Reset Password" : "Send OTP"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: Math.min(windowWidth - 40, 400),
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3, // for Android shadow
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  formContainer: {
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1a237e",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    marginBottom: 15,
    backgroundColor: "#F1F4FF",
    paddingLeft: 20,
    paddingRight: 10,
    borderRadius: 10,
    fontSize: 16,
    fontWeight: "semibold",
  },
  button: {
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    backgroundColor: "#1a237e",
    borderRadius: 10,
  },
  textButton: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
});

export default Reset;
