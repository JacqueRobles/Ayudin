import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, typography, tokens } from '@/styles';

export default function AppStatusBar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(88);

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getBatteryIcon = () => {
    if (batteryLevel > 75) return 'battery-full';
    if (batteryLevel > 50) return 'battery-half';
    if (batteryLevel > 25) return 'battery-half';
    return 'battery-dead';
  };

  const getBatteryColor = () => {
    if (batteryLevel > 50) return tokens.colors.status.success;
    if (batteryLevel > 20) return tokens.colors.status.warning;
    return tokens.colors.status.error;
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
      </View>

      <View style={styles.rightSection}>
        <Ionicons
          name="cellular"
          size={16}
          color={tokens.colors.text.primary}
        />
        <Ionicons
          name="wifi"
          size={16}
          color={tokens.colors.text.primary}
          style={styles.iconSpacing}
        />
        <View style={styles.batteryContainer}>
          <Ionicons
            name={getBatteryIcon()}
            size={16}
            color={getBatteryColor()}
          />
          <Text style={[styles.batteryText, { color: getBatteryColor() }]}>
            {batteryLevel}%
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...spacing.p.md,
    ...spacing.pb.sm,
  },

  leftSection: {
    flex: 1,
  },

  timeText: {
    ...typography.textSize.md,
    ...typography.fontWeight.medium,
    ...colors.textColor.primary,
  },

  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconSpacing: {
    marginLeft: tokens.spacing.xs,
  },

  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: tokens.spacing.xs,
  },

  batteryText: {
    ...typography.textSize.xs,
    ...typography.fontWeight.medium,
    marginLeft: 2,
  },
});
