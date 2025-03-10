import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AndroidSafeArea } from '@/helper/AndroidSafeArea';
import { createSubscriptionOrder, getSubscriptionList} from '@/helper/api-communication';
import CustomButton from './customButton';
import Toast from 'react-native-toast-message';
import RazorpayCheckout from 'react-native-razorpay';
import { getLocalStorage } from '@/helper/asyncStorage';
interface listType {
  type: string;
  price: string;
  features: PlanFeature[];
  reports: PlanFeature[];
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
      { title: 'Add Heads' },
      { title: 'Create Payments' },
      { title: 'Download Reports' },
    ],
    reports : [
      { title: "કેશબુક રિપોર્ટ્" },
      { title: "પરિશિષ્ટ-૯ રિપોર્ટ્" },
      { title: "પરિશિષ્ટ-૧૦ રિપોર્ટ્" },
      { title: "ખાતાવહી રિપોર્ટ્" },
      { title: "બિલ રજિસ્ટર રિપોર્ટ્" },
      { title: "ગ્રાન્ટ રજિસ્ટર રિપોર્ટ્" },
      { title: "ચેક રજિસ્ટર રિપોર્ટ્" },
    ]
  },
  {
    type: 'Basic',
    price: '₹343',
    features: [
      { title: 'Add Heads' },
      { title: 'Create Payments' },
      { title: 'Download Reports' },
    ],
    reports : [
      { title: "કેશબુક રિપોર્ટ્" },
      { title: "પરિશિષ્ટ-૯ રિપોર્ટ્" },
      { title: "પરિશિષ્ટ-૧૦ રિપોર્ટ્" },
      { title: "ખાતાવહી રિપોર્ટ્" },
      { title: "બિલ રજિસ્ટર રિપોર્ટ્" },
      { title: "ગ્રાન્ટ રજિસ્ટર રિપોર્ટ્" },
      { title: "ચેક રજિસ્ટર રિપોર્ટ્" },
    ]
  },
  {
    type: 'Premium',
    price: '₹2344',
    features: [
      { title: 'Add Heads' },
      { title: 'Create Payments' },
      { title: 'Download Reports' },
    ],
    reports : [
      { title: "કેશબુક રિપોર્ટ્" },
      { title: "પરિશિષ્ટ-૯ રિપોર્ટ્" },
      { title: "પરિશિષ્ટ-૧૦ રિપોર્ટ્" },
      { title: "ખાતાવહી રિપોર્ટ્" },
      { title: "બિલ રજિસ્ટર રિપોર્ટ્" },
      { title: "ગ્રાન્ટ રજિસ્ટર રિપોર્ટ્" },
      { title: "ચેક રજિસ્ટર રિપોર્ટ્" },
    ]
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
    const userId = await getLocalStorage('user_id');
    const orderCreate = await createSubscriptionOrder(subscriptionPlans[selectedPlan]?._id)
    console.log({userId, orderCreate:orderCreate.data.orderId})
    try {
      const options = {
        description: 'Payment for services',
        image: 'https://your-app-logo.png',
        currency: 'INR',
        key: RAZORPAY_KEY,
        amount: orderCreate.data.amount,
        name: 'Rojmel',
        order_id:orderCreate.data.orderId,
        // prefill: {
        //   email: 'shubhamsharma20007@gmail.com',
        //   contact: '7073830702',
        //   name: 'Shubham Sharma'
        // },
        notes: {
          user_id: userId,
          subscriptionId:subscriptionPlans[selectedPlan]?._id
        },
        theme: { color: '#1a237e' },
      };
      const data = await RazorpayCheckout.open(options as any);
      if (data.razorpay_payment_id) {
      // await paymentAuthorization(data.razorpay_payment_id, amount)
     return router.push('/(tabs)/home')
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
        <Text style={styles.titleText}>તમારી યોજના પસંદ કરો</Text>
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
                plan.plan_name}</Text>
              </View>
              ) :(
                <View style={styles.emptydiscountBadge}>
                  <Text style={styles.discountText}></Text>
                </View>
              )}
              <Text style={styles.monthsText}>₹{plan.amount}</Text>
              <Text style={styles.monthsLabelText}>યોજના</Text>
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
      <CustomButton customStyle={styles.subscribeButton} text={`ખરીદી કરો`} handlePress={async()=>{
       await handlePayment(subscriptionPlans[selectedPlan]?.amount)
      }}/>
        
        {/* Billing Info */}
        <View style={styles.billingInfoContainer}>
          <Text style={[styles.sectionTitle,{marginBottom:5, fontSize:17}]}>અમે શું પ્રદાન કરીશું</Text>

          <View>
        {/* {ReportLists[selectedPlan]?.features
          .map((feature, index,array) => (
            <View>
              <Text key={index} style={[styles.sectionTitle,{fontWeight:'400'}]}>
              {'✔ '} {feature.title}{index < array.length -1 ? '\n' :''}
              </Text>
            </View>
          ))} */}
        </View>
          <View>
          </View>
          {/* Reports Section */}
        {ReportLists[selectedPlan]?.reports?.length ? (
          <>
            {ReportLists[selectedPlan]?.reports?.map((report, index) => (
              <View key={`report-${index}`} style={[styles.listItem,{paddingLeft:8}]}>
                <Text style={styles.listText}>{'✔ '} {report.title}</Text>
              </View>
            ))}
          </>
        ) : null}

        
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
    justifyContent:'center',
    gap : 20,
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
    alignSelf: 'center',  // Centers the container itself
    width: '50%',  // Adjust width as needed
    padding: 10,  
    borderRadius: 10,  
  },
  billingQuestion: {
    fontSize: 16,
    fontWeight: '100',
    color: '#333',
    textAlign:'center',
    marginBottom: 8,
  },
  billingExplanation: {
    fontSize: 14,
    color: '#666',
    fontWeight:500,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  listItem: {
    padding: 2,
    borderRadius: 8,
    marginVertical: 3,
  },
  listText: {
    fontSize: 14,
    color: '#555',
  },
});

export default PremiumSubscription;