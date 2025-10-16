import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Alert, Text } from 'react-native';
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
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);

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
  
  // Manage cooldown timer
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    
    if (cooldownSeconds > 0) {
      intervalId = setInterval(() => {
        setCooldownSeconds((prevSeconds) => {
          const newSeconds = prevSeconds - 1;
          if (newSeconds <= 0) {
            setIsRateLimited(false);
            return 0;
          }
          return newSeconds;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [cooldownSeconds]);

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
      
      // Create and start new recording with lower quality to minimize file size
      // This helps avoid rate limiting by sending smaller files to OpenAI
      const lowQualityOptions = {
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 16000, // Lower sample rate (down from 44100)
          numberOfChannels: 1, // Mono instead of stereo
          bitRate: 64000, // Lower bit rate (down from 128000)
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          audioQuality: Audio.IOSAudioQuality.LOW, // Lower quality
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 64000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 64000,
        },
      };

      const { recording } = await Audio.Recording.createAsync(lowQualityOptions);
      
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
      const message = (err as any)?.message || '';
      const errorCode = (err as any)?.code;
      
      if (message.includes('Rate limit') || errorCode === 'RATE_LIMIT') {
        // Get retry-after header or default to 15 seconds
        const retryAfter = (err as any)?.retryAfter || 15;
        setCooldownSeconds(retryAfter);
        setIsRateLimited(true);
        
        Alert.alert(
          'Límite alcanzado',
          `Has enviado muchas solicitudes seguidas. El botón se habilitará en ${retryAfter} segundos.`
        );
      } else {
        Alert.alert('Error', 'No se pudo transcribir el audio');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  /** Maneja el botón de grabación con un pequeño retraso para prevenir envíos rápidos */
  const handleRecordingPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      // Small delay before starting to prevent rapid consecutive recordings
      // This helps prevent rate limiting by ensuring a gap between API calls
      setIsProcessing(true); // Disable button during the brief delay
      setTimeout(() => {
        startRecording();
        setIsProcessing(false);
      }, 300); // Brief delay for UI feedback and to prevent rapid clicks
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
          disabled={isRateLimited || isProcessing}
          recordingText={isProcessing ? 'Procesando...' : 'Tocar para parar'}
          idleText={isRateLimited ? `Espera ${cooldownSeconds}s...` : "Tocar para hablar"}
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
                  <Text style={styles.transcriptionFullText}>
                    {transcription}
                  </Text>
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
    paddingHorizontal: 15,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 10,
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
  transcriptionFullText: {
    fontSize: 20,
    color: '#1a1a1a',
    lineHeight: 28,
    paddingVertical: 12,
    fontWeight: '400',
    textAlign: 'left',
  },
});
