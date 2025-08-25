import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Modal, TouchableOpacity, Text, Alert, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LogOut, Settings, HelpCircle, User, Menu } from 'lucide-react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import MarketingCarousel from '@/components/dashboard/MarketingCarousel';
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
    <View style={styles.container}>
      <StatusBar 
        backgroundColor={Colors.primary} 
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'} 
      />
      
      <View style={[styles.safeContainer, { paddingTop: insets.top }]}>
        <Header
          onProfilePress={handleProfilePress}
          onNotificationPress={handleNotificationPress}
          notificationCount={5}
        />
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <MarketingCarousel />
          <QuickActions />
        </ScrollView>
      </View>

      <Modal
        visible={showProfileMenu}
        transparent
        animationType="slide"
        onRequestClose={() => setShowProfileMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowProfileMenu(false)}
        >
          <View style={[styles.profileMenu, { marginTop: insets.top + 60 }]}>
            <View style={styles.menuHeader}>
              <Menu size={24} color={Colors.primary} />
              <Text style={styles.menuTitle}>Menu</Text>
            </View>
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
    backgroundColor: Colors.primary
  },
  safeContainer: {
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
    marginLeft: Spacing.lg,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    minWidth: 220,
    maxWidth: 280,
    ...Shadows.large
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.sm
  },
  menuTitle: {
    ...Typography.subtitle,
    marginLeft: Spacing.md,
    fontWeight: '600',
    color: Colors.primary
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