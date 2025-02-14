import AsyncStorage from "@react-native-async-storage/async-storage";

export const setLocalStorage = async (key: string, value: string) => {
    return AsyncStorage.setItem(key, value)

}

export const getLocalStorage = async (key: string) => {
    return AsyncStorage.getItem(key)

}

export const removeLocalStorage = async (key: string) => {
    return AsyncStorage.clear()
}