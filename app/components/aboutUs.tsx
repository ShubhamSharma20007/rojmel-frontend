import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from './header';
import { getAboutUs } from '@/helper/api-communication';
import RenderHtml from 'react-native-render-html';

const AboutUs = () => {
  const [aboutUsData, setAboutUsData] = useState({ title: '', content: '' });

  // Fetch about-us data
  useEffect(() => {
    (async () => {
      try {
        const response = await getAboutUs();
        if (response?.data) {
          setAboutUsData({ title: response.data.title, content: response.data.content });
        }
      } catch (error) {
        console.log('Error fetching About Us content:', error);
      }
    })();
  }, []);

  return (
    <>
      <Header title={aboutUsData.title} iconName='arrow-back' backPath />
      <ScrollView style={styles.container}>
        {/* <Text style={styles.title}>{aboutUsData.title}</Text> */}
        <RenderHtml contentWidth={400} source={{ html: aboutUsData.content }} />
      </ScrollView>
    </>
  );
};

export default AboutUs;

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
});
