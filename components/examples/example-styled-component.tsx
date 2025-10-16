/**
 * Ejemplo de componente usando el nuevo sistema de estilos
 * Muestra cómo usar tokens y utilidades en lugar de colores hardcodeados
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, layout, typography, shadows, dynamicStyles } from '@/styles';

interface ExampleStyledComponentProps {
  isRecording?: boolean;
  onPress?: () => void;
  title?: string;
}

export default function ExampleStyledComponent({
  isRecording = false,
  onPress,
  title = 'Ejemplo'
}: ExampleStyledComponentProps) {

  const currentStyles = isRecording ? dynamicStyles.recording : dynamicStyles.idle;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          currentStyles.button,
          isRecording && styles.buttonRecording
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {title}
        </Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Información
        </Text>
        <Text style={styles.cardText}>
          Este componente usa el nuevo sistema de estilos con tokens.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...spacing.p.md,
    ...layout.flex.column,
    ...layout.flex.itemsCenter,
    ...colors.bg.primary,
  },

  button: {
    ...layout.border.xl,
    ...spacing.p.lg,
    ...shadows.lg,
    ...layout.flex.center,
    minWidth: 120,
    borderWidth: 2,
    borderColor: 'white',
  },

  buttonRecording: {
    shadowOpacity: 0.5,
  },

  buttonText: {
    ...typography.fontWeight.bold,
    ...typography.textSize.lg,
    ...colors.textColor.white,
  },

  card: {
    ...spacing.p.md,
    ...spacing.mt.md,
    ...colors.bg.secondary,
    ...layout.border.lg,
    ...shadows.sm,
    width: '100%',
    maxWidth: 300,
  },

  cardTitle: {
    ...typography.textSize.lg,
    ...typography.fontWeight.semibold,
    ...colors.textColor.primary,
    ...spacing.mb.sm,
  },

  cardText: {
    ...typography.textSize.md,
    ...typography.leading.normal,
    ...colors.textColor.secondary,
  },
});
