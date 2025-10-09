import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HomeButtonProps {
  onPress: () => void;
  title?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export default function HomeButton({ 
  onPress, 
  title = "Pantalla de Inicio", 
  icon = "home"
}: HomeButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.05,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        style={styles.button}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <Ionicons 
          name={icon} 
          size={24} 
          color="#ffffff" // --primary-foreground
          style={styles.icon}
        />
        <Text style={styles.text}>
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4CAF50', // Verde original
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 75.59, // 20mm convertido a puntos (20mm * 3.7795)
    minHeight: 75.59, // 20mm convertido a puntos
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16, // --radius
    marginBottom: 0,
    elevation: 12,
    shadowColor: '#4CAF50', // Verde original
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  icon: {
    marginRight: 12,
    flexShrink: 0,
  },
  text: {
    color: '#ffffff', // --primary-foreground
    fontSize: 36, // --text-xl (1.8rem * 20px = 36px)
    lineHeight: 50.4, // 1.4 line-height
    fontWeight: '700', // --font-weight-medium
    textAlign: 'center',
    flexShrink: 0,
  },
});
