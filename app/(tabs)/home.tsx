import React, { useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Link } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Image,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter ,usePathname} from "expo-router";
import { deleteHead, getHeads, updateHeads } from "@/helper/api-communication";
import { handleSplitName } from "@/helper/splitName";
import { currency } from "@/helper/currency";

import { useRoute } from "@react-navigation/native";
import { useCustomerContext } from "../context/customerContext";
import Header from "../components/header";
const BlankImage = require("../../assets/images/blank.png");
const Drawer = createDrawerNavigator();

interface EditedValues {
  head_name: string;
  opening_balance_bank: string;
  opening_balance_cash: string;
}

const Home = () => {
  const router = useRouter();
  const pathname = usePathname()
  const { customer, setCustomers } = useCustomerContext();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterData,setFilterData] = useState<any>([]);
  const [isSorted, setIsSorted] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editedValues, setEditedValues] = useState<EditedValues>({
    head_name: "",
    opening_balance_bank: "",
    opening_balance_cash: "",
  });


  useEffect(() => {
    let newFilterData = [...customer];

    if (searchQuery.trim().length > 0) {
      newFilterData = newFilterData.filter((item) =>
        item.head_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }


    if (isSorted) {
      newFilterData.sort((a, b) => a.head_name.localeCompare(b.head_name));
    }

    setFilterData(newFilterData);
  }, [customer, searchQuery, isSorted]);

  useEffect(() => {
  
    (async () => {
      const getHeadsData = await getHeads();
      // if(!getHeadsData){
      //   setCustomers([]);
      //   router.replace('/')
      // }
      if (getHeadsData?.data?.length > 0) {
        setCustomers(getHeadsData?.data);
      }
    })();
    return ()=>{
      setCustomers([])
    }
  }, []);
 


  function handleEdit(index: number, customer: any) {
    setEditingId(index);
    setEditedValues({
      head_name: customer.head_name,
      opening_balance_cash: customer.opening_balance_cash.toString(),
      opening_balance_bank: customer.opening_balance_bank.toString(),
    });
  }

  function handleCancel(id:string){
    setEditingId(null);
   Keyboard.dismiss()
  }
  const handleSubmit = async (id: string) => {
    console.log("-----------------------------------");
    console.log("Saving changes:", editedValues);
    const updateHead = await updateHeads(id, editedValues);
    if (updateHead.statusCode === 200) {
      // reload the customer data
      const getHeadsData = await getHeads();
      if (getHeadsData?.data.length > 0) {
        setCustomers(getHeadsData?.data);
        setFilterData(getHeadsData?.data);
      }
      setEditingId(null);
      setEditedValues({
        head_name: "",
        opening_balance_bank: "",
        opening_balance_cash: "",
      });
      Keyboard.dismiss();
    }
  };
  const handleChange = (field: string, value: string) => {
    setEditedValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };



    const handleDeleteHead =async(id:string)=>{
      Alert.alert('હેડ કાઢી નાખો', 'શું તમે હેડ ડિલીટ કરવા માટે ખાતરી કરો છો? જો હા, તો તમામ હેડ સંબંધિત રોજમેળ એન્ટ્રી આપમેળે દૂર કરવામાં આવશે ?', [
        {
          text: 'રદ કરો',
          style: 'cancel',
        },
        {
          text: 'કાઢી નાખો',
          onPress: async () =>{
        console.log('----------------delete -------------------')
      const result = await deleteHead(id);
          if(result.statusCode === 200){
         
            setCustomers((prev)=>[...prev.filter((item)=>item._id !== id)]);
            setEditingId(null);
          }
          }
        }
      ])
  }

  
  const totalBankAmount = customer.reduce((acc, customer) => acc + parseFloat(customer.opening_balance_bank), 0).toLocaleString('en-IN',{
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  })
  const totalCashAmount = customer.reduce((acc, customer) => acc + parseFloat(customer.opening_balance_cash), 0).toLocaleString('en-IN',{
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  })




  const handleFilterHead = (str: string) => {
    setSearchQuery(str);
  };


  const handleSortHead = () => {
    setIsSorted(!isSorted);
  };


  return (
    <>
      
      <View style={styles.container}>
        {/* <View style={styles.header}>
          <View style={styles.storePicker}>
            <Ionicons name="book-outline" size={24} color="white" />
            <Text style={styles.storeText}>Rojmel Store</Text>
          </View>
        </View> */}
          <Header title='હેડ' iconName='' />

        {/* Rest of your existing code */}
       <View style={styles.balanceContainer}>
       <View style={[styles.balanceCard]}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                borderRightWidth: 1,
                borderRightColor: "#eee",
              }}
            >
              <Text
                style={[
                  styles.balanceAmount,
                  {
                    color: "#4CAF50",
                    textAlign:'center'
                  },
                ]}
              >
                {totalBankAmount}
              </Text>
              <Text style={[styles.balanceLabel,{
                textAlign:'center'
              }]}>આ વર્ષ ની બેક ની ઓપનીંગ બેલેન્સ</Text>
            </View>
            <View
              style={{
                flex: 1,

                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={[
                  styles.balanceAmount,
                  {
                    color: "#4CAF50",
                    textAlign: "center",
                  },
                ]}
              >
                 {totalCashAmount}
              </Text>
              <Text style={[styles.balanceLabel,{
                   textAlign: "center",
              }]}>આ વર્ષ ની રોકડ ની ઓપનીંગ બેલેન્સ</Text>
            </View>
          </View>
        </View>
       </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            placeholder="શોધો..."
            style={[styles.searchInput,{height:'100%'}]}
            onChangeText={handleFilterHead}
            value={searchQuery}
            placeholderTextColor="#666"
          />
          <View style={styles.filterContainer}>
           <TouchableOpacity onPress={handleSortHead}>
           <Ionicons name="filter" size={20} color="#666" />
           </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name="menu" size={20} color="#666" />
            </TouchableOpacity> */}
          </View>
        </View>

        <ScrollView >
         {
          filterData.length > 0 ?(
            filterData.map((customer:any, index:number) =>
              editingId === index ? (
                <View
                key={`editing-${customer._id}-${index}`}
                  style={styles.customerItem}
                >
                  <View style={[styles.customerInfo, { flex: 3 }]}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {handleSplitName(customer.head_name)}
                      </Text>
                    </View>
                    <View style={{ gap: 4 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 80,
                        }}
                      >
                        <Text style={{ fontWeight: "500", fontSize: 13 }}>
                        હેડ નું નામ :{" "}
                        </Text>
                        <TextInput
                          style={{
                            borderWidth: 1,
                            borderColor: "#ddd",
                            padding: 6,
  
                            borderRadius: 4,
                            width: "40%",
                            fontSize: 11.5,
                          }}
                          value={editedValues.head_name}
                          onChangeText={(value) =>
                            handleChange("head_name", value)
                          }
                          keyboardType="default"
                          placeholder="Head Name"
                        />
                      </View>
  
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 16,
                        }}
                      >
                        <Text style={{ fontWeight: "500", fontSize: 13 }}>
                        બેંક ની ઓપનીંગ બેલેન્સ :{" "}
                        </Text>
                        <TextInput
                          style={{
                            borderWidth: 1,
                            borderColor: "#ddd",
                            padding: 6,
  
                            borderRadius: 4,
                            width: "40%",
                            fontSize: 11.5,
                          }}
                          value={editedValues.opening_balance_bank}
                          onChangeText={(value) =>
                            handleChange("opening_balance_bank", value)
                          }
                          keyboardType="numeric"
                          placeholder="Opening Balance Bank"
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <Text style={{ fontWeight: "500", fontSize: 13 }}>
                        રોકડ ની ઓપનીંગ બેલેન્સ :{" "}
                        </Text>
                        <TextInput
                          style={{
                            borderWidth: 1,
                            borderColor: "#ddd",
                            padding: 6,
                            borderRadius: 4,
                            width: "40%",
                            fontSize: 11.5,
                          }}
                          value={editedValues.opening_balance_cash}
                          onChangeText={(value) =>
                            handleChange("opening_balance_cash", value)
                          }
                          keyboardType="numeric"
                          placeholder="Opening Balance Cash"
                        />
                      </View>
                    </View>
                  </View>
                  <View style={[styles.amountContainer, { flex:1, gap:5}]}>
                    <TouchableOpacity
                      onPress={() => {
                        handleSubmit(customer._id);
                      }}
                      style={styles.requestButton}
                    >
                     
                      <Text style={styles.requestText}>સબમિટ કરો</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        handleCancel(customer._id);
                      }}
                      style={styles.deleteButton}
                    >
                     
                      <Text style={[styles.requestText,{color:'white'}]}>રદ કરો</Text>
                    </TouchableOpacity>
                    
                    
                  </View>
                  

                </View>
              ) : (
                <>
                  <View
                    key={`original-${customer._id}-${index}`}
                    style={styles.customerItem}
                  >
                    <View style={[styles.customerInfo,{flex:1}]}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {handleSplitName(customer.head_name)}
                        </Text>
                      </View>
                      <View style={{flex:1}}>
                        <Text style={styles.customerName}>
                          {customer.head_name}
                        </Text>
                        {customer.updatedAt && (
                          <Text style={[styles.dueDate]}>
                            બેંક ની ઓપનીંગ બેલેન્સ :{" "}
                            <Text style={{ fontWeight: "500" }}>
                              {currency(customer.opening_balance_bank)}
                            </Text>
                          </Text>
                        )}
                        {customer.updatedAt && (
                          <Text style={styles.dueDate}>
                            રોકડ ની ઓપનીંગ બેલેન્સ :{" "}
                            <Text style={{ fontWeight: "500" }}>
                              {currency(customer.opening_balance_cash)}
                            </Text>
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={[styles.amountContainer,{gap:5 }]}>
                      <TouchableOpacity
                        onPress={() => {
                          handleEdit(index, customer);
                        }}
                        style={styles.requestButton}
                      >
                        
                        <Text style={[styles.requestText]}>ફેરફાર કરો</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                      onPress={() => {
                        handleDeleteHead(customer._id);
                      }}
                      style={styles.deleteButton}
                    >
                      <Text style={[styles.requestText,{color:'white'}]}>કાઢી નાખો</Text>
                    </TouchableOpacity>
                    </View>
                  </View>
                </>
              )
            )
          ):(
            <View style={{flexGrow:1, justifyContent: "center", alignItems: "center"}}>
            <Image
              source={BlankImage}
              style={{
                height:'60%',
                width:'60%',
                objectFit:'contain',
                resizeMode: "contain",
                justifyContent: "center",
              }}
            ></Image>
          </View>
          )
         }
        </ScrollView>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/forms/personAddForm")}
        >
          <Text style={styles.addButtonText}>હેડ બનાવો</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

// Drawer Screens
// const SettingsScreen = () => (
//   <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//     <Text>Settings Screen</Text>
//   </View>
// );

// const ProfileScreen = () => (
//   <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//     <Text>Profile Screen</Text>
//   </View>
// );

// const Dashboard = () => {
//   return (
//     <Drawer.Navigator>
//       <Drawer.Screen
//         name="index"
//         component={CustomersScreen}
//         options={{
//           headerShown: false,
//         }}
//       />
//       <Drawer.Screen name="Settings" component={SettingsScreen} />
//       <Drawer.Screen name="Profile" component={ProfileScreen} />
//     </Drawer.Navigator>
//   );
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 40,
    backgroundColor: "#1a237e",
    paddingVertical: 20,
  },
  storePicker: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  balanceContainer: {
    // padding: 5,
  },
  balanceCard: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
   
    borderBottomColor: "#eee",
    borderRadius: 8,
    padding: 10,
  },
  balanceAmount: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#000",
  },
  balanceLabel: {
    fontSize: 12,
    color: "#666",
  },
  balanceDetails: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 16,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  balanceText: {
    color: "#666",
  },
  balanceValue: {
    fontWeight: "bold",
  },
  storeText: {
    color: "white",
    fontSize: 20,
    marginRight: 8,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  staffText: {
    color: "white",
    fontSize: 16,
  },
  actionButtons: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionItem: {
    alignItems: "center",
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  iconText: {
    color: "white",
    fontSize: 18,
  },
  actionText: {
    fontSize: 12,
    color: "#333",
  },
  loanButton: {
    backgroundColor: "#E3F2FD",
    padding: 8,
    borderRadius: 8,
  },
  loanText: {
    fontSize: 12,
    color: "#1976D2",
  },
  applyText: {
    fontSize: 14,
    color: "#1976D2",
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#1a237e",
  },
  tabText: {
    color: "#666",
  },
  activeTabText: {
    color: "#1a237e",
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
 
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    paddingVertical:8
  },
  filterContainer: {
    flexDirection: "row",
    gap: 16,
  },
  customerItem: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    justifyContent: "space-between",
    alignItems: "center",
  },
  customerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#1976D2",
    fontWeight: "bold",
  },
  customerName: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: 'capitalize',
    marginBottom: 4,

  },
  dueDate: {
    fontSize: 12,
    color: "#666",
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  deleteButton:{
    backgroundColor: "#ff00008a",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    display:'flex',
    marginTop:5,
    justifyContent:'center',
    flexDirection: "row",
    color:'white',
    width:70

  },
  requestButton: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    flexDirection: "row",
    width : 70
  },
  requestText: {
    color: "#1976D2",
    fontSize: 12,
    textAlign: 'center',
    width:'100%'
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

export default Home;
