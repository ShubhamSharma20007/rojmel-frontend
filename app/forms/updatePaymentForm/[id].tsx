import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { TextInput } from "react-native-paper";
// import { TextInput } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomButton from "@/app/components/customButton";
import Toast from "react-native-toast-message";
import DropDownPicker from "react-native-dropdown-picker";
import { CustomTextInput } from "@/app/components/customTextInput";
import { useCustomerContext } from "@/app/context/customerContext";
import { TransactionFormData } from "@/types/TransactionFormType";
import {
  createLedger,
  deleteLedgerById,
  getLedgerById,
  updateLedgerById,
} from "@/helper/api-communication";
import Header from "@/app/components/header";
import { router, useLocalSearchParams } from "expo-router";
import { getLocalStorage } from "@/helper/asyncStorage";
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

const UpdateTransactionForm: React.FC = () => {
  const { id } = useLocalSearchParams();
  const [open, setOpen] = useState(false);
  const [isDisbale, setIsDisabled] = useState(false);
  const [isCheckPFMS, setIsCheckPFMS] = useState(true);
  const { customer } = useCustomerContext();
  const [items, setItems] = useState<{ value: string; label: string }[]>([]);
  const [transType,setTranType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [formData, setFormData] = useState<TransactionFormData>({
    transaction_date: "",
    head_id: "",
    amount: "",
    transaction_type: "",
    payment_method: "",
    details: "",
    cheque_number: "",
    cheque_pfms_clearing_date: "",
  });

 
  // fetch ledger data from API
  useEffect(() => {
    (async () => {
      const request = await getLedgerById(id as string);
      if (request.statusCode === 200) {
        try {
          setFormData({
            head_id: request.data.head_id._id || "",
            amount: request.data.amount || "",
            transaction_type: request.data.transaction_type || "",
            transaction_date: request.data.transaction_date || "",
            payment_method: request.data.payment_method || "",
            details: request.data.details || "",
            cheque_number: request.data?.cheque_number || "",
            cheque_pfms_clearing_date:
              request.data.cheque_pfms_clearing_date || "",
          });
        } catch (error) {
          console.log(error as any);
        }finally{
    
            setPaymentMethod(request.data.payment_method )
            setTranType(request.data.transaction_type)
          
        }
      } else {
        console.log(request.message);
      }
    })();
  }, [id]);


  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showClearingDatePicker, setShowClearingDatePicker] = useState(false);
  const [currentPlan,setCurrentPlan] = useState<string[]>([])

  const transactionTypes: RadioOption[] = [
    { label: "આવક", value: "IN" },
    { label: "જાવક", value: "OUT" },
  ];

  const paymentMethods: RadioOption[] = [
    { label: "રોકડ", value: "cash" },
    { label: "ઓનલાઈન/બેંક", value: "online" },
    { label: "ચેક/PFMS", value: "cheque" },
  ];

  const handleChange = (
    name: keyof TransactionFormData,
    value: string | Date | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = {
      head_id: "head_id",
      amount: "amount",
      transaction_type: "transaction_type",
      payment_method: "payment_method",
      details: "Descriptidetails",
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field as keyof TransactionFormData]) {
        Toast.show({
          type: "error",
          text1: "❌ ભૂલ",
          text2: `${label} આવશ્યક છે`,
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
        text1: "❌ ભૂલ",
        text2: "રકમ માન્ય નંબર હોવી જોઈએ",
        text2Style: {
          fontSize: 12,
        },
      });
      return false;
    }
    
    return true;    
  };

  // append the head_name into items
  useEffect(() => {
    setItems(() => {
      return customer.map((item) => {
        return { value: item._id, label: item.head_name };
      });
    });
  }, [customer.length > 0]);

  // update the form
  const updatePayment = async () => {
    if (validateForm()) {
      try {
        const response = await updateLedgerById(id as string, formData);
        if (response?.statusCode === 201 || response?.statusCode === 200) {
          Toast.show({
            type: "success",
            text1: "✅ સફળતા",
            text2: response?.message,
            text2Style: {
              fontSize: 12,
            },
            onHide: () => {
              router.back();
            },
          });
        }
      } catch (err: any) {
        Toast.show({
          type: "error",
          text1: "❌ ભૂલ",
          text2:
            err.response?.data?.message || "An error occurred" || err?.message,
          text2Style: {
            fontSize: 12,
          },
        });
      }
    }
  };

  async function handleDelete() {
    try {
      const response = await deleteLedgerById(id as string);
      if (response?.statusCode === 201 || response?.statusCode === 200) {
        Toast.show({
          type: "success",
          text1: "✅ Success",
          text2: response?.message,
          text2Style: {
            fontSize: 12,
          },
          onHide: () => {
            router.back();
          },
        });

        setTimeout(() => {
          router.back();
        }, 1000);
      }
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "❌ ભૂલ",
        text2:
          err.response?.data?.message || "An error occurred" || err?.message,
        text2Style: {
          fontSize: 12,
        },
      });
    }
  }

  // delete the payment
  const deletePayment = async () => {
    Alert.alert(
      "ચુકવણી કાઢી નાખો",
      "શું તમે ખરેખર આ ચુકવણી કાઢી નાખવા માંગો છો?",
      [
        { text: "રદ કરો", onPress: () => null },
        {
          text: "ઓકે",
          onPress: async () => await handleDelete(),
        },
      ]
    );
  };


  useEffect(()=>{
    if((paymentMethod.toLowerCase() === "cash" || formData.payment_method.toLowerCase()== "cash") && (transType.toLowerCase() === "out" || formData.transaction_type.toLowerCase()== "out") && (formData.payment_method.toLowerCase()=== "cash" && formData.transaction_type.toLowerCase()== "out")){
      setIsDisabled(true)
    } else{
      setIsDisabled(false)
    }
  })

  useEffect(() => {
    (async () => {
      const res = await getLocalStorage('yearPlan');
      console.log(res, 12);
      if (res!.length > 0 && !!res) {
        const statement =res?.replace("20","")?.split("-")
        setCurrentPlan(statement)
      }
    })();
  }, []); // Runs only on mount

  useEffect(() => {
    console.log(new Date(+(`20${currentPlan[0]}`), 0, 1)) // Logs updated state value after change
  }, [currentPlan]); // Runs when currentPlan updates
  
  const firstYear = currentPlan[0]?.replace(/['"]/g, '').trim(); 
  const secondYear = currentPlan[1]?.replace(/['"]/g, '').trim(); 
  const finalFirstYear = Number(`20${firstYear}`);
  const finalSecondYear = Number(`20${secondYear}`);
 
  console.log(finalFirstYear,finalSecondYear)


 
  return (
    <View style={styles.container}>
      <Header title="રોજમેળ સંપાદિત કરો" backPath={true} iconName="arrow-back" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.secondaryContainer}>
            <TouchableOpacity
              style={[
                styles.input,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  paddingLeft: 10,
                },
              ]}
              disabled={isDisbale}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={[styles.dateText]}>
                {formData.transaction_date
                  ? new Date(formData.transaction_date).toLocaleDateString()
                  : "તારીખ પસંદ કરો"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={
                  formData.transaction_date
                    ? (new Date(formData.transaction_date) as Date)
                    : new Date()
                }
                minimumDate={new Date(finalFirstYear, 0, 1)} 
                maximumDate={new Date(finalSecondYear, 11, 31)} 
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "row",
                }}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    handleChange("transaction_date", selectedDate);
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
                handleChange("head_id", callback(formData.head_id));
              }}
              searchable={true}
              searchContainerStyle={{
                backgroundColor: "#F1F4FF",
                borderWidth: 0,
                marginBottom: Platform.OS === "ios" ? 10 : 0,
                borderColor: "#F1F4FF",
              }}
              setItems={setItems}
              placeholder="હેડ પસંદ કરો"
              style={[
                styles.input,
                {
                  backgroundColor: "#F1F4FF",
                  borderColor: "#d1d9ff",
                  borderRadius: 4,
                  borderWidth: 1,
                  height: 50,
                },
              ]}
              dropDownContainerStyle={{
                backgroundColor: "#F1F4FF",
                borderColor: "#d1d9ff",
                borderTopWidth: 0,
              }}
              searchTextInputStyle={{
                borderWidth: 0,
              }}
              searchPlaceholder="હેડ ના નામથી શોધો"
              listMode="SCROLLVIEW"
              scrollViewProps={{
                nestedScrollEnabled: true,
              }}
              zIndex={3000}
              zIndexInverse={1000}
            />

            <CustomTextInput
              value={formData["amount"].toString()}
              onChangeText={(value) => handleChange("amount", value)}
              placeholder="રકમ"
              label="રકમ"
              type={"numeric"}
              disabled={isDisbale}
            />

            <Text style={styles.label}>પ્રકાર પસંદ કરો *</Text>
            <View style={styles.radioGroup}>
              {transactionTypes.map((type) => (
                <RadioButton
                  key={type.value}
                  selected={formData.transaction_type === type.value}
                  onPress={() => {
                    // Prevent changing the selection when transaction_type is "out"
                    if (formData.transaction_type.toLowerCase() === "out" && transType.toLowerCase() === "out" && paymentMethod.toLowerCase()==="cash") {
                      setIsDisabled(!isDisbale)
                     return ;
                    }
                    handleChange("transaction_type", type.value);
                  }}
                  label={type.label}
                />
              ))}
            </View>

            <Text style={styles.label}>ચુકવણી પદ્ધતિ *</Text>
            <View style={styles.radioGroup}>
              {paymentMethods.map((method) => (
                <RadioButton
                  key={method.value}
                  selected={formData.payment_method === method.value}
                  // onPress={() => handleChange("payment_method", method.value)}
                  onPress={() => {
                    if (formData.payment_method.toLowerCase() === "cash" && paymentMethod.toLowerCase()==="cash" && transType.toLowerCase() === "out") {
                      return;
                    }
                    handleChange("payment_method", method.value);
                    if (method.value.toLowerCase() === "cheque") {
                      setIsCheckPFMS(false);
                    } else {
                      setIsCheckPFMS(true);
                    }
                  }}
                  label={method.label}
                />
              ))}
            </View>

            <CustomTextInput
              value={formData.details}
              onChangeText={(value) => handleChange("details", value)}
              placeholder="કોને ચૂકવ્યા/ગ્રાન્ટ આવેલ તેની વિગત"
              label="કોને ચૂકવ્યા/ગ્રાન્ટ આવેલ તેની વિગત"
              type={"default"}
            />

            <CustomTextInput
              value={formData.cheque_number!}
              onChangeText={(value) => handleChange("cheque_number", value)}
              placeholder="ચેક/PFMS નંબર"
              label="ચેક/PFMS નંબર"
              type={"numeric"}
              disabled={isDisbale || isCheckPFMS}
            />

            <TouchableOpacity
              style={[
                styles.input,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  paddingLeft: 10,
                },
              ]}
              onPress={() => setShowClearingDatePicker(true)}
              disabled={isDisbale || isCheckPFMS}
            >
              <Text style={styles.dateText}>
                {formData.cheque_pfms_clearing_date
                  ? new Date(
                      formData.cheque_pfms_clearing_date
                    ).toLocaleDateString()
                  : "ચેક/PFMS ક્લીયરિંગ તારીખ"}
              </Text>
            </TouchableOpacity>
            {showClearingDatePicker && (
              <DateTimePicker
                value={formData.cheque_pfms_clearing_date 
                  ? new Date(formData.cheque_pfms_clearing_date) 
                  : new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowClearingDatePicker(false);
                  if (event.type === "set" && selectedDate) {
                    // Only update the date if "OK" is pressed
                    handleChange("cheque_pfms_clearing_date", selectedDate);
                  }
                }}
              />
            )}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",

                flex: 1,
                gap: 10,
              }}
            >
              <View
                style={{
                  flex: 1,
                }}
              >
                <CustomButton
                  text="કાઢી નાખો"
                  handlePress={deletePayment}
                  bg="red"
                />
              </View>
              <View
                style={{
                  flex: 1,
                }}
              >
                <CustomButton text="ફેરફાર કરો" handlePress={updatePayment} />
              </View>
            </View>
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
    paddingBottom: 20,
    paddingTop: 10,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },

  input: {
    width: "100%",
    borderWidth: 1,
    height: 50,
    backgroundColor: "#F1F4FF",
    borderColor: "#d1d9ff",
    borderRadius: 4,
    paddingRight: 10,
    color: "black",
    fontSize: 14,
    marginBottom: 20,
    fontWeight: "500",
  },
  dateText: {
    color: "black",
    fontSize: 14,
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 20,
  },
  radioGroup: {
    flexDirection: "row",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    marginBottom: 8,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#1a237e",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1a237e",
  },
  radioLabel: {
    fontSize: 14,
    color: "#000",
  },
});

export default UpdateTransactionForm;
