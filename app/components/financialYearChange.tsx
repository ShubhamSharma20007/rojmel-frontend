import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from './header';
import { getFinancialYears, updateFinancialYear } from '@/helper/api-communication';
import { Picker } from '@react-native-picker/picker';
import { getLocalStorage, setLocalStorage } from '@/helper/asyncStorage';
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

interface FinancialYear {
  _id: string;
  plan_name: string;
}


const FinancialYearSelection = () => {
  const router = useRouter();
  const [financialYears, setFinancialYears] = useState<FinancialYear[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await getFinancialYears();
        const { data } = response;
        if (data && data.length > 0) {
          setFinancialYears(data);
          setSelectedYear(data[0]._id); // Default to first year
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleUpdate = async () => {
    if (!selectedYear) return;
    try {
      const user_id = await getLocalStorage('user_id');
      const respopnse = await updateFinancialYear(user_id!, selectedYear);
      Toast.show({
        visibilityTime: 1000,
        type: "success",
        text1: "✅ Success",
        text2: (respopnse.message),
        text2Style: { fontSize: 12 },
        onHide: async () => {
          router.back();
        },
      });
      await setLocalStorage('subscription_id', selectedYear);
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
      <Header title="વિત્તીય વર્ષ પસંદ કરો" iconName="arrow-back" backPath />
      
      <ScrollView style={styles.container}>
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>વિત્તીય વર્ષ:</Text>
          <Picker
            selectedValue={selectedYear}
            onValueChange={(itemValue) => setSelectedYear(itemValue)}
            style={styles.picker}
          >
            {financialYears.map((year) => (
              <Picker.Item key={year._id} label={year.plan_name} value={year._id} />
            ))}
          </Picker>
        <TouchableOpacity
          style={[styles.addButton,{backgroundColor:financialYears?.length == 1 ?'#ccc' :'#1a237e'  }]}
          onPress={handleUpdate}
          disabled={financialYears?.length == 1}
        >
          <Text style={styles.addButtonText}>CHANGE FINANCIAL YEAR</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

export default FinancialYearSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  dropdownContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  addButton: {
    backgroundColor: "#1a237e",
    margin: 10,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
