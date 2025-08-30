import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell } from 'lucide-react-native';
import { Typography, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useAppSettings } from '@/hooks/useAppSettings';
import Badge from '@/components/ui/Badge';

interface HeaderProps {
  showProfile?: boolean;
  onProfilePress?: () => void;
  onNotificationPress?: () => void;
  notificationCount?: number;
}

export default function Header({
  showProfile = true,
  onProfilePress,
  onNotificationPress,
  notificationCount = 3
}: HeaderProps) {
  const { user } = useAuth();
  const { colors } = useAppSettings();

  if (!showProfile || !user) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
      <TouchableOpacity style={styles.profileSection} onPress={onProfilePress}>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.text.primary }]}>{user.name}</Text>
          <Text style={[styles.userAddress, { color: colors.text.secondary }]}>{user.address}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.notificationButton} onPress={onNotificationPress}>
        <Bell size={24} color={colors.text.primary} />
        {notificationCount > 0 && <Badge count={notificationCount} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },

  userInfo: {
    flex: 1
  },
  userName: {
    ...Typography.body,
    fontWeight: '600'
  },
  userAddress: {
    ...Typography.caption
  },
  notificationButton: {
    position: 'relative',
    padding: Spacing.sm
  }
});