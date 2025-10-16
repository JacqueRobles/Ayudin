/**
 * Sistema de tokens de diseño para la aplicación Ayudín
 * Centraliza colores, espaciado, tipografía y otros valores de diseño
 */

export const tokens = {
  // Colores principales
  colors: {
    // Base
    background: {
      primary: '#FFF4E6',     // Fondo principal de la app
      secondary: '#FFFFFF',   // Fondo de tarjetas/componentes
      dark: '#151718',        // Fondo oscuro para tema oscuro
    },

    // Textos
    text: {
      primary: '#1a1a1a',     // Texto principal
      secondary: '#687076',   // Texto secundario
      white: '#ffffff',       // Texto blanco
      light: '#ECEDEE',       // Texto claro para tema oscuro
    },

    // Estados
    status: {
      success: '#4CAF50',     // Verde para éxito/batería alta
      warning: '#FF9F4A',     // Naranja para batería media
      error: '#FF6B6B',       // Rojo para batería baja/grabando
      info: '#0a7ea4',        // Azul para información
    },

    // UI Elements
    ui: {
      primary: '#FF9F4A',     // Color principal de la marca
      primaryDark: '#E88A3A', // Variante más oscura
      accent: '#FF6B6B',      // Color de acento
      border: '#E0E0E0',     // Bordes
      shadow: '#000000',      // Sombras
    },

    // Estados específicos
    recording: {
      background: '#FF6B6B',  // Fondo cuando está grabando
      glow: 'rgba(255, 107, 107, 0.3)', // Brillo del botón de grabación
      shadow: '#FF6B6B',      // Sombra cuando graba
    },

    idle: {
      background: '#FF9F4A',   // Fondo cuando está idle
      shadow: '#FF9F4A',      // Sombra normal
    }
  },

  // Espaciado (basado en múltiplos de 4px para consistencia)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },

  // Bordes redondeados
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 20,
    full: 9999,
  },

  // Sombras
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
  },

  // Tipografía
  typography: {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 30,
      huge: 36,
      giant: 48,
      massive: 56,
    },
    weights: {
      light: '300' as const,
      normal: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
    }
  },

  // Tamaños de componentes
  sizes: {
    button: {
      sm: 40,
      md: 50,
      lg: 60,
      xl: 80,
      recording: 220,
    },
    icon: {
      sm: 16,
      md: 20,
      lg: 24,
      xl: 32,
      recording: 100,
    }
  }
} as const;

// Tipos TypeScript para mejor intellisense
export type TokenColors = typeof tokens.colors;
export type TokenSpacing = typeof tokens.spacing;
export type TokenBorderRadius = typeof tokens.borderRadius;
export type TokenTypography = typeof tokens.typography;
export type TokenSizes = typeof tokens.sizes;
