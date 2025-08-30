import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, router } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@/hooks/useAuth";
import { AppSettingsProvider, useAppSettings } from "@/hooks/useAppSettings";
import SplashScreen from "./splash";

ExpoSplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function RootLayoutNav() {
  const { user, isLoading: authLoading } = useAuth();
  const { isLoading: settingsLoading, colors, currentTheme } = useAppSettings();
  const [appReady, setAppReady] = useState(false);

  const isLoading = authLoading || settingsLoading || !appReady;

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Add any initialization logic here
        // Extended delay to show splash screen properly
        await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds to show splash screen
        setAppReady(true);
      } catch (error) {
        console.error('Error preparing app:', error);
        setAppReady(true); // Still set ready to avoid infinite loading
      }
    };

    prepareApp();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        if (user) {
          router.replace('/(tabs)');
        } else {
          router.replace('/login');
        }
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }
  }, [user, isLoading]);

  if (isLoading) {
    return <SplashScreen />;
  }

  const statusBarStyle = currentTheme === 'dark' ? 'light' : 'dark';

  return (
    <>
      <StatusBar style={statusBarStyle} backgroundColor={colors.background} />
      <Stack screenOptions={{ 
        headerBackTitle: "Back",
        gestureEnabled: true,
        animation: 'slide_from_right'
      }}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="new-user" options={{ 
          title: "New User Registration",
          headerBackTitle: "Back",
          headerStyle: { backgroundColor: colors?.surface || '#FFFFFF' },
          headerTintColor: colors?.text?.primary || '#000000'
        }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="search-voter" options={{ 
          headerShown: false,
          gestureEnabled: true,
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="help-desk" options={{ 
          headerShown: false,
          gestureEnabled: true,
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="edit-voter" options={{ 
          headerShown: false,
          gestureEnabled: true,
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="application-details" options={{ 
          headerShown: false,
          gestureEnabled: true,
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="notifications" options={{ 
          headerShown: false,
          gestureEnabled: true,
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    const hideSplash = async () => {
      try {
        await ExpoSplashScreen.hideAsync();
      } catch (error) {
        console.error('Error hiding splash screen:', error);
      }
    };

    // Hide splash screen after a short delay
    setTimeout(hideSplash, 100);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppSettingsProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RootLayoutNav />
        </GestureHandlerRootView>
      </AppSettingsProvider>
    </QueryClientProvider>
  );
}

