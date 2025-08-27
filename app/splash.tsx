import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSettings } from '@/hooks/useAppSettings';

export default function SplashScreen() {
  const { colors } = useAppSettings();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const animationSequence = Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]);

    animationSequence.start();
  }, [fadeAnim, scaleAnim, slideAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.background, { backgroundColor: colors?.primary || '#E05716' }]}>
        <View style={styles.content}>
          {/* Lotus Logo */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Image
              source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/x08umlzmbwrr0dyex4p5r' }}
              style={styles.lotusImage}
              resizeMode="contain"
            />
          </Animated.View>

          {/* App Title */}
          <Animated.View
            style={[
              styles.titleContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={[styles.appTitle, { color: colors?.text?.white || '#FFFFFF' }]}>
              Civic Portal
            </Text>
            <Text style={[styles.appSubtitle, { color: colors?.text?.white || '#FFFFFF' }]}>
              Digital Governance Platform
            </Text>
          </Animated.View>

          {/* Loading Indicator */}
          <Animated.View
            style={[
              styles.loadingContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.loadingBar}>
              <Animated.View
                style={[
                  styles.loadingProgress,
                  {
                    backgroundColor: colors?.text?.white || '#FFFFFF',
                    transform: [{ scaleX: scaleAnim }],
                  },
                ]}
              />
            </View>
            <Text style={[styles.loadingText, { color: colors?.text?.white || '#FFFFFF' }]}>
              Initializing...
            </Text>
          </Animated.View>
        </View>

        {/* Footer */}
        <Animated.View
          style={[
            styles.footer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={[styles.footerText, { color: colors?.text?.white || '#FFFFFF' }]}>
            Powered by Digital India Initiative
          </Text>
          <Text style={[styles.versionText, { color: colors?.text?.white || '#FFFFFF' }]}>
            Version 1.0.0
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lotusImage: {
    width: 150,
    height: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  appSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    opacity: 0.9,
    letterSpacing: 0.5,
  },
  loadingContainer: {
    alignItems: 'center',
    width: '100%',
  },
  loadingBar: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  loadingProgress: {
    height: '100%',
    borderRadius: 2,
    transformOrigin: 'left',
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
  },

  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
    marginBottom: 4,
  },
  versionText: {
    fontSize: 10,
    fontWeight: '400',
    opacity: 0.6,
  },
});