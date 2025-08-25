import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { quickActions } from '@/constants/mockData';
import Badge from '@/components/ui/Badge';

export default function QuickActions() {
  const handleActionPress = (route: string) => {
    console.log('Navigating to:', route);
    if (route === '/search-voter') {
      router.push('/search-voter');
    } else if (route === '/help-desk') {
      router.push('/help-desk');
    }
    // router.push(route);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.actionsScroll}
      >
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionCard}
            onPress={() => handleActionPress(action.route)}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Image source={{ uri: action.icon }} style={styles.actionIcon} />
              {action.badge > 0 && <Badge count={action.badge} />}
            </View>
            <Text 
              style={styles.actionLabel} 
              numberOfLines={1} 
              ellipsizeMode="tail"
            >
              {action.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg
  },
  title: {
    ...Typography.subtitle,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg
  },
  actionsScroll: {
    marginTop: Spacing.sm
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md
  },
  actionCard: {
    width: 120, // increased from 100 to fit longer text
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.small,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.md
  },
  iconContainer: {
    position: 'relative',
    marginBottom: Spacing.sm
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md
  },
  actionLabel: {
    ...Typography.caption,
    textAlign: 'center',
    fontWeight: '600'
  }
});