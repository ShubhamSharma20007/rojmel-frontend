import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";

type CustomButtonProps = {
  text: string;
  handlePress: () => Promise<void>;
  bg?: string;
  customStyle?: any;
};

const CustomButton: React.FC<CustomButtonProps> = ({ text, handlePress,bg='#1a237e',customStyle }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const onPress = async () => {
    setLoading(true);
    try {
      await handlePress(); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: loading ? "#ccc" : bg },
        customStyle
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={loading} 
    >
      {loading ? (
        <ActivityIndicator color="white" /> 
      ) : (
        <Text style={styles.textButton}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  
  button: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    borderRadius: 10,
  },
  textButton: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15,
  },
});

export default CustomButton;
