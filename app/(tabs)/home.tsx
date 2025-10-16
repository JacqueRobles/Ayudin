import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ViewStyle, TextStyle } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, layout, shadows, tokens } from '@/styles';
import AppStatusBar from '@/components/status-bar';

interface AppItem {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route?: string;
  action?: () => void;
}

export default function HomeScreen() {
  const [currentPage, setCurrentPage] = React.useState(0);
  const appsPerPage = 6;

  const handleStartRecording = () => {
    router.push('/'); // Navegar a la pantalla principal de grabación
  };

  const handleViewFeatures = () => {
    router.push('/explore'); // Navegar a la pantalla de características
  };

  const handleOpenModal = () => {
    router.push('/modal'); // Abrir modal de ejemplo
  };

  const handleBackToMain = () => {
    router.push('/'); // Volver a la pantalla principal de grabación
  };

  const handleNextPage = () => {
    if (totalPages > 1) {
      setCurrentPage(prev => (prev + 1) % totalPages);
    }
  };

  const handlePrevPage = () => {
    if (totalPages > 1) {
      setCurrentPage(prev => (prev - 1 + totalPages) % totalPages);
    }
  };

  const handleAppPress = (app: AppItem) => {
    if (app.route) {
      router.push(app.route as any);
    } else if (app.action) {
      app.action();
    }
  };

  const allApps: AppItem[] = [
    {
      id: 'grabacion',
      name: 'GRABACIÓN',
      icon: 'mic-circle',
      color: tokens.colors.ui.primary, // Naranja principal de Ayudín
      action: handleStartRecording
    },
    {
      id: 'transcripcion',
      name: 'TRANSCRIPCIÓN',
      icon: 'document-text',
      color: tokens.colors.status.info, // Azul para transcripción
      action: handleStartRecording
    },
    {
      id: 'caracteristicas',
      name: 'CARACTERÍSTICAS',
      icon: 'star',
      color: tokens.colors.status.success, // Verde para características destacadas
      action: handleViewFeatures
    },
    {
      id: 'ajustes',
      name: 'AJUSTES',
      icon: 'settings',
      color: tokens.colors.text.secondary, // Gris para ajustes
      action: handleOpenModal
    },
    {
      id: 'historial',
      name: 'HISTORIAL',
      icon: 'time',
      color: tokens.colors.status.warning, // Naranja para historial
      action: handleViewFeatures
    },
    {
      id: 'ayuda',
      name: 'AYUDA',
      icon: 'help-circle',
      color: tokens.colors.recording.background, // Rojo para ayuda
      action: handleOpenModal
    },
    {
      id: 'notas',
      name: 'NOTAS',
      icon: 'document',
      color: tokens.colors.status.info, // Azul para notas
      action: handleOpenModal
    },
    {
      id: 'calculadora',
      name: 'CALCULADORA',
      icon: 'calculator',
      color: tokens.colors.status.success, // Verde para calculadora
      action: handleOpenModal
    },
    {
      id: 'fotos',
      name: 'FOTOS',
      icon: 'images',
      color: tokens.colors.ui.primary, // Naranja para fotos
      action: handleOpenModal
    },
    {
      id: 'musica',
      name: 'MÚSICA',
      icon: 'musical-notes',
      color: tokens.colors.status.warning, // Naranja para música
      action: handleOpenModal
    }
  ];

  const totalPages = Math.max(1, Math.ceil(allApps.length / appsPerPage));
  const currentApps = allApps.slice(
    Math.max(0, currentPage * appsPerPage),
    Math.min(allApps.length, (currentPage + 1) * appsPerPage)
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Status bar con hora, batería, etc. */}
      <AppStatusBar />

      {/* Contenido principal scrollable */}
      <View style={styles.contentContainer}>
        {/* Grid de aplicaciones (6 por página) */}
        <View style={styles.appsGrid}>
          {currentApps && currentApps.length > 0 && currentApps.map((app, index) => (
            <TouchableOpacity
              key={`${app.id}-${currentPage}`}
              style={[
                styles.appItem,
                { backgroundColor: app.color }
              ]}
              onPress={() => handleAppPress(app)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={app.icon}
                size={48} // Ícono proporcional al botón de 160x160
                color="white"
              />
              <Text style={styles.appName}>{app.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Controles inferiores fijos */}
      <View style={styles.bottomControls}>
        {/* Botón rojo para volver a pantalla principal */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToMain}
          activeOpacity={0.8}
        >
          <Ionicons name="home" size={28} color="white" />
          <Text style={styles.backButtonText}>VOLVER AL INICIO</Text>
        </TouchableOpacity>

        {/* Controles de navegación lateral */}
        <View style={styles.navigationControls}>
          <TouchableOpacity style={styles.navButton} onPress={handlePrevPage}>
            <Ionicons name="chevron-back" size={28} color={tokens.colors.text.primary} />
          </TouchableOpacity>

          <View style={styles.navDots}>
            {Array.from({ length: Math.max(1, totalPages) }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.navDot,
                  currentPage === index && styles.navDotActive
                ]}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.navButton} onPress={handleNextPage}>
            <Ionicons name="chevron-forward" size={28} color={tokens.colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background.primary,
  } as ViewStyle,

  contentContainer: {
    flex: 1,
  } as ViewStyle,

  bottomControls: {
    backgroundColor: tokens.colors.background.primary,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.ui.border,
  } as ViewStyle,

  appsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.xl,
    paddingBottom: tokens.spacing.xl,
  } as ViewStyle,

  appItem: {
    width: 160, // Tamaño más grande como en la imagen
    height: 160, // Tamaño más grande como en la imagen
    ...layout.border.lg,
    ...layout.flex.column,
    ...layout.flex.center,
    ...spacing.p.lg,
    margin: tokens.spacing.sm,
    ...shadows.lg,
  } as ViewStyle,

  appName: {
    fontSize: 16, // Tamaño más grande y legible
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginTop: tokens.spacing.md,
  } as TextStyle,

  backButton: {
    backgroundColor: tokens.colors.status.error,
    ...layout.border.lg,
    paddingHorizontal: tokens.spacing.xl,
    paddingVertical: tokens.spacing.lg,
    ...layout.flex.row,
    ...layout.flex.itemsCenter,
    ...layout.flex.center,
    ...spacing.mb.md,
    ...shadows.lg,
  } as ViewStyle,

  backButtonText: {
    fontSize: 20, // Tamaño más prominente
    fontWeight: '700',
    color: 'white',
    marginLeft: tokens.spacing.md,
  } as TextStyle,

  navigationControls: {
    ...layout.flex.row,
    ...layout.flex.itemsCenter,
    ...layout.flex.center,
  } as ViewStyle,

  navButton: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.lg,
    ...layout.border.lg,
    ...colors.bg.secondary,
    ...shadows.md,
  } as ViewStyle,

  navDots: {
    ...layout.flex.row,
    marginHorizontal: tokens.spacing.xl,
  } as ViewStyle,

  navDot: {
    width: 12, // Tamaño más grande (era 10px)
    height: 12, // Tamaño más grande (era 10px)
    ...layout.border.full,
    ...colors.bg.secondary,
    marginRight: tokens.spacing.sm,
  } as ViewStyle,

  navDotActive: {
    backgroundColor: tokens.colors.ui.primary,
  } as ViewStyle,
});

