import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Modal, TouchableOpacity, Text, Alert, StatusBar, Platform, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LogOut, Settings, HelpCircle, User, Menu, X } from 'lucide-react-native';
import { Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useAppSettings } from '@/hooks/useAppSettings';
import Header from '@/components/layout/Header';
import MarketingCarousel from '@/components/dashboard/MarketingCarousel';
import ProgressDashboard from '@/components/dashboard/ProgressDashboard';
import QuickActions from '@/components/dashboard/QuickActions';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = 280;

export default function HomeScreen() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sidebarAnimation] = useState(new Animated.Value(-SIDEBAR_WIDTH));
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const { colors, currentTheme, t } = useAppSettings();

  const handleProfilePress = () => {
    setShowProfileMenu(true);
    Animated.timing(sidebarAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(sidebarAnimation, {
      toValue: -SIDEBAR_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowProfileMenu(false);
    });
  };

  const handleNotificationPress = () => {
    console.log('Notifications pressed');
  };

  const handleLogout = () => {
    Alert.alert(
      t('logout'),
      'Are you sure you want to logout?',
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('logout'),
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
    { icon: User, label: t('profile'), onPress: () => router.push('/(tabs)/profile') },
    { icon: Settings, label: t('settings'), onPress: () => console.log('Settings') },
    { icon: HelpCircle, label: 'Help', onPress: () => console.log('Help') },
    { icon: LogOut, label: t('logout'), onPress: handleLogout, danger: true }
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        backgroundColor={colors.background} 
        barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} 
        translucent={false}
      />
      
      <View style={[styles.safeContainer, { paddingTop: insets.top }]}>
        <Header
          onProfilePress={handleProfilePress}
          onNotificationPress={handleNotificationPress}
          notificationCount={5}
        />
        
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <MarketingCarousel />
          <ProgressDashboard />
          <QuickActions />
        </ScrollView>
      </View>

      <Modal
        visible={showProfileMenu}
        transparent
        animationType="none"
        onRequestClose={closeSidebar}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.overlay}
            activeOpacity={1}
            onPress={closeSidebar}
          />
          <Animated.View 
            style={[
              styles.sidebar,
              {
                transform: [{ translateX: sidebarAnimation }],
                paddingTop: insets.top,
                backgroundColor: colors.surface
              }
            ]}
          >
            <View style={[styles.sidebarHeader, { backgroundColor: colors.primary }]}>
              <View style={styles.sidebarHeaderContent}>
                <View style={styles.profileSection}>
                  <View style={styles.profileAvatar}>
                    <User size={32} color={colors.surface} />
                  </View>
                  <View style={styles.profileInfo}>
                    <Text style={[styles.profileName, { color: colors.surface }]}>Karyakarta Name</Text>
                    <Text style={styles.profileRole}>BJP Member</Text>
                  </View>
                </View>

              </View>
            </View>
            
            <View style={styles.menuSection}>
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.sidebarMenuItem, { borderBottomColor: colors.border }]}
                    onPress={() => {
                      closeSidebar();
                      setTimeout(() => item.onPress(), 300);
                    }}
                  >
                    <View style={styles.menuItemIcon}>
                      <IconComponent 
                        size={22} 
                        color={item.danger ? colors.error : colors.text.primary} 
                      />
                    </View>
                    <Text style={[
                      styles.sidebarMenuItemText,
                      { color: item.danger ? colors.error : colors.text.primary }
                    ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  safeContainer: {
    flex: 1
  },
  content: {
    flex: 1
  },
  scrollContent: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'row'
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: SIDEBAR_WIDTH,
    height: '100%',
    ...Shadows.large,
    elevation: 16
  },
  sidebarHeader: {
    paddingBottom: Spacing.lg
  },
  sidebarHeaderContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md
  },
  profileInfo: {
    flex: 1
  },
  profileName: {
    ...Typography.subtitle,
    fontWeight: '600',
    marginBottom: 2
  },
  profileRole: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.8)'
  },

  menuSection: {
    paddingTop: Spacing.lg
  },
  sidebarMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1
  },
  menuItemIcon: {
    width: 40,
    alignItems: 'center'
  },
  sidebarMenuItemText: {
    ...Typography.body,
    fontWeight: '500'
  }
});