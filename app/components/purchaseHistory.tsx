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
      <Header title="ખરીદી ઇતિહાસ" iconName="arrow-back" backPath />

      <ScrollView style={styles.container}>
        <View style={styles.historyContainer}>
          <View style={styles.tableHeader}>
          <Text style={styles.tableColumn}>પ્લાનની ID</Text>
            <Text style={styles.tableColumn}>યોજનાનું નામ</Text>
            <Text style={styles.tableColumn}>વિગત</Text>
            <Text style={styles.tableColumn}>રકમ</Text>
          </View>
          {purchasedPlans.map((plan, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{plan.financial_year_id}</Text>
              <Text style={styles.tableCell}>{plan.plan_name}</Text>
              <Text style={styles.tableCell}>{plan.description}</Text>
              <Text style={styles.tableCell}>{currency(plan.amount)}</Text>
            </View>
          ))}
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
  },
  historyContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 5,
  },
  tableColumn: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center'
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center'
  },
});