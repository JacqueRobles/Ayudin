import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import DateTimeBattery from '../../components/datetime-battery';
import RecordButton from '../../components/record-button';
import HomeButton from '../../components/home-button';
import { OpenAIService } from '../../services/openai';

export default function HomeScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);

  useEffect(() => {
    // Request audio recording permissions when component mounts
    const getPermissions = async () => {
      try {
        const { granted } = await Audio.requestPermissionsAsync();
        if (!granted) {
          Alert.alert('Permiso requerido', 'Se requiere permiso para acceder al micrófono');
        }
      } catch (err) {
        console.error('Error requesting audio recording permissions', err);
        Alert.alert('Error', 'No se pudo obtener permisos para el micrófono');
      }
    };

    getPermissions();
  }, []);

  /** Inicia la grabación de audio */
  const startRecording = async () => {
    try {
      // Clear previous transcription
      setTranscription(null);
      
      // Configure audio session for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      // Create and start new recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      
      // Provide haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'No se pudo iniciar la grabación');
    }
  };

  /** Detiene la grabación y procesa el audio */
  const stopRecording = async () => {
    if (!recording) return;
    
    try {
      setIsRecording(false);
      
      // Stop recording and unload
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      
      // Get the recording URI
      const uri = recording.getURI();
      setRecording(null);
      
      if (uri) {
        // Start transcription process
        await transcribeAudio(uri);
      }
      
      // Provide haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      console.error('Failed to stop recording', err);
      Alert.alert('Error', 'No se pudo detener la grabación');
    }
  };

  /** Transcribe el audio usando OpenAI Whisper */
  const transcribeAudio = async (audioUri: string) => {
    setIsProcessing(true);
    
    try {
      // Call OpenAI service to transcribe the audio
      const text = await OpenAIService.transcribeAudio(audioUri);
      
      // Update state with the transcription result
      setTranscription(text);
      
      // Cleanup: remove the temporary audio file
      try {
        await FileSystem.deleteAsync(audioUri);
      } catch (err) {
        console.warn('Error cleaning up audio file', err);
      }
    } catch (err) {
      console.error('Transcription failed', err);
      Alert.alert('Error', 'No se pudo transcribir el audio');
    } finally {
      setIsProcessing(false);
    }
  };

  /** Maneja el botón de grabación */
  const handleRecordingPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  /** Maneja el botón de inicio */
  const handleHomePress = () => {
    // Navegar a la pantalla de inicio usando el router
    router.push('/home');
    setTranscription(null); // También limpiar transcripción al navegar
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <DateTimeBattery />
        
        <RecordButton 
          isRecording={isRecording} 
          onPress={handleRecordingPress}
          recordingText={isProcessing ? 'Procesando...' : 'Tocar para parar'}
          idleText="Tocar para hablar"
        />
      </View>
      <View style={styles.bottomSection}>
        <HomeButton 
          onPress={handleHomePress}
          icon={transcription ? "refresh" : "home"}
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
    justifyContent: 'center',
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
