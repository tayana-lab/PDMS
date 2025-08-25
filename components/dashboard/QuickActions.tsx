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
      <View style={styles.actionsGrid}>
        {quickActions.slice(0, 6).map((action) => (
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
            <Text style={styles.actionLabel}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {quickActions.length > 6 && (
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.additionalActions}
        >
          {quickActions.slice(6).map((action) => (
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
              <Text style={styles.actionLabel}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
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
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    justifyContent: 'space-between'
  },
  additionalActions: {
    marginTop: Spacing.md
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md
  },
  actionCard: {
    width: '31%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.small,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md
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