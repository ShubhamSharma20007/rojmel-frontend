import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from './header';

const HelpAndSupport = () => {
  return (
    <>
      <Header title="અમને કૉલ કરો" iconName="arrow-back" backPath />
      <ScrollView style={styles.container}>
        {/* <Text style={styles.title}>Help & Support</Text> */}

        {/* <Text style={styles.content}>
          If you need any assistance, feel free to reach out to us. We are here to help you with any questions or issues you may have.
        </Text> */}

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>કોલ કરો</Text>
          {/* <Text style={styles.infoText}>
            📧 Email: <Text style={styles.highlight}>support@example.com</Text>
          </Text> */}
          <Text style={styles.infoText}>
            📞 અમને કૉલ કરો: <Text style={styles.highlight}>+91 9876543210</Text>
          </Text>
        </View>
      </ScrollView>
    </>
  );
};

export default HelpAndSupport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  content: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    color: '#555',
  },
  infoContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a237e',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  highlight: {
    fontWeight: 'bold',
    color: '#1a237e',
  },
});
