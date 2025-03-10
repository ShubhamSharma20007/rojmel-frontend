import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";

type CustomButtonProps = {
  text: string;
  handlePress: () => Promise<void>;
  bg?: string;
  customStyle?: any;
  isDisabled?: boolean;
};

const CustomButton: React.FC<CustomButtonProps> = ({ text, handlePress,bg='#1a237e',customStyle,isDisabled=false }) => {
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
        { backgroundColor: loading ? "#ccc" : customStyle ? customStyle?.backgroundColor:bg },
        customStyle
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={loading || isDisabled} 
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
    backgroundColor: "#1a237e",
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  textButton: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CustomButton;
