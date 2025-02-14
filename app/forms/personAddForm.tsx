import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Image,
} from "react-native";

// import { Image } from "expo-image";
import { ScrollView } from "react-native-gesture-handler";
import { TextInput } from "react-native-paper";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { createHead, deleteHead } from "@/helper/api-communication";
import Toast from "react-native-toast-message";
const headImage = require("../../assets/images/undraw_contract_upwc.png");
import { useCustomerContext } from "../context/customerContext";
import { useRouter } from "expo-router";
import Header from "../components/header";
const PersonAddForm = () => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [entries, setEntries] = useState<any>([]);
  const { setCustomers } = useCustomerContext();
  const handleAdd = () => {
    const numberOfRows = parseInt(inputValue);
    if (!numberOfRows || numberOfRows <= 0) {
      alert("Please enter a valid number of rows.");
      return;
    }

    const newEntries = Array.from({ length: numberOfRows }, (_, index) => ({
      id: Date.now().toString() + index,
      head_name: "",
      opening_balance_cash: "",
      opening_balance_bank: "",
    }));
    setEntries((prev: any) => [...prev, ...newEntries]);
    setInputValue("");
    Keyboard.dismiss();
  };

  const handleDelete = (id: string) => {
    setEntries((prev: any) => prev.filter((entry: any) => entry.id !== id));
  };

  const handleUpdateEntry = (id: string, field: string, value: string) => {
    setEntries((prev: any) =>
      prev.map((entry: any) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleSubmit = async () => {
    if (
      entries.some(
        (entry: any) =>
          !entry.head_name ||
          !entry.opening_balance_bank ||
          !entry.opening_balance_cash
      )
    ) {
      alert("Please fill all the fields before submitting.");
      return;
    }
    const removeIdEnteries = entries.map((entry: any) => {
      // remove the id field from each entry
      const { id, ...rest } = entry;
      return rest;
    });
    const data = await createHead(removeIdEnteries);
    console.log("---------------------- new head -----------------------");

    setCustomers((prev) => [...data.data, ...prev]);
    if (data.statusCode === 201 || data.statusCode === 200) {
      Toast.show({
        type: "success",
        text1: "✅ Success",
        text2: data.message,
        text2Style: {
          fontSize: 12,
        },
        onHide: () => {
          router.back();
        }
      });

      setEntries([]);
    } else {
      Toast.show({
        type: "error",
        text1: "❌ Error",
        text2: data.message,
        text2Style: {
          fontSize: 12,
        },
      });
    }
  };

  const handleCancel = () => {
    setEntries([]);
    setInputValue("");
  };



  const memoizedEntries = useMemo(() => {
    return entries.map((entry: any) => (
      <View key={entry.id} style={styles.tableRow}>
        <View style={[styles.cellContainer, { flex: 1.6 }]}>
          <TextInput
            value={entry.name}
            onChangeText={(value) =>
              handleUpdateEntry(entry.id, "head_name", value)
            }
            style={styles.cellInput}

          />
        </View>
        <View style={[styles.cellContainer, { flex: 1 }]}>
          <TextInput
            value={entry.type}
            onChangeText={(value) =>
              handleUpdateEntry(entry.id, "opening_balance_bank", value)
            }
            style={styles.cellInput}

            keyboardType="numeric"
          />
        </View>
        <View style={[styles.cellContainer, { flex: 1 }]}>
          <TextInput
            value={entry.amount}
            onChangeText={(value) =>
              handleUpdateEntry(entry.id, "opening_balance_cash", value)
            }
            style={styles.cellInput}

            keyboardType="numeric"
          />
        </View>
        <View style={[styles.cellContainer, { flex: 0.4 }]}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(entry.id)}
          >
            <FontAwesome5 name="trash" size={16} color="#FF5252" />
          </TouchableOpacity>
        </View>
      </View>
    ));
  }, [entries]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      {/* <View style={styles.header}>
        <Text style={styles.storeText}>Add Transaction</Text>
      </View> */}
      <Header title='Add Heads' iconName='arrow-back' backPath={true} />
      <View style={styles.content}>
        <View style={styles.inputRow}>
          <TextInput
            mode="outlined"
            label={"Number of heads"}
            value={inputValue}
            onChangeText={setInputValue}
            style={styles.input}
            placeholder="Number of heads"
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.buttonText}>Add Rows</Text>
          </TouchableOpacity>
        </View>
        {entries.length > 0 ? (
          <>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, { flex: 1.8 }]}>Head Name</Text>{" "}
              <Text style={[styles.headerCell, { flex: 1.2 }]}>Bank Amt.</Text>{" "}
              <Text style={[styles.headerCell, { flex: 1 }]}>Cash Amt.</Text>
              <Text style={[styles.headerCell, { flex: 0.6 }]}> </Text>
            </View>

            <ScrollView style={styles.scrollArea}>{memoizedEntries}</ScrollView>

            <View style={styles.bottomButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={{ flex: 1 }}>
            <Image
              source={headImage}
              style={{
                height: "100%",
                width: "100%",
                resizeMode: "contain",
                justifyContent: "center",
              }}
            ></Image>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  cellContainer: {
    paddingHorizontal: 4,
    justifyContent: "center",
  },
  cellInput: {
    backgroundColor: "transparent",
    fontSize: 14,
    height: 40,
    padding: 0,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
    paddingVertical: 4,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputRow: {
    flexDirection: "row",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 20,
    height: 50,
  },
  input: {
    flex: 3 / 4,
    marginBottom: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: "#1a237e",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 8,
    flex: 1 / 4,
    alignSelf: "center",
    elevation: 2,
  },
  buttonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1a237e",
    padding: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    elevation: 2,
  },
  headerCell: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  scrollArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    padding: 12,
    backgroundColor: "white",
  },
  deleteButton: {
    padding: 8,
    alignItems: "center",
  },
  bottomButtons: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 10,
    gap: 8,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  submitButton: {
    backgroundColor: "#1a237e",
  },
  cancelButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },
  submitButtonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 40,
    backgroundColor: "#1a237e",
    paddingVertical: 20,
    elevation: 4,
  },
  storeText: {
    color: "white",
    fontSize: 20,
    marginRight: 8,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});

export default PersonAddForm;
