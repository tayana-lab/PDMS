import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Modal, TouchableOpacity, Text, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LogOut, Settings, HelpCircle, User } from 'lucide-react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import MarketingCarousel from '@/components/dashboard/MarketingCarousel';
import ProgressDashboard from '@/components/dashboard/ProgressDashboard';
import QuickActions from '@/components/dashboard/QuickActions';

export default function HomeScreen() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();

  const handleProfilePress = () => {
    setShowProfileMenu(true);
  };

  const handleNotificationPress = () => {
    console.log('Notifications pressed');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  const menuItems = [
    { icon: User, label: 'Profile', onPress: () => router.push('/(tabs)/profile') },
    { icon: Settings, label: 'Settings', onPress: () => console.log('Settings') },
    { icon: HelpCircle, label: 'Help', onPress: () => console.log('Help') },
    { icon: LogOut, label: 'Logout', onPress: handleLogout, danger: true }
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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

      <Modal
        visible={showProfileMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowProfileMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowProfileMenu(false)}
        >
          <View style={styles.profileMenu}>
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => {
                    setShowProfileMenu(false);
                    item.onPress();
                  }}
                >
                  <IconComponent 
                    size={20} 
                    color={item.danger ? Colors.error : Colors.text.primary} 
                  />
                  <Text style={[
                    styles.menuItemText,
                    item.danger && { color: Colors.error }
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  profileMenu: {
    backgroundColor: Colors.background,
    marginTop: 100,
    marginLeft: Spacing.lg,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    minWidth: 180,
    ...Shadows.large
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md
  },
  menuItemText: {
    ...Typography.body,
    marginLeft: Spacing.md,
    fontWeight: '500'
  }
});