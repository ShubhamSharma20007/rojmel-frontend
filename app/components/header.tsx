import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type HeaderProps = {
    title: string;
    backPath?: boolean;
    iconName?: string; // iconName is optional
};

const Header: React.FC<HeaderProps> = ({ title, backPath = false, iconName = "" }) => {
    const router = useRouter();

    function goBack() {
        if (backPath) {
            router.back();
        }
    }

    return (
        <View style={styles.header}>
            <View style={styles.storePicker}>
                {/* Conditionally render the icon if iconName is not empty */}
                {iconName !== "" && (
                    <Ionicons 
                        color="white" 
                        name={iconName as keyof typeof Ionicons.glyphMap} 
                        size={24} 
                        onPress={goBack} 
                    />
                )}

                {/* Static image that always appears */}
                <Image source={require('../../assets/images/inner_logo.png')} style={styles.logo} />

                <Text style={styles.storeText}>{title}</Text>
            </View>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
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
    storeText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        letterSpacing: 0.5,
    },
    logo: {
        width: 40, // Adjust as needed
        height: 40, // Adjust as needed
        resizeMode: "contain",
    },
});
