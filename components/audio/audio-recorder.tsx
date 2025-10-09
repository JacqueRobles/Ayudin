import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Haptics from 'expo-haptics';

import { OpenAIService } from '../../services/openai';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

interface AudioRecorderProps {
  onTranscriptionComplete?: (text: string) => void;
  onError?: (error: Error) => void;
}

export const AudioRecorder = ({ onTranscriptionComplete, onError }: AudioRecorderProps) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);

  useEffect(() => {
    // Request audio recording permissions when component mounts
    const getPermissions = async () => {
      try {
        const { granted } = await Audio.requestPermissionsAsync();
        if (!granted) {
          alert('Permission to access microphone is required!');
        }
      } catch (err) {
        console.error('Error requesting audio recording permissions', err);
        onError?.(err as Error);
      }
    };

    getPermissions();
  }, [onError]);

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
      onError?.(err as Error);
    }
  };

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
      onError?.(err as Error);
    }
  };

  const transcribeAudio = async (audioUri: string) => {
    setIsProcessing(true);
    
    try {
      // Call OpenAI service to transcribe the audio
      const text = await OpenAIService.transcribeAudio(audioUri);
      
      // Update state and call callback
      setTranscription(text);
      onTranscriptionComplete?.(text);
      
      // Cleanup: remove the temporary audio file
      try {
        await FileSystem.deleteAsync(audioUri);
      } catch (err) {
        console.warn('Error cleaning up audio file', err);
      }
    } catch (err) {
      console.error('Transcription failed', err);
      onError?.(err as Error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        style={[
          styles.recordButton,
          isRecording ? styles.recordingActive : null,
          isProcessing ? styles.buttonDisabled : null,
        ]}
        onPress={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color="#FFFFFF" size="large" />
        ) : (
          <View style={isRecording ? styles.stopIcon : styles.recordIcon} />
        )}
      </TouchableOpacity>
      
      <ThemedText style={styles.instructions}>
        {isProcessing
          ? 'Processing your audio...'
          : isRecording
            ? 'Tap to stop recording'
            : 'Tap to start recording'}
      </ThemedText>

      {transcription && (
        <View style={styles.transcriptionContainer}>
          <ThemedText style={styles.transcriptionTitle}>Transcription:</ThemedText>
          <ThemedText style={styles.transcriptionText}>{transcription}</ThemedText>
        </View>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF4136',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  recordingActive: {
    backgroundColor: '#3D9970',
    transform: [{ scale: 1.1 }],
  },
  buttonDisabled: {
    backgroundColor: '#AAA',
    opacity: 0.7,
  },
  recordIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
  },
  stopIcon: {
    width: 30,
    height: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  instructions: {
    marginBottom: 20,
    textAlign: 'center',
  },
  transcriptionContainer: {
    width: '100%',
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  transcriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  transcriptionText: {
    lineHeight: 22,
  },
});