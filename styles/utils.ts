/**
 * Utilidades de estilos para facilitar el uso de tokens de diseño
 */

import { TextStyle, ViewStyle } from 'react-native';
import { tokens } from '@/constants/tokens';

/**
 * Función helper para crear estilos usando tokens
 */
export const createStyles = <T extends Record<string, ViewStyle>>(
  styles: T
): T => styles;

/**
 * Utilidades de colores para fondos (ViewStyle)
 */
export const colors = {
  // Background colors
  bg: {
    primary: { backgroundColor: tokens.colors.background.primary } as ViewStyle,
    secondary: { backgroundColor: tokens.colors.background.secondary } as ViewStyle,
    dark: { backgroundColor: tokens.colors.background.dark } as ViewStyle,
  },

  // Text colors (para usar en componentes de texto)
  textColor: {
    primary: { color: tokens.colors.text.primary } as TextStyle,
    secondary: { color: tokens.colors.text.secondary } as TextStyle,
    white: { color: tokens.colors.text.white } as TextStyle,
    light: { color: tokens.colors.text.light } as TextStyle,
    success: { color: tokens.colors.status.success } as TextStyle,
    warning: { color: tokens.colors.status.warning } as TextStyle,
    error: { color: tokens.colors.status.error } as TextStyle,
  },

  // UI colors
  ui: {
    primary: { color: tokens.colors.ui.primary } as TextStyle,
    accent: { color: tokens.colors.ui.accent } as TextStyle,
  },

  // Recording state colors
  recording: {
    background: { backgroundColor: tokens.colors.recording.background } as ViewStyle,
    glow: { backgroundColor: tokens.colors.recording.glow } as ViewStyle,
    shadow: { shadowColor: tokens.colors.recording.shadow } as ViewStyle,
  },

  // Idle state colors
  idle: {
    background: { backgroundColor: tokens.colors.idle.background } as ViewStyle,
    shadow: { shadowColor: tokens.colors.idle.shadow } as ViewStyle,
  },
} as const;

/**
 * Utilidades de espaciado
 */
export const spacing = {
  // Padding
  p: {
    xs: { padding: tokens.spacing.xs },
    sm: { padding: tokens.spacing.sm },
    md: { padding: tokens.spacing.md },
    lg: { padding: tokens.spacing.lg },
    xl: { padding: tokens.spacing.xl },
    xxl: { padding: tokens.spacing.xxl },
  },

  // Padding horizontal
  px: {
    xs: { paddingHorizontal: tokens.spacing.xs },
    sm: { paddingHorizontal: tokens.spacing.sm },
    md: { paddingHorizontal: tokens.spacing.md },
    lg: { paddingHorizontal: tokens.spacing.lg },
    xl: { paddingHorizontal: tokens.spacing.xl },
    xxl: { paddingHorizontal: tokens.spacing.xxl },
  },

  // Padding vertical
  py: {
    xs: { paddingVertical: tokens.spacing.xs },
    sm: { paddingVertical: tokens.spacing.sm },
    md: { paddingVertical: tokens.spacing.md },
    lg: { paddingVertical: tokens.spacing.lg },
    xl: { paddingVertical: tokens.spacing.xl },
    xxl: { paddingVertical: tokens.spacing.xxl },
  },

  // Padding bottom
  pb: {
    xs: { paddingBottom: tokens.spacing.xs },
    sm: { paddingBottom: tokens.spacing.sm },
    md: { paddingBottom: tokens.spacing.md },
    lg: { paddingBottom: tokens.spacing.lg },
    xl: { paddingBottom: tokens.spacing.xl },
    xxl: { paddingBottom: tokens.spacing.xxl },
  },

  // Margin
  m: {
    xs: { margin: tokens.spacing.xs },
    sm: { margin: tokens.spacing.sm },
    md: { margin: tokens.spacing.md },
    lg: { margin: tokens.spacing.lg },
    xl: { margin: tokens.spacing.xl },
    xxl: { margin: tokens.spacing.xxl },
  },

  // Margin top
  mt: {
    xs: { marginTop: tokens.spacing.xs },
    sm: { marginTop: tokens.spacing.sm },
    md: { marginTop: tokens.spacing.md },
    lg: { marginTop: tokens.spacing.lg },
    xl: { marginTop: tokens.spacing.xl },
    xxl: { marginTop: tokens.spacing.xxl },
  },

  // Margin bottom
  mb: {
    xs: { marginBottom: tokens.spacing.xs },
    sm: { marginBottom: tokens.spacing.sm },
    md: { marginBottom: tokens.spacing.md },
    lg: { marginBottom: tokens.spacing.lg },
    xl: { marginBottom: tokens.spacing.xl },
    xxl: { marginBottom: tokens.spacing.xxl },
  },

  // Margin left
  ml: {
    xs: { marginLeft: tokens.spacing.xs },
    sm: { marginLeft: tokens.spacing.sm },
    md: { marginLeft: tokens.spacing.md },
    lg: { marginLeft: tokens.spacing.lg },
    xl: { marginLeft: tokens.spacing.xl },
    xxl: { marginLeft: tokens.spacing.xxl },
  },

  // Margin right
  mr: {
    xs: { marginRight: tokens.spacing.xs },
    sm: { marginRight: tokens.spacing.sm },
    md: { marginRight: tokens.spacing.md },
    lg: { marginRight: tokens.spacing.lg },
    xl: { marginRight: tokens.spacing.xl },
    xxl: { marginRight: tokens.spacing.xxl },
  },
};

/**
 * Utilidades de layout
 */
export const layout = {
  // Flex
  flex: {
    row: { flexDirection: 'row' as const },
    column: { flexDirection: 'column' as const },
    wrap: { flexWrap: 'wrap' as const },
    center: { justifyContent: 'center' as const, alignItems: 'center' as const },
    between: { justifyContent: 'space-between' as const },
    around: { justifyContent: 'space-around' as const },
    evenly: { justifyContent: 'space-evenly' as const },
    start: { justifyContent: 'flex-start' as const },
    end: { justifyContent: 'flex-end' as const },
    itemsCenter: { alignItems: 'center' as const },
    itemsStart: { alignItems: 'flex-start' as const },
    itemsEnd: { alignItems: 'flex-end' as const },
  },

  // Position
  absolute: { position: 'absolute' as const },
  relative: { position: 'relative' as const },

  // Size
  fullWidth: { width: '100%' as const },
  fullHeight: { height: '100%' as const },
  flex1: { flex: 1 },

  // Borders
  border: {
    sm: { borderRadius: tokens.borderRadius.sm },
    md: { borderRadius: tokens.borderRadius.md },
    lg: { borderRadius: tokens.borderRadius.lg },
    xl: { borderRadius: tokens.borderRadius.xl },
    xxl: { borderRadius: tokens.borderRadius.xxl },
    full: { borderRadius: tokens.borderRadius.full },
  },
} as const;

/**
 * Utilidades de sombras predefinidas
 */
export const shadows = {
  sm: tokens.shadows.sm,
  md: tokens.shadows.md,
  lg: tokens.shadows.lg,
};

/**
 * Utilidades de tipografía
 */
export const typography = {
  // Tamaños de fuente (para usar en componentes de texto)
  textSize: {
    xs: { fontSize: tokens.typography.sizes.xs } as TextStyle,
    sm: { fontSize: tokens.typography.sizes.sm } as TextStyle,
    md: { fontSize: tokens.typography.sizes.md } as TextStyle,
    lg: { fontSize: tokens.typography.sizes.lg } as TextStyle,
    xl: { fontSize: tokens.typography.sizes.xl } as TextStyle,
    xxl: { fontSize: tokens.typography.sizes.xxl } as TextStyle,
    xxxl: { fontSize: tokens.typography.sizes.xxxl } as TextStyle,
    huge: { fontSize: tokens.typography.sizes.huge } as TextStyle,
  },

  // Pesos de fuente (para usar en componentes de texto)
  fontWeight: {
    light: { fontWeight: tokens.typography.weights.light } as TextStyle,
    normal: { fontWeight: tokens.typography.weights.normal } as TextStyle,
    medium: { fontWeight: tokens.typography.weights.medium } as TextStyle,
    semibold: { fontWeight: tokens.typography.weights.semibold } as TextStyle,
    bold: { fontWeight: tokens.typography.weights.bold } as TextStyle,
  },

  // Alturas de línea (para usar en componentes de texto)
  leading: {
    tight: { lineHeight: tokens.typography.lineHeights.tight * tokens.typography.sizes.md } as TextStyle,
    normal: { lineHeight: tokens.typography.lineHeights.normal * tokens.typography.sizes.md } as TextStyle,
    relaxed: { lineHeight: tokens.typography.lineHeights.relaxed * tokens.typography.sizes.md } as TextStyle,
  },

  // Alineación de texto (para usar en componentes de texto)
  textAlign: {
    center: { textAlign: 'center' as const } as TextStyle,
    left: { textAlign: 'left' as const } as TextStyle,
    right: { textAlign: 'right' as const } as TextStyle,
  },
} as const;

/**
 * Función helper para combinar estilos
 */
export const combineStyles = (...styles: (ViewStyle | TextStyle | undefined | null | false)[]) => {
  return styles.filter(Boolean) as ViewStyle[];
};

/**
 * Función helper para crear estilos condicionales
 */
export const conditionalStyles = (condition: boolean, style: ViewStyle | TextStyle) => {
  return condition ? style : {};
};

/**
 * Función helper para estilos dinámicos basados en estado
 */
export const dynamicStyles = {
  recording: {
    container: {
      ...colors.recording.background,
      ...shadows.md,
    } as ViewStyle,
    button: {
      backgroundColor: tokens.colors.recording.background,
      shadowColor: tokens.colors.recording.shadow,
    } as ViewStyle,
  },
  idle: {
    container: {
      ...colors.idle.background,
      ...shadows.md,
    } as ViewStyle,
    button: {
      backgroundColor: tokens.colors.idle.background,
      shadowColor: tokens.colors.idle.shadow,
    } as ViewStyle,
  },
} as const;
