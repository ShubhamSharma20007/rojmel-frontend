import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AndroidSafeArea } from '@/helper/AndroidSafeArea';
import { createSubscriptionOrder, getSubscriptionList } from '@/helper/api-communication';
import CustomButton from './customButton';
import Toast from 'react-native-toast-message';
import RazorpayCheckout from 'react-native-razorpay';

interface listType {
  type: string;
  price: string;
  features: PlanFeature[];
  isSelected?: boolean;
}

interface PlanFeature {
  title: string;
}

const ReportLists: listType[] = [
  {
    type: 'Basic',
    price: '₹343',
    features: [
      { title: 'Enteries' },
    ],
  },
  {
    type: 'Basic',
    price: '₹343',
    features: [
      { title: 'Ads Free' },
      { title: 'Weekly Updates' },
      { title: 'Enteries' },
    ],
  },
  {
    type: 'Premium',
    price: '₹2344',
    features: [
      { title: 'Cashbook' },
      { title: 'Appendix9' },
      { title: 'Appendix10' },
      { title: 'Khatavahi' },
      { title: 'Billregister' },
      { title: 'Grantregister' },
      { title: 'Chequeregister' },
    ],
  },
];

const PremiumSubscription = () => {
  const [selectedPlan, setSelectedPlan] = useState<number>(0); // Default to 3 months
  const [subscriptionPlans,setSubscriptionPlans] = useState<any[]>([]);


  // fetch subscription list
  useEffect(()=>{
    (async()=>{
      try {
        const subscriptionList = await getSubscriptionList();
        const {data} = subscriptionList;
        if(data && data.length >0){
        setSubscriptionPlans(data)
        }
      } catch (error) {
        console.log(error)
      }
    })()
  },[])




  const handleGoBack = () => {
    router.back();
  };

  const handleSelectPlan = (months: number) => {
    setSelectedPlan(months);
  };



  const RAZORPAY_KEY = 'rzp_test_GLComtpgG1StCu';

  const handlePayment = async (amount: number) => {
    try {
      const options = {
        description: 'Payment for services',
        image: 'https://your-app-logo.png',
        currency: 'INR',
        key: RAZORPAY_KEY,
        amount: amount, // Convert to paise
        name: 'Rojmel Store',
        prefill: {
          email: 'shubhamsharma20007@gmail.com',
          contact: '7073830702',
          name: 'Shubham Sharma'
        },
        theme: { color: '#1a237e' },
      };
      const data = await RazorpayCheckout.open(options as any);
      if (data.razorpay_payment_id) {
        try {
          const res = await createSubscriptionOrder(subscriptionPlans[selectedPlan]?._id);
          console.log('Order Created:', res);
        } catch (err) {
          console.error('Order Creation Failed:', err);
        }
      }
    } catch (error: any) {
      console.error('Payment Error:', error);
     
    }
  };


  return (
   <AndroidSafeArea>
 <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={24} color="#1a237e" />
        </TouchableOpacity>
        
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.rocketIconContainer}>
            <Ionicons name="rocket" size={32} color="white" />
          </View>
          {/* Use a simple View with styling instead of an Image that requires import */}
          <View style={styles.heroImagePlaceholder}>
            <Ionicons name="person" size={100} color="#1a237e" />
          </View>
        </View>
        
        {/* Title Section */}
        <Text style={styles.titleText}>Subscription Plan's</Text>
        <Text style={styles.subtitleText}> {
          subscriptionPlans[selectedPlan]?.description
        }</Text>
       
        {/* Subscription Plans */}
        <View style={styles.plansContainer}>
          {subscriptionPlans && subscriptionPlans.map((plan,idx) =>{
            return(
              <TouchableOpacity
              key={idx}
              style={[
                styles.planCard,
                selectedPlan === idx && styles.selectedPlanCard
              ]}
              onPress={() => handleSelectPlan(idx)}
            >
              {plan.amount > 0 ? (
                <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{
                plan.plan_name=== "Premium Plan" ? 'Premium' :'Basic '}</Text>
              </View>
              ) :(
                <View style={styles.emptydiscountBadge}>
                  <Text style={styles.discountText}></Text>
                </View>
              )}
              <Text style={styles.monthsText}>₹{plan.amount}</Text>
              <Text style={styles.monthsLabelText}> Per Year</Text>
              {/* <Text style={styles.priceText}>₹{plan.amount}/mt</Text> */}
            </TouchableOpacity>
            )
          }
         
          )}
        </View>
        
        {/* Subscribe Button */}
        {/* <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
        <Text style={styles.subscribeButtonText}>
  Get the {subscriptionPlans[selectedPlan]?.plan_name === "Premium Plan" ? "Premium Plan" : "Basic Plan"} for ₹{subscriptionPlans[selectedPlan]?.amount}
</Text>

        </TouchableOpacity> */}
      <CustomButton customStyle={styles.subscribeButton} text={` Get the ${subscriptionPlans[selectedPlan]?.plan_name === "Premium Plan" ? "Premium Plan" : "Basic Plan"} for ₹ ${subscriptionPlans[selectedPlan]?.amount}`} handlePress={async()=>{
       await handlePayment(subscriptionPlans[selectedPlan]?.amount)
      }}/>
        
        {/* Billing Info */}
        <View style={styles.billingInfoContainer}>
          <Text style={styles.billingQuestion}>What We Will Provide</Text>
          <Text style={styles.billingExplanation}>
        {ReportLists[selectedPlan]?.features
          .map((feature, index,array) => (
            <Text key={index}>
              {feature.title}{index < array.length -1 ? ', ' :''}
            </Text>
          ))}
        </Text>

        
        </View>
      </ScrollView>
   </AndroidSafeArea>
  );
};

const styles = StyleSheet.create({
 
  scrollContainer: {
    padding: 15,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  rocketIconContainer: {
    position: 'absolute',
    top: 10,
    right: '30%',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1a237e',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  heroImagePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#f5f5ff',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitleText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  plansContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  planCard: {
    width: '30%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedPlanCard: {
    borderColor: '#1a237e',
    borderWidth: 2,
    backgroundColor: '#f5f5ff',
  },
  discountBadge: {
    backgroundColor: '#1a237e',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  emptydiscountBadge:{
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  discountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  monthsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  monthsLabelText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  subscribeButton: {
    backgroundColor: '#1a237e',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  subscribeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  billingInfoContainer: {
    marginBottom: 20,

  },
  billingQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign:'center',
    marginBottom: 8,
  },
  billingExplanation: {
    fontSize: 14,
    color: '#666',
    fontWeight:'500',
    marginBottom: 20,
    lineHeight: 20,
        textAlign:'center'
  },
});

export default PremiumSubscription;