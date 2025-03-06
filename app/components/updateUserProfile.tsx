import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  View,
  TouchableOpacity,
  ToastAndroid,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";
import { Instance } from "@/lib/instance";
import Toast from "react-native-toast-message";
import { REGISTER } from "@/constant/apis";
import { ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { CustomTextInput } from "./customTextInput";
import { StatusBar } from "expo-status-bar";
import Header from "./header";
import { getUserDetails, updateUserDetails } from '@/helper/api-communication';
import { getLocalStorage } from '@/helper/asyncStorage';
interface FormData {
  brc_full_name: string;
  school_name: string;
  pincode: string;
  school_dice_code: string;
  rojmel_name: string;
  cluster_name: string;
  block_name: string;
  bank_name: string;
  bank_branch_name: string;
  bank_account_no: string;
  address: string;
  district: string;
  sub_division: string;
  mobile_no: string;
  business_email: string;
  password: string;
}

export default function Register() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(1);
  const [isloading, setLoading] = useState(false);
  const { height } = Dimensions.get("window");
  const [formData, setFormData] = useState<FormData>({
    brc_full_name: "",
    school_name: "",
    pincode: "",
    school_dice_code: "",
    rojmel_name: "",
    cluster_name: "",
    block_name: "",
    bank_name: "",
    bank_branch_name: "",
    bank_account_no: "",
    address: "",
    district: "",
    sub_division: "",
    mobile_no: "",
    business_email: "",
    password: "",
  });

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await getUserDetails(); 
    // Replace with the correct user ID if needed
      // if (response.status === 200) {
        setFormData(response.data);
      // }
    } catch (err) {
      console.error("Error fetching user details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateSection = (section: number): boolean => {
    switch (section) {
      case 1:
        const section1Fields = [
          "brc_full_name",
          "school_name",
          "school_dice_code",
          "rojmel_name",
          "cluster_name",
          "block_name",
        ];
        const emptyField1 = section1Fields.find(
          (field) => !formData[field as keyof FormData]
        );
        if (emptyField1) {
          Toast.show({
            type: "success",
            text1: "❌ Error",
            text2Style: {
              fontSize: 12,
            },
            text2: `Please fill in ${emptyField1
              .replace(/([A-Z])/g, " $1")
              .toLowerCase()}`,
          });
          return false;
        }
        return true;

      case 2:
        const section2Fields = [
          "bank_name",
          "bank_branch_name",
          "bank_account_no",
          "address",
          "district",
          "sub_division",
          "pincode",
        ];
        const emptyField2 = section2Fields.find(
          (field) => !formData[field as keyof FormData]
        );
        if (emptyField2) {
          Toast.show({
            type: "success",
            text1: "❌ Error",
            text2Style: {
              fontSize: 12,
            },
            text2: `Please fill in ${emptyField2
              .replace(/([A-Z])/g, " $1")
              .toLowerCase()}`,
          });

          return false;
        }
        return true;

      case 3:
        const section3Fields = ["mobile_no", "business_email", "password"];
        const emptyField3 = section3Fields.find(
          (field) => !formData[field as keyof FormData]
        );
        if (emptyField3) {
          Toast.show({
            type: "success",
            text1: "❌ Error",
            text2Style: {
              fontSize: 12,
            },
            text2: `Please fill in ${emptyField3
              .replace(/([A-Z])/g, " $1")
              .toLowerCase()}`,
          });
          return false;
        }
        return true;

      default:
        return false;
    }
  };

  const nextSection = () => {
    if (validateSection(currentSection)) {
      if (currentSection < 3) setCurrentSection(currentSection + 1);
    }
  };

  const previousSection = () => {
    if (currentSection > 1) setCurrentSection(currentSection - 1);
  };

  const handleSubmit = async () => {
    let data = formData
    const res = {
      "brc_full_name": data.brc_full_name,
      "school_name": data.school_name,
      "school_dice_code": data.school_dice_code,
      "rojmel_name": data.rojmel_name,
      "cluster_name": data.cluster_name,
      "block_name": data.block_name,
      "bank_name": data.bank_name,
      "bank_branch_name": data.bank_branch_name,
      "bank_account_no": data.bank_account_no,
      "business_email": data.business_email,
      "mobile_no": data.mobile_no,
      "district": data.district,
      "sub_division": data.sub_division,
      "pincode": data.pincode,
      "address": data.address
  }

    try {
      setLoading(true);
      const user_id = await getLocalStorage('user_id') ;
      const response = await updateUserDetails(user_id!, res)

      if (response!.statusCode == 200) {
        Toast.show({
          type: "success",
          text1: "✅ Success",
          text2: "User details updated successfully",
          visibilityTime:1000,
          onHide: () => {
            router.back()
          },
        });
      }
    } catch (err: any) {
      console.error("Error updating user:", err);
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: err.response?.data?.message || "Update failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="Update Profile " key={"profile"} iconName="arrow-back" backPath />
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          paddingHorizontal: 20,
        }}
      >
      

        <View>
          {currentSection === 1 && (
            <View >

              <CustomTextInput
                value={formData.brc_full_name}
                onChangeText={(value) =>
                  handleInputChange("brc_full_name", value)
                }
                placeholder="Principle / Worden / CRC / BRC Full Name *"
                label="Principle / Worden / CRC / BRC Full Name *"
                type={'default'}
              />
              <CustomTextInput
                placeholder="School Name *"
                value={formData.school_name}
                onChangeText={(value) =>
                  handleInputChange("school_name", value)
                }
                label="School Name *"
                type={'default'}
              />


              <CustomTextInput
                placeholder="School Dise Code *"
                label="School Dise Code *"
                value={formData.school_dice_code}
                onChangeText={(value) =>
                  handleInputChange("school_dice_code", value)
                }
                type={'numeric'}
              />
              <CustomTextInput
                placeholder="Rojmel Name *"
                label="Rojmel Name *"
                value={formData.rojmel_name}
                onChangeText={(value) =>
                  handleInputChange("rojmel_name", value)
                }
                type={'default'}
              />
              <CustomTextInput
                placeholder="Cluster Name *"
                label="Cluster Name *"
                value={formData.cluster_name}
                onChangeText={(value) =>
                  handleInputChange("cluster_name", value)
                }
                type={'default'}
              />
              <CustomTextInput
                placeholder="Block Name *"
                label="Block Name *"
                value={formData.block_name}
                onChangeText={(value) =>
                  handleInputChange("block_name", value)
                }
                type={'default'}
              />
            </View>
          )}

          {currentSection === 2 && (
            <View style={{ marginBottom: 10 }}>
              <CustomTextInput
                placeholder="Bank Name *"
                label="Bank Name *"
                value={formData.bank_name}
                onChangeText={(value) =>
                  handleInputChange("bank_name", value)
                }
                type={'default'}
              />

              <CustomTextInput
                placeholder="Bank Branch Name *"
                label="Bank Branch Name *"
                value={formData.bank_branch_name}
                onChangeText={(value) =>
                  handleInputChange("bank_branch_name", value)
                }
                type={'default'}
              />
              <CustomTextInput
                placeholder="Bank Account No *"
                label="Bank Account No *"
                maxLength={12}
                value={formData.bank_account_no}
                onChangeText={(value) =>
                  handleInputChange("bank_account_no", value)
                }
                type={'numeric'}
              />



              <CustomTextInput
                placeholder="Address *"
                label="Address *"
                value={formData.address}
                onChangeText={(value) => handleInputChange("address", value)}
                type={'default'}
              />

              <CustomTextInput
                placeholder="District *"
                label="District *"
                value={formData.district}
                onChangeText={(value) => handleInputChange("district", value)}
                type={'default'}
              />

              <CustomTextInput
                placeholder="Sub Division *"
                label="Sub Division *"
                value={formData.sub_division}
                onChangeText={(value) =>
                  handleInputChange("sub_division", value)}
                type={'default'}
              />

              <CustomTextInput
                placeholder="Pincode *"
                label="Pincode *"
                maxLength={6}
                value={formData.pincode}
                onChangeText={(value) => handleInputChange("pincode", value)}
                type={'numeric'}
              />

            </View>
          )}

          {currentSection === 3 && (
            <View >
           
              <CustomTextInput
                 placeholder="Mobile Number *"
                 label="Mobile Number *"
                 maxLength={10}
               
                 value={formData.mobile_no}
                 onChangeText={(value) =>
                   handleInputChange("mobile_no", value)
                 }
                type={'numeric'}
              />
           
              <CustomTextInput
                 placeholder="Business Email *"
                 label="Business Email *"
                 value={formData.business_email}
                 type="email-address"
                 onChangeText={(value) =>
                   handleInputChange("business_email", value)
                 }
               
              />
            </View>
          )}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            {currentSection > 1 && (
              <TouchableOpacity style={styles.button} onPress={previousSection}>
                <Text style={styles.textButton}>Previous</Text>
              </TouchableOpacity>
            )}
            {currentSection < 3 ? (
              <TouchableOpacity
                style={[styles.button, { marginLeft: "auto" }]}
                onPress={nextSection}
              >
                <Text style={styles.textButton}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  handleSubmit();
                }}
              >
                {/* <ActivityIndicator size="small" color="white" /> */}
                <Text style={styles.textButton}>Submit</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView></>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F1F4FF",
    paddingLeft: 20,
    paddingRight: 10,
    borderRadius: 10,
    fontSize: 14,
    fontWeight: "semibold",
  },
  button: {
    height: 50,
    width: "48%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a237e",
    borderRadius: 10,
  },
  textButton: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  desc: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: -0.5,
  },
});
