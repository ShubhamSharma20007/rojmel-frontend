import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  Platform,
  useWindowDimensions,
  Alert,
} from "react-native";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Notifications from "expo-notifications";
import Header from "../components/header";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { downloadReport, getHeads, getLedger, khatavahiReport } from "@/helper/api-communication";
import { TransactionFormData } from "@/types/TransactionFormType";
import DropDownPicker from "react-native-dropdown-picker";
import { getLocalStorage } from "@/helper/asyncStorage";
import CustomButton from "../components/customButton";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Report = () => {
  const [open, setOpen] = React.useState(false);
  const [fixOpen, SetfixOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>('')
  const [fixValue, setFixValue] = React.useState<string>('')
  const [items, setItems] = React.useState<{ value: string, label: string }[]>([]);
  const [fixItems, fixSetItems] = React.useState([
    { label: 'Cashbook', value: 'cashbook' },
    { label: 'Appendix9', value: 'appendix9' },
    { label: 'Appendix10', value: 'appendix10' },
    { label: 'khatavahi', value: 'khatavahi' },
    { label: 'Billregister', value: 'billregister' },
    { label: 'Grantregister', value: 'grantregister' },
    { label: 'Chequeregister', value: 'chequeregister' },
  ]);






  // useEffect(() => {
  //   registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

  //   if (Platform.OS === 'android') {
  //     Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
  //   }
  //   notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
  //     setNotification(notification);
  //   });

  //   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
  //     console.log(response);
  //   });

  //   return () => {
  //     notificationListener.current &&
  //       Notifications.removeNotificationSubscription(notificationListener.current);
  //     responseListener.current &&
  //       Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);


  useEffect(() => {
    (async () => {
      const getHeadsData = await getHeads();
      if (getHeadsData?.data?.length > 0) {
        const modifiedData = getHeadsData?.data.map((item: any, idx: number) => ({ label: item?.head_name, value: item?._id }))
        setItems(modifiedData)
      }
    })();
  }, [fixValue === "khatavahi"]);


  const handleDownloadReport = async () => {
    try {
      let response;
      if (fixValue !== 'khatavahi') {
        response = await downloadReport(fixValue);
      } else {
        response = await khatavahiReport(fixValue, value as string);
      }
      // download the file

      const url = response!.request.responseURL;
      console.log(url,1212)
      const fileUri = FileSystem.documentDirectory + `${fixValue}.pdf`;
      console.log({ fileUri, url })
      const token = await getLocalStorage('auth_token')
      const { uri } = await FileSystem.downloadAsync(url, fileUri, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("PDF downloaded to:", uri);
      // Send a notification

      // save the file to the device
      if (Platform.OS === 'android') {
        const permission = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permission.granted) {
          const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
          await FileSystem.StorageAccessFramework.createFileAsync(permission.directoryUri, `${fixValue}.pdf`, 'application/pdf')
            .then(async (fileUri) => {
              await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
              console.log('File copied to:', fileUri);
              // for sharing the file 
              //  Sharing.shareAsync(uri);
                Toast.show({
                        type: "success",
                        text1: "✅ Success",
                        text2: "File downloaded successfully",
                        text2Style: {
                          fontSize: 12,
                        },
                      });
              Notifications.scheduleNotificationAsync({
                content: {
                  title: 'File Downloaded',
                  body: 'Your PDF has been downloaded successfully',
                  data: { url: uri },
                },
                trigger: null,
              })
            })
        }

      }



    } catch (err:any) {
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2Style: {
          fontSize: 12,
        },
        text2: err?.message,
      });
    }

  }



  //  handle the description detailts
  let description;
  switch (fixValue) {
    case "khatavahi":
      description = "Khatavahi Report provides a detailed account of financial transactions, including debits and credits, to track expenses and income over a specific period for better financial management.";
      break;
    case "ledger":
      description = "Ledger Report records all financial transactions categorized into different accounts, helping businesses track their financial health and maintain accurate bookkeeping records efficiently.";
      break;
    case "cashbook":
      description = "Cashbook Report tracks daily cash inflows and outflows, providing an overview of cash transactions to ensure accurate financial reconciliation and cash flow management.";
      break;
    case "bankbook":
      description = "Bankbook Report maintains a record of all banking transactions, including deposits, withdrawals, and transfers, to track account balances and ensure financial accuracy.";
      break;
    case "sales":
      description = "Sales Report summarizes revenue generated from sales transactions, providing insights into business performance, trends, and customer purchasing behavior for strategic decision-making.";
      break;
    case "appendix9":
      description = "Appendix 9 Report contains structured financial data and supporting documentation for compliance, auditing, and regulatory reporting purposes, ensuring transparency and accuracy in financial statements.";
      break;
    case "appendix10":
      description = "Appendix 10 Report provides additional financial details and records required for audits, regulatory filings, or internal reviews, ensuring clarity and completeness of financial reports.";
      break;
    case "billregister":
      description = "Bill Register Report keeps track of issued invoices and bills, helping businesses manage outstanding payments, track due dates, and maintain proper financial records.";
      break;
    case "grantregister":
      description = "Grant Register Report documents grant allocations, expenditures, and balances, ensuring transparency in fund utilization and compliance with financial guidelines.";
      break;
    case "chequeregister":
      description = "Cheque Register Report records issued and received cheques, tracking payments and ensuring proper reconciliation of financial transactions with bank statements.";
      break;
  }

  return (
    <View style={[styles.container]}>
      {/* Header */}
    <StatusBar translucent style="light"/>
      <Header iconName="" title="Report" key={'pay'} />

      {/*  List of Entries */}
      <View style={{ flex: 1, padding: 10 }}>
        {/* dropdown */}

        <DropDownPicker
          open={fixOpen}
          value={fixValue}
          items={fixItems}
          setOpen={SetfixOpen}
          setValue={(value) => {
            setFixValue(value)
          }}

          setItems={fixSetItems}
          placeholder={'Select The Report Type'}
          style={[styles.input, {
            backgroundColor: "#F1F4FF",
            borderColor: '#d1d9ff',
            borderRadius: 4,
            borderWidth: 1,
            height: 50,

          }]}
          dropDownContainerStyle={{
            backgroundColor: "#F1F4FF",
            borderColor: "#d1d9ff",
            borderTopWidth: 0,
          }}
        />

        {
          fixValue === "khatavahi" && (
            <DropDownPicker
              open={open}
              // value={formData.head_id}
              items={items}
              setOpen={setOpen}
              value={value}
              setValue={(id) => {
                setValue(id)
              }
              }
              searchable={true}
              searchContainerStyle={{
                backgroundColor: "#F1F4FF",
                borderWidth: 0,
                marginBottom: Platform.OS === 'ios' ? 10 : 0,
                borderColor: "#F1F4FF",


              }}
              style={[styles.input, {
                backgroundColor: "#F1F4FF",
                borderColor: '#d1d9ff',
                borderRadius: 4,
                borderWidth: 1,
                height: 50,

              }]}
              dropDownContainerStyle={{
                backgroundColor: "#F1F4FF",
                borderColor: "#d1d9ff",
                borderTopWidth: 0,
              }}
              setItems={setItems}
              placeholder="Select a Head Name"


              searchTextInputStyle={{
                borderWidth: 0
              }}
              searchPlaceholder='Search for a head name'


              listMode="SCROLLVIEW"
              scrollViewProps={{
                nestedScrollEnabled: true,
              }}
              zIndex={3000}
              zIndexInverse={1000}
            />
          )
        }

        {/*  description */}

        <Text style={{
          alignContent: 'center',
          fontSize: 14,
        }}>
          
        </Text>
        <View style={{
          width: '100%',
          flex:1,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
          <Image style={{
            width: useWindowDimensions().width - 100,
            height: '100%',
            objectFit: "contain",
            alignSelf: 'center',

          }} source={require('../../assets/images/report_image.png')} />
        </View>

      </View>

      {/* View Report Button */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: 10

        }}
      >

        {/* <TouchableOpacity
          disabled={fixValue.length === 0}
          style={styles.addButton}
          onPress={handleDownloadReport}
        >
          <Text style={styles.addButtonText}>DOWNLOAD REPORT</Text>
        </TouchableOpacity> */}
        <CustomButton handlePress={handleDownloadReport} text="DOWNLOAD REPORT" key='download_report' />
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
    paddingVertical: 8,
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
  input: {
    width: "100%",
    borderWidth: 1,
    height: 50,
    backgroundColor: "#F1F4FF",
    borderColor: '#d1d9ff',
    borderRadius: 4,
    paddingRight: 10,
    color: "black",
    fontSize: 14,
    marginBottom: 20,
    fontWeight: "500",
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

export default Report;
