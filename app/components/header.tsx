import { View, Text ,StyleSheet} from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
type HeaderProps = {
    title:string,
    backPath?:boolean,
    iconName:string
}

const Header:React.FC<HeaderProps> = ({title, backPath=false,iconName}) => {
    const router =useRouter()
    function goBack(){
        if(backPath && iconName!?.length >0){
           return router.back()
        }
    }
  return (
    <View style={styles.header}>
          <View style={styles.storePicker}>
            <Ionicons color={"white"} name={iconName as keyof typeof Ionicons.glyphMap} size={24} onPress={goBack} />
            <Text style={styles.storeText}>{title}</Text>
          </View>
        </View>
  )
}

export default Header
const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        paddingTop: 40,
        backgroundColor: "#1a237e",
        paddingVertical: 20,
        marginBottom: 10,
      
      },
      storePicker: {
        flexDirection: "row",
        gap: 10,
        color:'white',
        alignItems: "center",
      },
      
  storeText: {
    color: "white",
    fontSize: 20,
    marginRight: 8,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
})