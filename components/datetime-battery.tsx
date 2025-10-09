import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DateTimeBattery() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(85);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simular cambio de batería (en una app real, usarías la Battery Status API)
    const batteryTimer = setInterval(() => {
      setBatteryLevel(prev => {
        const newLevel = prev - 1;
        return newLevel < 20 ? 100 : newLevel;
      });
    }, 60000);

    return () => {
      clearInterval(timer);
      clearInterval(batteryTimer);
    };
  }, []);

  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const dayName = days[currentTime.getDay()];
  const day = currentTime.getDate();
  const month = months[currentTime.getMonth()];
  const year = currentTime.getFullYear();
  const hours = String(currentTime.getHours()).padStart(2, '0');
  const minutes = String(currentTime.getMinutes()).padStart(2, '0');

  const getBatteryColor = () => {
    if (batteryLevel > 50) return '#4CAF50';
    if (batteryLevel > 20) return '#FF9F4A';
    return '#FF6B6B';
  };

  const getBatteryIcon = () => {
    if (batteryLevel > 75) return 'battery-full';
    if (batteryLevel > 50) return 'battery-half';
    if (batteryLevel > 25) return 'battery-half';
    return 'battery-dead';
  };

  return (
    <View style={styles.container}>
      {/* Fecha y Hora */}
      <View style={styles.dateTimeSection}>
        <Text style={styles.timeText}>
          {hours}:{minutes}
        </Text>
        <Text style={styles.dateText}>
          {dayName}, {day} de {month}
        </Text>
      </View>

      {/* Batería */}
      <View style={styles.batterySection}>
        <View style={styles.batteryContainer}>
          <Ionicons 
            name={getBatteryIcon()}
            size={96}
            color={getBatteryColor()}
          />
          <Text 
            style={[
              styles.batteryText,
              { color: getBatteryColor() }
            ]}
          >
            {batteryLevel}%
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateTimeSection: {
    alignItems: 'center',
    marginBottom: 12,
  },
  timeText: {
    fontSize: 56, // text-[2.8rem] (2.8rem * 20px = 56px)
    lineHeight: 56, // leading-none
    color: '#1a1a1a',
    fontWeight: '700', // font-bold
    marginBottom: 8, // mb-2
    textAlign: 'center',
  },
  dateText: {
    fontSize: 26, // text-[1.3rem] (1.3rem * 20px = 26px)
    lineHeight: 31.2, // leading-tight (1.2)
    color: '#1a1a1a',
    fontWeight: '700', // font-bold
    textAlign: 'center',
  },
  batterySection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  batteryContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  batteryText: {
    position: 'absolute',
    fontSize: 36, // text-[1.8rem] (1.8rem * 20px = 36px)
    fontWeight: '700', // font-bold
    textAlign: 'center',
  },
});
