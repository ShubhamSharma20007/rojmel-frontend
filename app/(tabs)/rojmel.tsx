import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
} from "react-native";
import Header from "../components/header";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { getLedger } from "@/helper/api-communication";
import { currency } from "@/helper/currency";
import CustomButton from "../components/customButton";
import { TransactionFormData } from "@/types/TransactionFormType";


const Rojmel = () => {
  const router = useRouter();
  const [enteries, setEntries] = React.useState([]);
    const [filterData,setFilterData] = React.useState<TransactionFormData[]>([]);
  const [searchQuery,setSearchQuery] = React.useState<string>('')
 const [isSorted, setIsSorted] = React.useState<boolean>(false);
  const fetchLedger = async () => {
    const request = await getLedger();
    console.log(request)
    if (request?.statusCode === 200) {
      setEntries(request.data)
    }
  }



  useEffect(()=>{
    let allEnteries =[...enteries]
    if(searchQuery.trim().length > 0){
      allEnteries = allEnteries.filter((entry: any) =>(
        entry.head_id.head_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.details.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    }
    if(isSorted){
      allEnteries = allEnteries.sort((a: any, b: any) => new Date(a.createdAt).getTime()- new Date(b.createdAt).getTime())
    } 
    setFilterData(allEnteries)

  },[searchQuery,enteries,isSorted])

  useFocusEffect(
    React.useCallback(() => {
      fetchLedger();
    }, [])
  );


  const totalPaymentIn = enteries?.reduce((acc, entry: any) => {
    if (entry.transaction_type === "IN") {
      acc += Number(entry.amount);
    }
    return acc;
  }, 0);

  const totalPaymentOut = enteries?.reduce((acc, entry: any) => {
    if (entry.transaction_type === "OUT") {
      acc += Number(entry.amount);
    }
    return acc;
  }, 0);


  const handleFilterHead =(val:string)=>{
    setSearchQuery(val)
  }
  const handleSortHead =()=>{
    setIsSorted(!isSorted)
  }

  return (
    <View style={[styles.container]}>
      {/* Header */}

      <Header iconName="document" title="Rojmel" key={'pay'} />

      {/* Balance Cards */}
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
              <Text style={[styles.balanceAmount, { color: "#4CAF50" }]}>{currency(totalPaymentIn)}</Text>
              <Text style={styles.balanceLabel}>Total Payment In</Text>
            </View>
            <View
              style={{
                flex: 1,

                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={[styles.balanceAmount, { color: "#ff00008a" }]}>{currency(totalPaymentOut)}</Text>
              <Text style={styles.balanceLabel}>Total Payment Out</Text>
            </View>
          </View>
        </View>

      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          placeholder="Search By Head Or Description..."
          style={[styles.searchInput, { height: '100%' }]}
          onChangeText={handleFilterHead}
          value={searchQuery}
          placeholderTextColor="#666"

        />
        <View style={styles.filterContainer}>
          <TouchableOpacity >
            <Ionicons name="filter" size={20} color="#666"  onPress={handleSortHead}/>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Ionicons name="menu" size={20} color="#666" />
                  </TouchableOpacity> */}
        </View>
      </View>

      {/* Enteries headers */}
      <View
        style={{
          flexDirection: "row",
          paddingVertical: 10,
          paddingHorizontal: 10,
          marginBottom: 10,
          backgroundColor: "#f9f9f9",
        }}

      >
        <Text style={{ flex: 2 }}>ENTRIES</Text>
        <Text style={{ flex: 1, textAlign: 'center' }}>IN</Text>
        <Text style={{ flex: 1, textAlign: 'center' }}>OUT</Text>

      </View>


      {/*  List of Entries */}
      {
        filterData && filterData.length > 0 && filterData.length > 0 ?
          <ScrollView>
            {
              filterData.map((item: any, index: number) => {
                return (
                  <Link
                    key={index}
                    href={{
                      pathname: '/forms/updatePaymentForm/[id]',
                      params: { id: item._id },
                    }}
                  >
                    <View
                      style={styles.dateSection} >
                      <View style={{ flex: 2 }}>
                       <View style={{
                        flexDirection:'row',
                        gap:5,
                        alignItems:'center'
                       }}>
                       <Text style={{ color: 'gray', textTransform: 'capitalize', }}>{new Date(item.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'numeric',
                          year: 'numeric'
                        })}  
                        </Text>
                        <View style={styles.paymentMethod}><Text style={styles.paymentText} >{item?.payment_method.charAt(0).toUpperCase() + item?.payment_method.slice(1).toLowerCase()}</Text></View>
                       </View>
                        <Text style={styles.headtext}>{item?.head_id?.head_name}</Text>
                        <Text style={{ color: 'gray' }}>{item?.details}</Text>
                      </View>
                      <Text style={[styles.inAmount]}>
                        {item?.transaction_type === "IN" && currency(item?.amount)
                        }
                      </Text>
                      <Text style={styles.outAmount}>
                        {item?.transaction_type === "OUT" && currency(item?.amount)
                        }

                      </Text>
                    </View>
                  </Link>

                )
              })
            }
          </ScrollView>
          : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ textAlign: 'center', fontSize: 20, color: 'gray' }}>
              No Transaction's Found
            </Text>
          </View>
      }
      {/* View Report Button */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: 10

        }}
      >

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/forms/addPaymentForm")}
        >
          <Text style={styles.addButtonText}>ADD ROJMEL</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    paddingVertical:8,
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  balanceContainer: {
    // padding: 5,
  },
  addButton: {
    backgroundColor: "#1a237e",
    width: '100%',

    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  paymentMethod: {

    borderRadius: 3,
    paddingHorizontal: 4,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
  },
  paymentText: {
    color: "#1976D2",
    textTransform: 'capitalize',
    fontWeight: 'semibold',
    fontSize: 13,
  }
  ,
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
  reportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  reportButtonText: {
    color: "#1a237e",
    marginLeft: 8,
    fontWeight: "bold",
  },
  dateSection: {

    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    flexDirection: "row",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    justifyContent: "space-between",
    alignItems: "center",

  },
  headtext: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 1,
    textTransform: 'capitalize'
  },
  entryCount: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  entryText: {
    color: "#666",
  },
  entryAmounts: {
    flexDirection: "row",
  },
  outAmount: {
    color: "#ff00008a",
    flex: 1,

    fontWeight: "bold",
    textAlign: 'center'
  },
  inAmount: {
    color: "#4CAF50",
    fontWeight: "bold",
    flex: 1,
    textAlign: 'center'
  },
  emptyState: {

    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    textAlign: 'center'
  },
  emptyStateImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
  },
  bottomButtons: {
    color: "white",
    paddingHorizontal: 20,
    gap: 10,
    flexDirection: "row",
    justifyContent: "center",
    height: 50,
    display: "flex",
    marginLeft: "auto",
    minWidth: "30%",
    alignItems: "center",

    backgroundColor: "#1a237e",
    borderRadius: 50,
  },
  outButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff1744",
    padding: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  inButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00c853",
    padding: 16,
    borderRadius: 4,
    marginLeft: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Rojmel;
