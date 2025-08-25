import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { User, Phone, MapPin, Settings, LogOut, Edit, Shield, Bell } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
  showArrow?: boolean;
}

function MenuItem({ icon, title, onPress, showArrow = true }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.menuItemLeft}>
        {icon}
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      {showArrow && <Text style={styles.arrow}>›</Text>}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();

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

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image
              source={{
                uri: user.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
              }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userRole}>{user.role}</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Edit size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileDetails}>
            <View style={styles.detailRow}>
              <Phone size={16} color={Colors.text.secondary} />
              <Text style={styles.detailText}>{user.phone}</Text>
            </View>
            <View style={styles.detailRow}>
              <MapPin size={16} color={Colors.text.secondary} />
              <Text style={styles.detailText}>{user.address}</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.menuCard}>
          <MenuItem
            icon={<Settings size={20} color={Colors.text.primary} />}
            title="Settings"
            onPress={handleSettings}
          />
          <MenuItem
            icon={<Bell size={20} color={Colors.text.primary} />}
            title="Notifications"
            onPress={handleNotifications}
          />
          <MenuItem
            icon={<Shield size={20} color={Colors.text.primary} />}
            title="Security"
            onPress={handleSecurity}
          />
        </Card>

        <View style={styles.logoutContainer}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface
  },
  header: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background
  },
  title: {
    ...Typography.title
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
    color: Colors.primary,
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
    marginLeft: Spacing.md,
    color: Colors.text.secondary
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
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
    ...Typography.title,
    color: Colors.text.light
  },
  logoutContainer: {
    marginTop: Spacing.lg
  },
  logoutButton: {
    borderColor: Colors.error
  }
});