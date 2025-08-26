import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSettings } from '@/hooks/useAppSettings';

const { width, height } = Dimensions.get('window');

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
      <LinearGradient
        colors={[colors?.primary || '#E05716', colors?.secondary || '#138808']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Logo/Icon Container */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={[styles.logoCircle, { backgroundColor: colors?.text?.white || '#FFFFFF' }]}>
              <Text style={[styles.logoText, { color: colors?.primary || '#E05716' }]}>🏛️</Text>
            </View>
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

          {/* Decorative Elements */}
          <Animated.View
            style={[
              styles.decorativeContainer,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <View style={[styles.decorativeCircle, styles.circle1]} />
            <View style={[styles.decorativeCircle, styles.circle2]} />
            <View style={[styles.decorativeCircle, styles.circle3]} />
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
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
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
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logoText: {
    fontSize: 48,
    textAlign: 'center',
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
  decorativeContainer: {
    position: 'absolute',
    width: width,
    height: height,
    pointerEvents: 'none',
  },
  decorativeCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 100,
  },
  circle1: {
    width: 200,
    height: 200,
    top: -100,
    right: -100,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: -75,
    left: -75,
  },
  circle3: {
    width: 100,
    height: 100,
    top: height * 0.3,
    left: -50,
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