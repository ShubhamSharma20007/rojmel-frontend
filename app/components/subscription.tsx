import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import CustomButton from './customButton';
import Header from './header';

interface PlanFeature {
  title: string;
}

interface SubscriptionPlan {
  type: string;
  price: string;
  features: PlanFeature[];
  isSelected?: boolean;
}

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('Basic');

  const subscriptionPlans: SubscriptionPlan[] = [
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

  const handleSelectPlan = (planType: string) => {
    setSelectedPlan(planType);
  };

  return (
    <>
      <Header title='Select Your Plan' iconName='cart-outline'  key={'header'}/>
      <ScrollView style={styles.container}>
        {subscriptionPlans.map((plan) => (
          <TouchableOpacity
            key={plan.type}
            style={[
              styles.planCard,
              selectedPlan === plan.type && styles.selectedPlanCard,
            ]}
            onPress={() => handleSelectPlan(plan.type)}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planType}>{plan.type}</Text>
              <Text style={styles.planPrice}>{plan.price}<Text style={styles.perMonth}> / Month</Text></Text>
            </View>
            
            <View style={styles.featuresContainer}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <View style={styles.bullet} />
                  <Text style={styles.featureText}>{feature.title}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.buttonContainer}>
          <CustomButton 
            text='Subscribe' 
            key={'button'} 
            handlePress={async()=>{}}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default Subscription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1a237e',
    marginRight: 8,
  },
  planCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedPlanCard: {
    borderColor: '#1a237e',
    borderWidth: 2,
    backgroundColor: '#f5f5ff',
  },
  planHeader: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 12,
  },
  planType: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    color: '#1a237e',
  },
  planPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  perMonth: {
    fontSize: 14,
    color: '#666',
  },
  featuresContainer: {
    marginTop: 16,
  
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
    color: 'black',
    fontWeight: '500',
  },
  buttonContainer: {
    marginBottom: 20,
  },
});