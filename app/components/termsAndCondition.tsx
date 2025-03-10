import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { getTermsAndConditions } from '@/helper/api-communication';
import Header from './header';

const TermsAndConditions = () => {
  const [termsTitle, setTermsTitle] = useState<string>('Terms & Conditions');
  const [termsContent, setTermsContent] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const response = await getTermsAndConditions();
        if (response?.data) {
          setTermsTitle(response.data.title || 'Terms & Conditions');
          setTermsContent(response.data.content);
        }
      } catch (error) {
        console.error('Error fetching Terms & Conditions:', error);
      }
    })();
  }, []);

  return (
    <>
      <Header title={termsTitle} iconName="arrow-back" backPath />
      <ScrollView style={styles.container}>
        {termsContent ? (
          <RenderHtml contentWidth={300} source={{ html: termsContent }} />
        ) : (
          <Text style={styles.loadingText}>લોડ કરી રહ્યું છે...</Text>
        )}
      </ScrollView>
    </>
  );
};

export default TermsAndConditions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});
