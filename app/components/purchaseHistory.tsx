import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from './header';
import { getPurchaseHistory } from '@/helper/api-communication';
import { currency } from '@/helper/currency';

interface PurchasedPlans {
  financial_year_id: string;
  plan_name: string;
  description: string;
  amount: number;
  isPurchased: boolean;
}

const PurchaseHistory = () => {
  const [purchasedPlans, setPurchasedPlans] = useState<PurchasedPlans[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const purchaseHistory = await getPurchaseHistory();
        const { data } = purchaseHistory;
        if (data && data.length > 0) {
          setPurchasedPlans(data);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <>
      <Header title="બિલિંગ ઇતિહાસ" iconName="arrow-back" backPath />

      <ScrollView style={styles.container}>
        <View style={styles.historyContainer}>
          {purchasedPlans.length > 0 ? (
            purchasedPlans.map((plan, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.planName}>{plan.plan_name}</Text>
                  <Text style={styles.amount}>{currency(plan.amount)}</Text>
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>પ્લાનની ID:</Text>
                    <Text style={styles.infoValue}>{plan.financial_year_id}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>વિગત:</Text>
                    <Text style={styles.infoValue}>{plan.description}</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>કોઈ ખરીદી ઇતિહાસ મળ્યો નથી</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default PurchaseHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  historyContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  planName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  cardContent: {
    marginTop: 5,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    width: '35%',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    width: '65%',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});