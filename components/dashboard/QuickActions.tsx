import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { quickActions } from '@/constants/mockData';
import Badge from '@/components/ui/Badge';

export default function QuickActions() {
  const handleActionPress = (route: string) => {
    console.log('Navigating to:', route);
    // router.push(route);
  };

  const renderActionGrid = () => {
    const rows = [];
    for (let i = 0; i < quickActions.length; i += 3) {
      const rowItems = quickActions.slice(i, i + 3);
      rows.push(
        <View key={i} style={styles.row}>
          {rowItems.map((action) => (
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
          {/* Fill empty slots in the last row */}
          {rowItems.length < 3 && (
            Array.from({ length: 3 - rowItems.length }).map((_, index) => (
              <View key={`empty-${index}`} style={styles.emptySlot} />
            ))
          )}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderActionGrid()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg
  },
  title: {
    ...Typography.subtitle,
    marginBottom: Spacing.md
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
    ...Shadows.small,
    borderWidth: 1,
    borderColor: Colors.border
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
  },
  emptySlot: {
    flex: 1,
    marginHorizontal: Spacing.xs
  }
});