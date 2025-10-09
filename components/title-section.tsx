import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TitleSectionProps {
  title?: string;
  subtitle?: string;
}

export default function TitleSection({ 
  title = "Ayudín", 
  subtitle = "Tu asistente personal" 
}: TitleSectionProps) {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    marginBottom: 50,
    backgroundColor: '#ffffff', // --card
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 16, // --radius (1rem = 16px)
  },
  title: {
    fontSize: 48, // --text-3xl (2.4rem * 20px = 48px)
    fontWeight: '700', // --font-weight-medium
    color: '#1a1a1a', // --foreground
    textAlign: 'center',
    marginBottom: 5,
    lineHeight: 67.2, // 1.4 line-height
  },
  subtitle: {
    fontSize: 28, // --text-lg (1.4rem * 20px = 28px)
    color: '#1a1a1a', // --foreground
    textAlign: 'center',
    fontWeight: '700', // --font-weight-medium
    lineHeight: 39.2, // 1.4 line-height
  },
});
