import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Bell } from 'lucide-react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
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

  if (!showProfile || !user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.profileSection} onPress={onProfilePress}>
        <Image
          source={{
            uri: user.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
          }}
          style={styles.profileImage}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userAddress}>{user.address}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.notificationButton} onPress={onNotificationPress}>
        <Bell size={24} color={Colors.text.primary} />
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
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Spacing.md
  },
  userInfo: {
    flex: 1
  },
  userName: {
    ...Typography.body,
    fontWeight: '600'
  },
  userAddress: {
    ...Typography.caption,
    color: Colors.text.secondary
  },
  notificationButton: {
    position: 'relative',
    padding: Spacing.sm
  }
});