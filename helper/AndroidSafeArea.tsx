import React from 'react';
import { StyleSheet, Platform, StatusBar, SafeAreaView } from 'react-native';

export const AndroidSafeArea = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView style={styles.AndroidSafeArea}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  }
});