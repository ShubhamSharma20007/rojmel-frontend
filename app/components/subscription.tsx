import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "./customButton";
import Header from "./header";
import { router } from "expo-router";
import {
  getSubscriptionList,
  createSubscriptionOrder,
} from "@/helper/api-communication";
import { currency } from "@/helper/currency";
import RazorpayCheckout from "react-native-razorpay";
import { getLocalStorage } from "@/helper/asyncStorage";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";

interface SubscriptionPlan {
  _id: string;
  plan_name: string;
  description: string;
  type: string;
  amount: number;
  isPurchased: boolean;
}

interface plan {
  _id: string;
}

const reports = [
  { title: "કેશબુક" },
  { title: "પરિશિષ્ટ-૯" },
  { title: "પરિશિષ્ટ-૧૦" },
  { title: "ખાતાવહી" },
  { title: "બિલ રજિસ્ટર" },
  { title: "ગ્રાન્ટ રજિસ્ટર" },
  { title: "ચેક રજિસ્ટર" },
];

const Subscription = () => {
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);

  useEffect(() => {
    (async () => {
      try {
        const storedSubscriptionId = await getLocalStorage("subscription_id");
        console.log("Stored Subscription ID:", storedSubscriptionId);

        if (!storedSubscriptionId) {
          console.warn("No subscription ID found in local storage.");
          return;
        }
        setSubscriptionId(storedSubscriptionId);

        const subscriptionList = await getSubscriptionList();
        const { data } = subscriptionList;

        if (data && data.length > 0) {
          let matchedPlan = data.find(
            (plan: any) => plan._id === storedSubscriptionId
          );
          let purchasedPlan = data.find((plan: any) => plan.isPurchased);
          let sortedPlans = [...data];

          if (matchedPlan) {
            setSelectedPlan(matchedPlan._id);
            sortedPlans = [
              matchedPlan,
              ...data.filter((plan: any) => plan._id !== matchedPlan._id),
            ];
          } else if (purchasedPlan) {
            setSelectedPlan(purchasedPlan._id);
            sortedPlans = [
              purchasedPlan,
              ...data.filter((plan: any) => plan._id !== purchasedPlan._id),
            ];
          } else {
            // Default to the first available plan if no match found
            setSelectedPlan(data[0]._id);
          }

          setSubscriptionPlans(sortedPlans);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const RAZORPAY_KEY = "rzp_test_GLComtpgG1StCu";

  const handlePayment = async (planId: string) => {
    try {
      const userId = await getLocalStorage("user_id");
      const orderCreate = await createSubscriptionOrder(planId);
      const options = {
        description: "Payment for services",
        image: "https://your-app-logo.png",
        currency: "INR",
        key: RAZORPAY_KEY,
        amount: orderCreate.data.amount,
        name: "Rojmel",
        order_id: orderCreate.data.orderId,
        notes: {
          user_id: userId,
          subscriptionId: planId,
        },
        theme: { color: "#1a237e" },
      };

      const data = await RazorpayCheckout.open(options as any);
      if (data.razorpay_payment_id) {
        return router.push("/(tabs)/home");
      }
    } catch (error: any) {
      console.error("Payment Error:", error);
    }
  };

  return (
    <>
      <Header title="યોજનાઓ" iconName="arrow-back" backPath />

      <ScrollView style={styles.container}>
        {subscriptionPlans.map((plan) => (
          <TouchableOpacity
            key={plan._id}
            style={[
              styles.planCard,
              selectedPlan === plan._id && styles.selectedPlanCard,
            ]}
            onPress={() => setSelectedPlan(plan._id)}
            disabled={plan.isPurchased}
          >
            {plan.isPurchased && (
              <View style={styles.selectedTag}>
                <Text style={styles.selectedText}>ખરીદેલ યોજના</Text>
              </View>
            )}

            <View style={styles.planHeader}>
              <View>
                <Text style={styles.planType}>{plan.description}</Text>
                <Text>{plan.plan_name}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Text style={styles.planPrice}>{currency(plan.amount)}</Text>

                {!plan.isPurchased ? (
                  <View
                    style={{
                      width: "50%",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                  >
                    <CustomButton
                      text="ખરીદી કરો"
                      handlePress={() => handlePayment(plan._id)}
                      customStyle={{ backgroundColor: "#1a237e", padding: 10 }}
                    />
                  </View>
                ) : (
                  selectedPlan === plan._id && ( // ✅ Show only for selected purchased plan
                    <View
                      style={{
                        width: "50%",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                      }}
                    >
                      <CustomButton
                        text="હાલની યોજના"
                        handlePress={async () => {}}
                        customStyle={{
                          backgroundColor: "#3f51b5",
                          padding: 10,
                        }}
                        isDisabled={true}
                      />
                    </View>
                  )
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
};

export default Subscription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  planCard: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    position: "relative",
  },
  selectedPlanCard: {
    borderColor: "#1a237e",
    borderWidth: 2,
    backgroundColor: "#f5f5ff",
  },
  planHeader: {
    marginBottom: 0,
    paddingBottom: 0,
    // borderBottomWidth: 1,
    // borderBottomColor: '#E0E0E0',
    // paddingBottom: 8,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  planType: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a237e",
  },
  planPrice: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  selectedTag: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#1a237e",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  selectedText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
