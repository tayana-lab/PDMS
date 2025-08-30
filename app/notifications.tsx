import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle, AlertCircle, Info, Clock } from 'lucide-react-native';
import Card from '@/components/ui/Card';
import { Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAppSettings } from '@/hooks/useAppSettings';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Application Approved',
    message: 'Your application for PM Kisan Samman Nidhi has been approved. Amount will be credited to your account within 7 working days.',
    timestamp: '2025-01-15T10:30:00Z',
    read: false,
    actionUrl: '/application-details?applicationId=VK202508130002'
  },
  {
    id: '2',
    type: 'info',
    title: 'New Scheme Available',
    message: 'Pradhan Mantri Awas Yojana - Urban is now accepting applications. Check eligibility and apply now.',
    timestamp: '2025-01-14T15:45:00Z',
    read: false
  },
  {
    id: '3',
    type: 'warning',
    title: 'Document Verification Pending',
    message: 'Your Aadhaar document verification is pending for application VK202508130001. Please submit required documents.',
    timestamp: '2025-01-13T09:15:00Z',
    read: true,
    actionUrl: '/application-details?applicationId=VK202508130001'
  },
  {
    id: '4',
    type: 'info',
    title: 'Meeting Reminder',
    message: 'BJP Ward Committee meeting scheduled for tomorrow at 6:00 PM at Community Hall.',
    timestamp: '2025-01-12T18:00:00Z',
    read: true
  },
  {
    id: '5',
    type: 'success',
    title: 'Profile Updated',
    message: 'Your voter profile has been successfully updated with new contact information.',
    timestamp: '2025-01-11T14:20:00Z',
    read: true
  }
];

export default function NotificationsScreen() {
  const { colors } = useAppSettings();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} color={colors.success} />;
      case 'warning':
        return <AlertCircle size={20} color={colors.warning} />;
      case 'error':
        return <AlertCircle size={20} color={colors.error} />;
      default:
        return <Info size={20} color={colors.primary} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    if (notification.actionUrl) {
      console.log('Navigating to:', notification.actionUrl);
      // For now, just log the action since we need to handle dynamic routes properly
    }
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Custom Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => {
              console.log('Notifications: Back button pressed');
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/(tabs)');
              }
            }} 
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.text.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.bjpLogo}>
            <Image 
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/200px-Bharatiya_Janata_Party_logo.svg.png' }}
              style={styles.bjpLogoImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </SafeAreaView>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.notificationsList}>
          {sampleNotifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              onPress={() => handleNotificationPress(notification)}
              disabled={!notification.actionUrl}
            >
              <Card style={[
                styles.notificationCard,
                !notification.read && styles.unreadCard
              ]}>
                <View style={styles.notificationHeader}>
                  <View style={styles.notificationIcon}>
                    {getNotificationIcon(notification.type)}
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={[
                      styles.notificationTitle,
                      !notification.read && styles.unreadTitle
                    ]}>
                      {notification.title}
                    </Text>
                    <Text style={styles.notificationMessage}>
                      {notification.message}
                    </Text>
                    <View style={styles.notificationMeta}>
                      <Clock size={12} color={colors.text.light} />
                      <Text style={styles.notificationTime}>
                        {formatTimestamp(notification.timestamp)}
                      </Text>
                    </View>
                  </View>
                  {!notification.read && (
                    <View style={[
                      styles.unreadIndicator,
                      { backgroundColor: getNotificationColor(notification.type) }
                    ]} />
                  )}
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    minHeight: 56,
  },
  backButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  headerTitle: {
    ...Typography.title,
    color: colors.text.white,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: Spacing.md,
  },
  bjpLogo: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    backgroundColor: colors.text.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  bjpLogoImage: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
  notificationsList: {
    padding: Spacing.md,
  },
  notificationCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    marginRight: Spacing.md,
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    ...Typography.subtitle,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  unreadTitle: {
    fontWeight: '700',
  },
  notificationMessage: {
    ...Typography.body,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  notificationTime: {
    ...Typography.caption,
    color: colors.text.light,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: Spacing.sm,
    marginTop: 6,
  },
});