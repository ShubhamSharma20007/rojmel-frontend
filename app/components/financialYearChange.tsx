import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from './header';
import { getFinancialYears, updateFinancialYear } from '@/helper/api-communication';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import { getLocalStorage, setLocalStorage } from '@/helper/asyncStorage';
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

// Define financial year interface
interface FinancialYear {
  _id: string;
  plan_name: string;
}

// Explicitly define ValueType
type ValueType = string;

const FinancialYearSelection: React.FC = () => {
  const router = useRouter();
  const [financialYears, setFinancialYears] = useState<FinancialYear[]>([]);
  const [selectedYear, setSelectedYear] = useState<ValueType | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  // Explicitly define items type
  const [items, setItems] = useState<ItemType<ValueType>[]>([
    { label: "નાણાકીય વર્ષ પસંદ કરો", value: "" as ValueType, disabled: true }
  ]);

  useEffect(() => {
    (async () => {
      try {
        const response = await getFinancialYears();
        const { data } = response;
        if (data && data.length > 0) {
          setFinancialYears(data);
          setItems([
            { label: "નાણાકીય વર્ષ પસંદ કરો", value: "" as ValueType, disabled: true },
            ...data.map((year:any) => ({ label: year.plan_name, value: year._id as ValueType }))
          ]);
        }
      } catch (error) {
        console.error("Error fetching financial years:", error);
      }
    })();
  }, []);

  const handleUpdate = async () => {
    if (!selectedYear) return;
    try {
      const user_id = await getLocalStorage('user_id');
      const response = await updateFinancialYear(user_id!, selectedYear);

      Toast.show({
        visibilityTime: 1000,
        type: "success",
        text1: "✅ સફળતા",
        text2: response.message,
        text2Style: { fontSize: 12 },
        onHide: () => router.back(),
      });

      await setLocalStorage('subscription_id', selectedYear);
      const findPlan = financialYears.find((plan) => plan._id.toString() === selectedYear.toString());
      const handleYear = findPlan?.plan_name.split(" ")[1];
      await setLocalStorage('yearPlan', JSON.stringify(handleYear));
    } catch (err: any) {
      console.error("Error updating financial year:", err);
      Toast.show({
        type: "error",
        text1: "❌ ભૂલ",
        text2: err.response?.data?.message || err?.message,
        text2Style: { fontSize: 12 },
      });
    }
  };

  return (
    <>
      <Header title="નાણાકીય વર્ષ પસંદ કરો" iconName="arrow-back" backPath />
      
      <ScrollView style={styles.container}>
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>નાણાકીય વર્ષ:</Text>
          <DropDownPicker
            open={open}
            value={selectedYear || ""}
            items={items}
            setOpen={setOpen}
            setValue={setSelectedYear}
            setItems={setItems}
            placeholder="નાણાકીય વર્ષ પસંદ કરો"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainerStyle}
          />
          
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: selectedYear ? '#1a237e' : '#ccc' }
            ]}
            onPress={handleUpdate}
            disabled={!selectedYear}
          >
            <Text style={styles.addButtonText}>સાચવો</Text>
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
    marginTop: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#d1d9ff',
    borderRadius: 5,
    backgroundColor: '#F1F4FF',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#d1d9ff',
    borderRadius: 4,
    backgroundColor: '#F1F4FF',
  },
  dropdownContainerStyle: {
    borderWidth: 1,
    borderColor: '#d1d9ff',
    backgroundColor: '#F1F4FF',
  },
  addButton: {
    backgroundColor: "#1a237e",
    marginTop: 10,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
