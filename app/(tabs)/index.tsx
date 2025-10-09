import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import DateTimeBattery from '../../components/datetime-battery';
import InstructionSection from '../../components/instruction-section';
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
    setTranscription(null);
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
        
        <View style={styles.transcriptionRectangle}>
          <View style={styles.transcriptionHeader}>
            <View style={styles.transcriptionDot} />
            <View style={styles.transcriptionTitleContainer}>
              <View style={styles.transcriptionLine} />
            </View>
          </View>
          <View style={styles.transcriptionContent}>
            {isRecording ? (
              <InstructionSection 
                isRecording={true} 
                recordingText="Te estoy escuchando..."
              />
            ) : isProcessing ? (
              <InstructionSection 
                isRecording={true} 
                recordingText="Procesando audio..."
              />
            ) : transcription ? (
              <>
                <InstructionSection 
                  isRecording={false} 
                  idleText="Transcripción:" 
                />
                <View style={styles.transcriptionTextContainer}>
                  <View style={styles.transcriptionText}>
                    {transcription.split(' ').map((word, index) => (
                      <View key={index} style={styles.wordContainer}>
                        <View style={styles.word}>
                          <InstructionSection 
                            isRecording={false} 
                            idleText={word} 
                          />
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              </>
            ) : (
              <InstructionSection 
                isRecording={false} 
                idleText="La transcripción aparecerá aquí" 
              />
            )}
          </View>
        </View>
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
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  transcriptionRectangle: {
    width: '100%',
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 150,
  },
  transcriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  transcriptionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF9F4A',
    marginRight: 8,
  },
  transcriptionTitleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  transcriptionLine: {
    height: 2,
    backgroundColor: '#FF9F4A',
    width: '100%',
  },
  transcriptionContent: {
    paddingHorizontal: 10,
  },
  transcriptionTextContainer: {
    paddingLeft: 20,
  },
  transcriptionText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wordContainer: {
    marginRight: 2,
    marginBottom: 2,
  },
  word: {
    transform: [{ scale: 0.7 }],
  },
});
