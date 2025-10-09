import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InstructionSectionProps {
  isRecording: boolean;
  recordingText?: string;
  idleText?: string;
}

export default function InstructionSection({ 
  isRecording, 
  recordingText = 'Te estoy escuchando...', 
  idleText = 'Toca el botón para hablar' 
}: InstructionSectionProps) {
  return (
    <View style={styles.instructionContainer}>
      <Ionicons 
        name={isRecording ? 'radio-button-on' : 'mic'} 
        size={28} 
        color={isRecording ? '#FF6B6B' : '#FF9F4A'} // Rojo cuando graba : Naranja normal 
        style={styles.instructionIcon}
      />
      <Text style={styles.instruction}>
        {isRecording ? recordingText : idleText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  instructionIcon: {
    marginRight: 10,
  },
  instruction: {
    fontSize: 36, // --text-xl (1.8rem * 20px = 36px)
    color: '#1a1a1a', // --foreground
    lineHeight: 50.4, // 1.4 line-height
    fontWeight: '700', // --font-weight-medium
  },
});
