import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SplashScreenProps {
  onFinish: () => void;
  duration?: number;
  appName?: string;
}

export default function SplashScreen({ 
  onFinish, 
  duration = 3000,
  appName = "Ayudín" 
}: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de pulso continuo
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

    // Iniciar pulso después de un pequeño delay
    const pulseTimeout = setTimeout(startPulse, 500);

    // Finalizar splash screen
    const finishTimeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, duration);

    return () => {
      clearTimeout(pulseTimeout);
      clearTimeout(finishTimeout);
    };
  }, [fadeAnim, scaleAnim, pulseAnim, onFinish, duration]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.content}>
        {/* Ícono de la app con animación */}
        <Animated.View 
          style={[
            styles.iconContainer,
            {
              transform: [
                { scale: Animated.multiply(scaleAnim, pulseAnim) }
              ]
            }
          ]}
        >
          <Ionicons 
            name="mic-circle" 
            size={120} 
            color="#FF9F4A" // Naranja del tema
          />
        </Animated.View>

        {/* Nombre de la app */}
        <Animated.View 
          style={[
            styles.titleContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <Text style={styles.appName}>{appName}</Text>
          <Text style={styles.subtitle}>Tu asistente personal</Text>
        </Animated.View>

        {/* Indicador de carga */}
        <Animated.View 
          style={[
            styles.loadingContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.loadingDots}>
            <Animated.View 
              style={[
                styles.dot,
                {
                  transform: [{ scale: pulseAnim }]
                }
              ]} 
            />
            <Animated.View 
              style={[
                styles.dot,
                {
                  transform: [{ scale: pulseAnim }]
                }
              ]} 
            />
            <Animated.View 
              style={[
                styles.dot,
                {
                  transform: [{ scale: pulseAnim }]
                }
              ]} 
            />
          </View>
          <Text style={styles.loadingText}>Cargando...</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4E6', // --background
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 40,
    backgroundColor: '#ffffff', // --card
    borderRadius: 80,
    padding: 20,
    elevation: 8,
    shadowColor: '#FF9F4A', // Naranja del tema
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appName: {
    fontSize: 48, // --text-3xl (2.4rem * 20px = 48px)
    fontWeight: '700', // --font-weight-medium
    color: '#1a1a1a', // --foreground
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 2,
    lineHeight: 67.2, // 1.4 line-height
  },
  subtitle: {
    fontSize: 28, // --text-lg (1.4rem * 20px = 28px)
    color: '#1a1a1a', // --foreground
    textAlign: 'center',
    fontWeight: '700', // --font-weight-medium
    fontStyle: 'italic',
    lineHeight: 39.2, // 1.4 line-height
  },
  loadingContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 100,
    width: '100%',
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF9F4A', // Naranja del tema
    marginHorizontal: 4,
  },
  loadingText: {
    fontSize: 28, // --text-lg (1.4rem * 20px = 28px)
    color: '#1a1a1a', // --foreground
    fontWeight: '700', // --font-weight-medium
    lineHeight: 39.2, // 1.4 line-height
  },
});
