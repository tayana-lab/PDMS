import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { AppSettingsProvider, useAppSettings } from "@/hooks/useAppSettings";
import Loader from "@/components/ui/Loader";

SplashScreen.preventAutoHideAsync();

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
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay to ensure everything is ready
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
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors?.background || '#FFFFFF' }]}>
        <Loader text="Initializing..." />
      </View>
    );
  }

  const statusBarStyle = currentTheme === 'dark' ? 'light' : 'dark';

  return (
    <>
      <StatusBar style={statusBarStyle} backgroundColor={colors.background} />
      <Stack screenOptions={{ headerBackTitle: "Back" }}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="new-user" options={{ 
          title: "New User Registration",
          headerBackTitle: "Back",
          headerStyle: { backgroundColor: colors?.surface || '#FFFFFF' },
          headerTintColor: colors?.text?.primary || '#000000'
        }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="search-voter" options={{ headerShown: false }} />
        <Stack.Screen name="help-desk" options={{ headerShown: false }} />
        <Stack.Screen name="edit-voter" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    const hideSplash = async () => {
      try {
        await SplashScreen.hideAsync();
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});