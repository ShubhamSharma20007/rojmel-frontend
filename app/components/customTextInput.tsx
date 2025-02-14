import { StyleSheet } from "react-native"
import { TextInput } from "react-native-paper"


type TextInputProps = {
    value: string | number,
    onChangeText: (e: any) => void,
    placeholder: string,
    label: string,
    type?: string,
    secureTextEntry?:boolean | false,
    maxLength?:number
}

export const CustomTextInput: React.FC<TextInputProps> = (props: any) => {
    return(
        <TextInput
        label={props.label}
          mode='outlined'
          keyboardType={props.type}
            outlineColor='#d1d9ff'
            placeholder={props.placeholder}
            placeholderTextColor={'black'}
            value={props.value}
            onChangeText={(value) => props.onChangeText(value)}
            style={[styles.input]}
            secureTextEntry={props.secureTextEntry}
            maxLength={props.maxLength}
    
        ></TextInput>
     
    )



}
const styles = StyleSheet.create({
    input: {
        width: "100%",
        borderWidth:0,
        height: 50,
        backgroundColor: "#F1F4FF",
        paddingRight: 10,
        borderRadius: 10,
        color: "black",
        fontSize: 14,
        marginBottom: 20,
        fontWeight: "500",
      },
})