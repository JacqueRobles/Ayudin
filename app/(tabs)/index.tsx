import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Alert } from 'react-native';
import DateTimeBattery from '../../components/datetime-battery';
import InstructionSection from '../../components/instruction-section';
import RecordButton from '../../components/record-button';
import HomeButton from '../../components/home-button';

export default function HomeScreen() {
  const [isRecording, setIsRecording] = useState(false);

  /** Maneja el inicio/parada de grabación */
  const handleRecordingPress = () => {
    if (isRecording) {
      // Detener grabación
      setIsRecording(false);
    } else {
      // Iniciar grabación
      setIsRecording(true);
    }
  };

  /** Maneja el botón de inicio */
  const handleHomePress = () => {
    Alert.alert(
      "Botón de Inicio", 
      "¡Botón de inicio presionado! Aquí puedes agregar la funcionalidad que necesites.",
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <DateTimeBattery />
        <InstructionSection isRecording={isRecording} />
        <RecordButton 
          isRecording={isRecording} 
          onPress={handleRecordingPress} 
        />
      </View>
      <View style={styles.bottomSection}>
        <HomeButton 
          onPress={handleHomePress}
          icon="home"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4E6', // --background del esquema de colores
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
});
