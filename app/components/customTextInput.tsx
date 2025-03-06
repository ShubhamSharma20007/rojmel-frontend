import { StyleSheet, KeyboardTypeOptions } from "react-native";
import { TextInput } from "react-native-paper";

type TextInputProps = {
    value: string | number;
    onChangeText: (text: string) => void;
    placeholder: string;
    label: string;
    type?: KeyboardTypeOptions;  // ✅ Correct type for keyboardType
    secureTextEntry?: boolean;
    maxLength?: number;
    disabled?: boolean;
};

export const CustomTextInput: React.FC<TextInputProps> = ({
    value,
    onChangeText,
    placeholder,
    label,
    type = "default",  // ✅ Default to "default" keyboard type
    secureTextEntry = false,
    maxLength,
    disabled
}) => {
    return (
        <TextInput
        disabled={disabled}
            label={label}
            mode="outlined"
            keyboardType={type}  // ✅ Properly handled keyboard type
            outlineColor="#d1d9ff"
            placeholder={placeholder}
            placeholderTextColor="black"
            value={value.toString()}  // ✅ Ensure it's always a string
            onChangeText={onChangeText}
            style={styles.input}
            secureTextEntry={secureTextEntry}
            maxLength={maxLength}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        width: "100%",
        borderWidth: 0,
        height: 50,
        backgroundColor: "#F1F4FF",
        paddingRight: 10,
        borderRadius: 10,
        color: "black",
        fontSize: 14,
        marginBottom: 20,
        fontWeight: "500",
    },
});
