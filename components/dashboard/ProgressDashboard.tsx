import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useDashboardAnalytics } from '@/hooks/useApi';
import Card from '@/components/ui/Card';

interface ProgressBarProps {
  achieved: number;
  total: number;
  label: string;
}

function ProgressBar({ achieved, total, label }: ProgressBarProps) {
  const { colors } = useAppSettings();
  const percentage = (achieved / total) * 100;
  
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={[styles.progressLabel, { color: colors.text.primary }]}>{label}</Text>
        <Text style={[styles.progressText, { color: colors.text.secondary }]}>{achieved}/{total}</Text>
      </View>
      <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
        <View style={[styles.progressBar, { width: `${percentage}%`, backgroundColor: colors.primary }]} />
      </View>
      <Text style={[styles.percentageText, { color: colors.primary }]}>{percentage.toFixed(0)}%</Text>
    </View>
  );
}

export default function ProgressDashboard() {
  const { colors, t } = useAppSettings();
  const { data: analytics, isLoading, error } = useDashboardAnalytics();
  
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Progress Dashboard</Text>
        <Card style={[styles.progressCard, styles.loadingCard]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text.secondary }]}>Loading analytics...</Text>
        </Card>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Progress Dashboard</Text>
        <Card style={styles.progressCard}>
          <Text style={[styles.errorText, { color: colors.error }]}>Failed to load analytics</Text>
        </Card>
      </View>
    );
  }

  if (!analytics) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text.primary }]}>Progress Dashboard</Text>
      
      <Card style={styles.progressCard}>
        <ProgressBar
          achieved={analytics.approved_applications}
          total={analytics.total_applications}
          label="Applications Approved"
        />
        
        <ProgressBar
          achieved={analytics.active_karyakartas}
          total={analytics.active_karyakartas + 50} // Assuming target is current + 50
          label="Active Karyakartas"
        />
        
        <ProgressBar
          achieved={analytics.total_voters}
          total={analytics.total_voters + 1000} // Assuming target is current + 1000
          label="Registered Voters"
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg
  },
  title: {
    ...Typography.subtitle,
    marginBottom: Spacing.md
  },
  progressCard: {
    marginBottom: Spacing.lg
  },
  progressContainer: {
    marginBottom: Spacing.md
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm
  },
  progressLabel: {
    ...Typography.body,
    fontWeight: '600'
  },
  progressText: {
    ...Typography.caption
  },
  progressBarContainer: {
    height: 8,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    marginBottom: Spacing.xs
  },
  progressBar: {
    height: '100%',
    borderRadius: BorderRadius.sm
  },
  percentageText: {
    ...Typography.small,
    fontWeight: '600',
    textAlign: 'right'
  },
  loadingCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl
  },
  loadingText: {
    ...Typography.body,
    marginTop: Spacing.md
  },
  errorText: {
    ...Typography.body,
    textAlign: 'center',
    paddingVertical: Spacing.lg
  }
});