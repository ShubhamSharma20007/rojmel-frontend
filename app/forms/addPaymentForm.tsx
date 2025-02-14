import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
// import { TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from '@/app/components/customButton';
import Toast from 'react-native-toast-message';
import DropDownPicker from 'react-native-dropdown-picker';
import { CustomTextInput } from '../components/customTextInput';
import { useCustomerContext } from '../context/customerContext';
import { TransactionFormData } from '../../types/TransactionFormType';
import { createLedger } from '@/helper/api-communication';
import Header from '../components/header';
import { useRouter } from 'expo-router';
interface RadioOption {
  label: string;
  value: string;
}

const RadioButton: React.FC<{
  selected: boolean;
  onPress: () => void;
  label: string;
}> = ({ selected, onPress, label }) => (
  <TouchableOpacity style={styles.radioButton} onPress={onPress}>
    <View style={styles.radioCircle}>
      {selected && <View style={styles.selectedRb} />}
    </View>
    <Text style={styles.radioLabel}>{label}</Text>
  </TouchableOpacity>
);

const TransactionForm: React.FC = () => {
  const router = useRouter()
    const [open, setOpen] = useState(false);
    const {customer} = useCustomerContext()
  const [items, setItems] = useState<{value:string,label:string}[]>([]);





  const [formData, setFormData] = useState<TransactionFormData>({
    transaction_date:'',
    head_id: '',
    amount: '',
    transaction_type: '',
    payment_method: '',
    details: '',
    cheque_number:'',
    cheque_pfms_clearing_date:''
    // documentNumber: '',
    // clearingDate: null,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showClearingDatePicker, setShowClearingDatePicker] = useState(false);

  const transactionTypes: RadioOption[] = [
    { label: 'In', value: 'IN' },
    { label: 'Out', value: 'OUT' },
  ];

  const paymentMethods: RadioOption[] = [
    { label: 'Cash', value: 'cash' },
    { label: 'Online', value: 'online' },
    { label: 'Cheque', value: 'cheque' },
  ];

  const handleChange = (name: keyof TransactionFormData, value: string | Date | null) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = {
      head_id: 'head_id',
      amount: 'amount',
      transaction_type: 'transaction_type',
      payment_method: 'payment_method',
      details: 'Descriptidetails'
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field as keyof TransactionFormData]) {
        Toast.show({
          type: "error",
          text1: "❌ Error",
          text2: `${label} is required`,
          text2Style: {
            fontSize: 12,
          },
        });
        return false;
      }
    }

    if (formData.amount && isNaN(Number(formData.amount))) {
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: "Amount must be a valid number",
        text2Style: {
          fontSize: 12,
        },
      });
      return false;
    }

    return true;
  };

 
 // append the head_name into items
    useEffect(()=>{
      setItems(()=>{
        return customer.map((item)=>{
          return {value:item._id,label:item.head_name}
        })
      })

    },[customer.length > 0])


  const handlePaymentForm = async () => {
    if (validateForm()) {
      console.log(formData)
      try {
        const response = await createLedger(formData)
        if(response?.statusCode ===201){
          Toast.show({
            type: "success",
            text1: "✅ Success",
            text2: "Payment added successfully",
            text2Style: {
              fontSize: 12,
            },
            onHide:()=>{
              router.back();
            }
          });
          setFormData({
            transaction_date: '',
            head_id: '',
            amount: '',
            transaction_type: '',
            payment_method: '',
            details: '',
            cheque_number:'',
            cheque_pfms_clearing_date:''
          })
        }
      } catch (err: any) {
        Toast.show({
          type: "error",
          text1: "❌ Error",
          text2: err.response?.data?.message || "An error occurred",
          text2Style: {
            fontSize: 12,
          },
        });
      }
    }
  };

   

  return (
    <View style={styles.container}>
    
    <Header title='Add Rojmel' backPath={true} iconName='arrow-back' />
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
  
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.secondaryContainer}>
          <TouchableOpacity 
            style={[styles.input,{
              flexDirection:'row',
              alignItems:'center',
             paddingLeft:10
            }]} 
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.dateText]}>
            {formData.transaction_date ? (formData.transaction_date as Date).toLocaleDateString() : 'Select Transaction Date'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={formData.transaction_date || new Date()}
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection:'row'
              }}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  handleChange('transaction_date', selectedDate);
                }
              }}
            />
          )}

       
<DropDownPicker
    open={open}
    value={formData.head_id}
    items={items}
    setOpen={setOpen}
    setValue={(callback: any) => {
      handleChange('head_id',callback(formData.head_id) );
    }}
    searchable={true}
    searchContainerStyle={{
      backgroundColor: "#F1F4FF",
      borderWidth:0,
      marginBottom: Platform.OS === 'ios' ? 10 : 0,
      borderColor: "#F1F4FF",
  
      
   }}
   style={[styles.input,{
    backgroundColor: "#F1F4FF",
    borderColor:'#d1d9ff',
    borderRadius: 4,
    borderWidth:1,
    height: 50,
   
   }]}
    setItems={setItems}
    placeholder="Select a Head Name"
  
  dropDownContainerStyle={{
    backgroundColor: "#F1F4FF",
    borderColor: "#d1d9ff",
    borderTopWidth: 0,
  }}
  searchTextInputStyle={{
    borderWidth:0
  }}
  searchPlaceholder='Search for a head name'


    listMode="SCROLLVIEW"
    scrollViewProps={{
      nestedScrollEnabled: true,
    }}
    zIndex={3000}
    zIndexInverse={1000}
  />


        

          <CustomTextInput
            value={formData.amount}
            onChangeText={(value) => handleChange('amount', value)}
            placeholder="Amount"
            label="Amount"
            type={'numeric'}
          />          
         

          <Text style={styles.label}>Transaction Type *</Text>
          <View style={styles.radioGroup}>
            {transactionTypes.map((type) => (
              <RadioButton
                key={type.value}
                selected={formData.transaction_type === type.value}
                onPress={() => handleChange('transaction_type', type.value)}
                label={type.label}
              />
            ))}
          </View>

          <Text style={styles.label}>Payment Method *</Text>
          <View style={styles.radioGroup}>
            {paymentMethods.map((method) => (
              <RadioButton
                key={method.value}
                selected={formData.payment_method === method.value}
                onPress={() => handleChange('payment_method', method.value)}
                label={method.label}
              />
            ))}
          </View>

      
        <CustomTextInput
            value={formData.details}
            onChangeText={(value) => handleChange('details', value)}
            placeholder="Description"
            label="Description"
            type={'default'}
            
          />        

      

        <CustomTextInput
            value={formData.cheque_number!}
            onChangeText={(value) => handleChange('cheque_number', value)}
            placeholder="Cheque/PFMS/Voucher No."
            label="Cheque/PFMS/Voucher No."
            type={'numeric'}
            
          />      

          <TouchableOpacity 
             style={[styles.input,{
              flexDirection:'row',
              alignItems:'center',
             paddingLeft:10
            }]} 
            onPress={() => setShowClearingDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {formData.cheque_pfms_clearing_date ? new Date(formData.cheque_pfms_clearing_date).toLocaleDateString() : 'Clearing Date'}
            </Text>
          </TouchableOpacity>
          {showClearingDatePicker && (
            <DateTimePicker
              value={formData.cheque_pfms_clearing_date || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowClearingDatePicker(false);
                if (selectedDate) {
                  handleChange('cheque_pfms_clearing_date', selectedDate);
                }
              }}
            />
          )}
        <CustomButton text='Submit' handlePress={handlePaymentForm}/>
        </View>
      </ScrollView>
      
    </KeyboardAvoidingView>
    <Toast />
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  secondaryContainer: {
    backgroundColor: "#fff",
    flex: 1,
    borderBottomColor: "#eee",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingBottom:20,
    paddingTop: 10,
  },
  descriptionInput:{
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
   
  },
  
  input: {
    width: "100%",
    borderWidth:1,
    height: 50,
    backgroundColor: "#F1F4FF",
    borderColor:'#d1d9ff',
    borderRadius: 4,
    paddingRight: 10,
    color: "black",
    fontSize: 14,
    marginBottom: 20,
    fontWeight: "500",
  },
  dateText: {
    color: 'black',
    fontSize: 14,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 8,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1a237e',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1a237e',
  },
  radioLabel: {
    fontSize: 14,
    color: '#000',
  },
 
 
});

export default TransactionForm;