import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Platform, StyleSheet, View, Alert, TouchableOpacity } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { AudioRecorder } from '@/components/audio/audio-recorder';

export default function FeaturesScreen() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);

  const handleTranscriptionComplete = (text: string) => {
    setTranscription(text);
  };

  const handleError = (error: Error) => {
    Alert.alert('Error', error.message || 'An error occurred during transcription');
  };
  
  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'transcription':
        return (
          <View style={styles.featureContainer}>
            <ThemedText style={styles.featureTitle}>Voice to Text</ThemedText>
            <ThemedText style={styles.description}>
              Speak into your device&apos;s microphone and get real-time transcriptions using OpenAI&apos;s Whisper API.
            </ThemedText>
            
            <View style={styles.recorderContainer}>
              <AudioRecorder 
                onTranscriptionComplete={handleTranscriptionComplete}
                onError={handleError}
              />
            </View>
            
            {transcription && (
              <View style={styles.resultContainer}>
                <ThemedText style={styles.resultTitle}>Transcription Result:</ThemedText>
                <ThemedText style={styles.transcriptionText}>{transcription}</ThemedText>
              </View>
            )}
          </View>
        );
      default:
        return (
          <ThemedText style={styles.selectFeatureText}>
            Select a feature from above to get started.
          </ThemedText>
        );
    }
  };
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="star.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Features
        </ThemedText>
      </ThemedView>
      <ThemedText style={styles.subtitle}>Explore the different features available in this app.</ThemedText>
      
      <View style={styles.featuresMenu}>
        <TouchableOpacity
          style={[
            styles.featureButton,
            activeFeature === 'transcription' && styles.activeFeatureButton
          ]}
          onPress={() => setActiveFeature('transcription')}>
          <IconSymbol size={24} name="mic.fill" color={activeFeature === 'transcription' ? '#FFFFFF' : '#000000'} />
          <ThemedText style={[
            styles.featureButtonText,
            activeFeature === 'transcription' && styles.activeFeatureButtonText
          ]}>
            Voice Transcription
          </ThemedText>
        </TouchableOpacity>
        
        {/* Add more feature buttons here in the future */}
      </View>
      
      {renderFeatureContent()}
      <Collapsible title="File-based routing">
        <ThemedText>
          This app has two screens:{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Images">
        <ThemedText>
          For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
          different screen densities
        </ThemedText>
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={{ width: 100, height: 100, alignSelf: 'center' }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <ThemedText>
          This template has light and dark mode support. The{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
          what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <ThemedText>
          This template includes an example of an animated component. The{' '}
          <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
          the powerful{' '}
          <ThemedText type="defaultSemiBold" style={{ fontFamily: Fonts.mono }}>
            react-native-reanimated
          </ThemedText>{' '}
          library to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  featuresMenu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginVertical: 15,
    gap: 10,
  },
  featureButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 180,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeFeatureButton: {
    backgroundColor: '#0A84FF',
    borderColor: '#0A74E0',
  },
  featureButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeFeatureButtonText: {
    color: '#FFFFFF',
  },
  selectFeatureText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  featureContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  featureTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 25,
    lineHeight: 22,
  },
  recorderContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  resultContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  transcriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
