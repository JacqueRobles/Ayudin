# Sistema de Estilos - Ayudín App

Este sistema proporciona una forma consistente y mantenible de gestionar estilos en toda la aplicación.

## 📁 Estructura de Archivos

```
styles/
├── index.ts          # Archivo índice que exporta todo
├── utils.ts          # Utilidades y helpers de estilos
└── README.md         # Esta documentación

constants/
└── tokens.ts         # Sistema de tokens de diseño
```

## 🎨 Sistema de Tokens

Los tokens centralizan todos los valores de diseño:

```typescript
import { tokens } from '@/constants/tokens';

// Colores
tokens.colors.background.primary    // #FFF4E6
tokens.colors.text.primary         // #1a1a1a
tokens.colors.status.success       // #4CAF50

// Espaciado
tokens.spacing.md                  // 16px
tokens.spacing.lg                  // 20px

// Tipografía
tokens.typography.sizes.lg         // 18px
tokens.typography.weights.bold     // '700'

// Bordes redondeados
tokens.borderRadius.lg             // 12px

// Sombras
tokens.shadows.md                  // Shadow style object
```

## 🛠️ Utilidades de Estilos

### Importación
```typescript
import { colors, spacing, layout, typography, shadows } from '@/styles';
```

### Colores
```typescript
// Colores de fondo
<View style={colors.bg.primary} />
<View style={colors.bg.secondary} />

// Colores de texto
<Text style={colors.text.primary} />
<Text style={colors.text.white} />

// Estados
<Text style={colors.status.success} />
<Text style={colors.status.warning} />
<Text style={colors.status.error} />
```

### Espaciado
```typescript
// Padding
<View style={spacing.p.md} />           // padding: 16px
<View style={spacing.px.lg} />          // paddingHorizontal: 20px
<View style={spacing.py.xl} />          // paddingVertical: 24px

// Margin
<View style={spacing.m.sm} />           // margin: 8px
<View style={spacing.mt.lg} />          // marginTop: 20px
<View style={spacing.mb.md} />          // marginBottom: 16px
```

### Layout
```typescript
// Flexbox
<View style={layout.flex.center} />     // justifyContent: 'center', alignItems: 'center'
<View style={layout.flex.between} />    // justifyContent: 'space-between'
<View style={layout.flex.row} />        // flexDirection: 'row'

// Tamaño completo
<View style={layout.fullWidth} />       // width: '100%'
<View style={layout.flex1} />           // flex: 1

// Bordes redondeados
<View style={layout.border.lg} />       // borderRadius: 12px
<View style={layout.border.full} />     // borderRadius: 9999px
```

### Tipografía
```typescript
// Tamaños de fuente
<Text style={typography.textSize.lg} />  // fontSize: 18px
<Text style={typography.textSize.xl} />  // fontSize: 20px

// Pesos de fuente
<Text style={typography.fontWeight.bold} />     // fontWeight: '700'
<Text style={typography.fontWeight.medium} />   // fontWeight: '500'

// Alturas de línea
<Text style={typography.leading.normal} />      // lineHeight: 1.4
<Text style={typography.leading.tight} />       // lineHeight: 1.2

// Alineación
<Text style={typography.textAlign.center} />    // textAlign: 'center'
```

### Sombras
```typescript
<View style={[styles.card, shadows.sm]} />
<View style={[styles.card, shadows.md]} />
<View style={[styles.card, shadows.lg]} />
```

## 💡 Ejemplos de Uso

### Componente Básico
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, layout, typography, shadows } from '@/styles';

export default function MyComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Título</Text>
      <View style={styles.card}>
        <Text style={styles.text}>Contenido</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...spacing.p.lg,
    ...colors.bg.primary,
  },

  title: {
    ...typography.textSize.xl,
    ...typography.fontWeight.bold,
    ...colors.text.primary,
    ...typography.textAlign.center,
    ...spacing.mb.md,
  },

  card: {
    ...spacing.p.md,
    ...colors.bg.secondary,
    ...layout.border.lg,
    ...shadows.sm,
  },

  text: {
    ...typography.textSize.md,
    ...colors.text.primary,
    ...typography.leading.normal,
  },
});
```

### Estados Dinámicos
```typescript
import { dynamicStyles } from '@/styles';

const currentStyles = isRecording ? dynamicStyles.recording : dynamicStyles.idle;

<View style={[styles.button, currentStyles.button]} />
```

### Estilos Condicionales
```typescript
import { conditionalStyles, combineStyles } from '@/styles';

const buttonStyle = combineStyles(
  styles.baseButton,
  conditionalStyles(isPressed, styles.pressedButton),
  conditionalStyles(isDisabled, styles.disabledButton)
);
```

## 🔧 Uso Correcto de Tipos

### Para componentes View:
```typescript
// ✅ Correcto - usar colores de fondo y layout
<View style={[
  colors.bg.primary,
  spacing.p.md,
  layout.flex.center,
  layout.border.lg
]} />
```

### Para componentes Text:
```typescript
// ✅ Correcto - usar colores de texto y tipografía
<Text style={[
  colors.textColor.primary,
  typography.textSize.lg,
  typography.fontWeight.bold,
  typography.textAlign.center
]} />
```

### Para estilos dinámicos:
```typescript
// ✅ Correcto - especificar el tipo de estilo
const customStyles = StyleSheet.create({
  container: {
    ...colors.bg.primary,
    ...spacing.p.md,
  } as ViewStyle,
});
```

## 🔄 Migración desde Código Anterior

### Antes (colores hardcodeados):
```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF4E6',
    padding: 20,
  },
  text: {
    color: '#1a1a1a',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF9F4A',
    borderRadius: 8,
    padding: 12,
  },
});
```

### Después (usando tokens):
```typescript
const styles = StyleSheet.create({
  container: {
    ...colors.bg.primary,
    ...spacing.p.xl,
  } as ViewStyle,

  text: {
    ...colors.textColor.primary,
    ...typography.textSize.md,
  } as TextStyle,

  button: {
    ...colors.idle.background,
    ...layout.border.md,
    ...spacing.p.lg,
  } as ViewStyle,
});
```

### Ejemplo completo corregido:
```typescript
import { colors, spacing, layout, typography, shadows } from '@/styles';

const styles = StyleSheet.create({
  container: {
    ...spacing.p.md,
    ...layout.flex.column,
    ...layout.flex.itemsCenter,  // ✅ Correcto
    ...colors.bg.primary,
  } as ViewStyle,

  button: {
    ...layout.border.xl,
    ...spacing.p.lg,
    ...shadows.lg,
    ...layout.flex.center,
    minWidth: 120,
  } as ViewStyle,

  buttonText: {
    ...typography.fontWeight.bold,
    ...typography.textSize.lg,
    ...colors.textColor.white,  // ✅ Usar textColor para texto
  } as TextStyle,
});
```

## 📱 Tema Claro/Oscuro

El sistema está preparado para soportar temas. Los tokens incluyen colores para ambos modos:

```typescript
// En el futuro, puedes hacer:
const currentTheme = isDarkMode ? tokens.colors.dark : tokens.colors.light;
```

## 🎯 Beneficios

1. **Consistencia**: Todos los componentes usan los mismos valores
2. **Mantenibilidad**: Cambiar un color actualiza toda la app
3. **Tema**: Fácil implementación de modo oscuro
4. **TypeScript**: Autocompletado y tipos seguros
5. **Escalabilidad**: Fácil agregar nuevos tokens
6. **Performance**: Estilos optimizados y reutilizables
