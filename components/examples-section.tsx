import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ExampleItem {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  text: string;
}

interface ExamplesSectionProps {
  helpText?: string;
  examples?: ExampleItem[];
}

const defaultExamples: ExampleItem[] = [
  {
    icon: 'logo-whatsapp',
    color: '#25D366',
    text: 'WhatsApp'
  },
  {
    icon: 'videocam',
    color: '#007AFF',
    text: 'Videollamadas'
  },
  {
    icon: 'camera',
    color: '#FF9500',
    text: 'Fotos'
  }
];

export default function ExamplesSection({ 
  helpText = 'Pregúntame sobre:', 
  examples = defaultExamples 
}: ExamplesSectionProps) {
  return (
    <View style={styles.examplesContainer}>
      <Text style={styles.helpText}>{helpText}</Text>
      <View style={styles.exampleRow}>
        {examples.map((example, index) => (
          <View key={index} style={styles.exampleItem}>
            <Ionicons name={example.icon} size={20} color={example.color} />
            <Text style={styles.exampleText}>{example.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  examplesContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 15,
  },
  helpText: {
    fontSize: 20,
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
  },
  exampleRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  exampleItem: {
    alignItems: 'center',
    flex: 1,
  },
  exampleText: {
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
    marginTop: 5,
    fontWeight: '500',
  },
});
