import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RecordButtonProps {
  isRecording: boolean;
  onPress: () => void;
  disabled?: boolean;
  recordingText?: string;
  idleText?: string;
  size?: number;
  iconSize?: number;
}

export default function RecordButton({ 
  isRecording, 
  onPress, 
  disabled = false,
  recordingText = 'Tocar para parar', 
  idleText = 'Tocar para hablar',
  size = 220,
  iconSize = 100
}: RecordButtonProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  /** Efecto de pulso continuo para el botón */
  useEffect(() => {
    const startPulse = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    if (!isRecording) {
      startPulse();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording, pulseAnim]);

  /** Efecto de brillo cuando está grabando */
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      glowAnim.setValue(0);
    }
  }, [isRecording, glowAnim]);

  const buttonRadius = size / 2;
  const glowSize = size * 1.27;
  const glowRadius = glowSize / 2;

  return (
    <View style={styles.container}>
      {/* Contenedor del botón con efectos */}
      <View style={styles.buttonContainer}>
        {/* Círculo de brillo cuando graba */}
        {isRecording && (
          <Animated.View 
            style={[
              styles.glowCircle,
              {
                width: glowSize,
                height: glowSize,
                borderRadius: glowRadius,
                opacity: glowAnim,
                transform: [{ scale: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.3]
                })}]
              }
            ]} 
          />
        )}
        
        {/* Botón de grabación animado */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity 
            style={[
              styles.recordButton, 
              { width: size, height: size, borderRadius: buttonRadius },
              isRecording && styles.recordButtonActive,
              disabled && styles.recordButtonDisabled
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={isRecording ? 'stop-circle' : 'mic-circle'} 
              size={iconSize} 
              color="#ffffff" // --primary-foreground
            />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Texto del botón */}
      <Text style={styles.buttonText}>
        {isRecording ? recordingText : idleText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  glowCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 107, 107, 0.3)', // #FF6B6B with opacity
    zIndex: 0,
  },
  recordButton: {
    backgroundColor: '#FF9F4A', // Naranja del tema
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 12,
    shadowColor: '#FF9F4A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    borderWidth: 4,
    borderColor: '#ffffff',
    zIndex: 1,
  },
  recordButtonActive: {
    backgroundColor: '#FF6B6B', // Rojo del tema cuando está grabando
    shadowColor: '#FF6B6B',
    shadowOpacity: 0.5,
  },
  recordButtonDisabled: {
    backgroundColor: '#D3D3D3', // Gris claro cuando está deshabilitado
    shadowColor: '#B0B0B0',
    shadowOpacity: 0.3,
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 36, // --text-xl (1.8rem * 20px = 36px)
    color: '#1a1a1a', // --foreground
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '700', // --font-weight-medium
    paddingVertical: 10,
    paddingHorizontal: 20,
    lineHeight: 50.4, // 1.4 line-height
  },
});
