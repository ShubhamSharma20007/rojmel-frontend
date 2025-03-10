import { router, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CustomerContextProvide } from "./context/customerContext";
import { StripeProvider } from '@stripe/stripe-react-native';
export const unstable_settings = {
  initialRouteName: "/(tabs)/home",
};
import { jwtDecode } from "jwt-decode";
import Toast from "react-native-toast-message";
import { getLocalStorage } from "@/helper/asyncStorage";
import { useEffect, useReducer, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getHeads } from "@/helper/api-communication";
import { StatusBar } from "expo-status-bar";
import { EditIdContextProvider } from "./context/editIdContext";

export default function Layout() {
  const router = useRouter();
  const [isLoading,setIsLoading] = useState<boolean >(true)
  const __AuthVerify = async () => {
    
    try {
      const token = await getLocalStorage("auth_token");
      
      if (!token){
        return false
      };
  
      const decoded: any = jwtDecode(token);
      const isExpired = new Date(decoded.exp * 1000).getTime() < Date.now();
      setIsLoading(false)
      return !isExpired;
    } catch (error: any) {
      console.error("Token verification error:", error);
      setIsLoading(false)
      return false;
    }
  };
  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await __AuthVerify();
      if(authStatus){
        return  router.push("/(tabs)/home")
      }
    };
    checkAuth();
  }, []);

  
  return (
  <>
  
    <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLIC || ''}>
    <EditIdContextProvider>
    <CustomerContextProvide>
      {/* <StatusBar style="light"  backgroundColor="transparent"  translucent/> */}
      <GestureHandlerRootView
        style={{
          flex: 1,
        }}
      >
        <StatusBar translucent style="light"/>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="/components/subscription"/>
          <Stack.Screen name="/components/updateUserProfile"/>
          <Stack.Screen name="/components/premiumSubscription"/>
         
          <Stack.Screen name="register" />
          <Stack.Screen name="addPaymentForm" />
          <Stack.Screen
            name="personAddForm"
            options={{
              headerShown: true,
              presentation: "modal",
              animation: "slide_from_bottom", 
              animationDuration: 400, 
            }}
          />
          <Stack.Screen
            name="resetPassword"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              animationDuration: 400,
              title: "Reset Password",
              headerTitleStyle: {
                color: "#1a237e",
              },
            }}
          />
        </Stack>
        <Toast />
      </GestureHandlerRootView>
    </CustomerContextProvide>
    </EditIdContextProvider>
    </StripeProvider></>
  );
}
