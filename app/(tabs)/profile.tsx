import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { User, Phone, MapPin, Settings, LogOut, Edit, Shield, Bell, Palette, Globe } from 'lucide-react-native';
import { router } from 'expo-router';
import { Typography, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useAppSettings } from '@/hooks/useAppSettings';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ThemeSelector from '@/components/ui/ThemeSelector';
import LanguageSelector from '@/components/ui/LanguageSelector';

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
  showArrow?: boolean;
}

function MenuItem({ icon, title, onPress, showArrow = true }: MenuItemProps) {
  const { colors } = useAppSettings();
  
  return (
    <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.menuItemLeft}>
        {icon}
        <Text style={[styles.menuItemText, { color: colors.text.primary }]}>{title}</Text>
      </View>
      {showArrow && <Text style={[styles.arrow, { color: colors.text.light }]}>›</Text>}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { colors, t, currentLanguage } = useAppSettings();
  const [showThemeSelector, setShowThemeSelector] = useState<boolean>(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState<boolean>(false);

  const handleEditProfile = () => {
    console.log('Edit profile');
  };

  const handleSettings = () => {
    console.log('Settings');
  };

  const handleNotifications = () => {
    console.log('Notifications');
  };

  const handleSecurity = () => {
    console.log('Security');
  };

  const handleTheme = () => {
    setShowThemeSelector(true);
  };

  const handleLanguage = () => {
    setShowLanguageSelector(true);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text.primary }]}>{t('profile')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={[styles.profileCard, { backgroundColor: colors.background }]}>
          <View style={styles.profileHeader}>
            <Image
              source={{
                uri: user.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
              }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: colors.text.primary }]}>{user.name}</Text>
              <Text style={[styles.userRole, { color: colors.primary }]}>{user.role}</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Edit size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileDetails}>
            <View style={styles.detailRow}>
              <Phone size={16} color={colors.text.secondary} />
              <Text style={[styles.detailText, { color: colors.text.secondary }]}>{user.phone}</Text>
            </View>
            <View style={styles.detailRow}>
              <MapPin size={16} color={colors.text.secondary} />
              <Text style={[styles.detailText, { color: colors.text.secondary }]}>{user.address}</Text>
            </View>
          </View>
        </Card>

        <Card style={[styles.menuCard, { backgroundColor: colors.background }]}>
          <MenuItem
            icon={<Palette size={20} color={colors.text.primary} />}
            title={t('theme')}
            onPress={handleTheme}
          />
          <MenuItem
            icon={<Globe size={20} color={colors.text.primary} />}
            title={t('language')}
            onPress={handleLanguage}
          />
          <MenuItem
            icon={<Settings size={20} color={colors.text.primary} />}
            title={t('settings')}
            onPress={handleSettings}
          />
          <MenuItem
            icon={<Bell size={20} color={colors.text.primary} />}
            title={t('notifications')}
            onPress={handleNotifications}
          />
          <MenuItem
            icon={<Shield size={20} color={colors.text.primary} />}
            title={t('security')}
            onPress={handleSecurity}
          />
        </Card>

        <View style={styles.logoutContainer}>
          <Button
            title={t('logout')}
            onPress={handleLogout}
            variant="outline"
            style={[styles.logoutButton, { borderColor: colors.error }]}
          />
        </View>
      </ScrollView>

      <ThemeSelector
        visible={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
      />
      
      <LanguageSelector
        visible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    padding: Spacing.lg,
    borderBottomWidth: 1
  },
  title: {
    ...Typography.title,
    textAlign:'center',
  },
  content: {
    flex: 1,
    padding: Spacing.lg
  },
  profileCard: {
    marginBottom: Spacing.lg
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: Spacing.md
  },
  profileInfo: {
    flex: 1
  },
  userName: {
    ...Typography.title,
    marginBottom: Spacing.xs
  },
  userRole: {
    ...Typography.body,
    fontWeight: '600'
  },
  editButton: {
    padding: Spacing.sm
  },
  profileDetails: {
    gap: Spacing.md
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  detailText: {
    ...Typography.body,
    marginLeft: Spacing.md
  },
  menuCard: {
    marginBottom: Spacing.lg,
    padding: 0
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  menuItemText: {
    ...Typography.body,
    marginLeft: Spacing.md
  },
  arrow: {
    ...Typography.title
  },
  logoutContainer: {
    marginTop: Spacing.lg
  },
  logoutButton: {
    // Dynamic border color applied inline
  }
});