import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { getPrivacyPolicy } from '@/helper/api-communication';
import Header from './header';

const PrivacyPolicy = () => {
  const [privacyPolicyTitle, setPrivacyPolicyTitle] = useState<string>('');
  const [privacyPolicyContent, setPrivacyPolicyContent] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const response = await getPrivacyPolicy();
        if (response?.data) {
          setPrivacyPolicyTitle(response.data.title || 'Privacy Policy'); // Default fallback
          setPrivacyPolicyContent(response.data.content);
        }
      } catch (error) {
        console.error('Error fetching Privacy Policy:', error);
      }
    })();
  }, []);

  return (
    <>
      <Header title={privacyPolicyTitle} iconName="arrow-back" backPath />
      <ScrollView style={styles.container}>
        {/* Render Privacy Policy Content */}
        {privacyPolicyContent ? (
          <RenderHtml contentWidth={300} source={{ html: privacyPolicyContent }} />
        ) : (
          <Text style={styles.loadingText}>Loading Content...</Text>
        )}
      </ScrollView>
    </>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 10,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});
