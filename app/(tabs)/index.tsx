import React from 'react';
import { ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import Header from '@/components/layout/Header';
import MarketingCarousel from '@/components/dashboard/MarketingCarousel';
import ProgressDashboard from '@/components/dashboard/ProgressDashboard';
import QuickActions from '@/components/dashboard/QuickActions';

export default function HomeScreen() {
  const handleProfilePress = () => {
    console.log('Profile pressed - open side menu');
  };

  const handleNotificationPress = () => {
    console.log('Notifications pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onProfilePress={handleProfilePress}
        onNotificationPress={handleNotificationPress}
        notificationCount={5}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <MarketingCarousel />
        <ProgressDashboard />
        <QuickActions />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface
  },
  content: {
    flex: 1,
    paddingTop: Spacing.md
  }
});