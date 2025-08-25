import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { progressData } from '@/constants/mockData';
import Card from '@/components/ui/Card';

interface ProgressBarProps {
  achieved: number;
  total: number;
  label: string;
}

function ProgressBar({ achieved, total, label }: ProgressBarProps) {
  const percentage = (achieved / total) * 100;
  
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>{label}</Text>
        <Text style={styles.progressText}>{achieved}/{total}</Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${percentage}%` }]} />
      </View>
      <Text style={styles.percentageText}>{percentage.toFixed(0)}%</Text>
    </View>
  );
}

interface StatCardProps {
  count: number;
  label: string;
}

function StatCard({ count, label }: StatCardProps) {
  return (
    <Card style={styles.statCard}>
      <Text style={styles.statNumber}>{count}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

export default function ProgressDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress Dashboard</Text>
      
      <Card style={styles.progressCard}>
        <ProgressBar
          achieved={progressData.todayTarget.achieved}
          total={progressData.todayTarget.total}
          label={progressData.todayTarget.label}
        />
        
        <ProgressBar
          achieved={progressData.overallTarget.achieved}
          total={progressData.overallTarget.total}
          label={progressData.overallTarget.label}
        />
      </Card>

      <View style={styles.statsRow}>
        <StatCard
          count={progressData.votersReached.count}
          label={progressData.votersReached.label}
        />
        <StatCard
          count={progressData.applicationsProcessed.count}
          label={progressData.applicationsProcessed.label}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg
  },
  title: {
    ...Typography.subtitle,
    marginBottom: Spacing.md
  },
  progressCard: {
    marginBottom: Spacing.md
  },
  progressContainer: {
    marginBottom: Spacing.lg
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
    ...Typography.caption,
    color: Colors.text.secondary
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    marginBottom: Spacing.xs
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm
  },
  percentageText: {
    ...Typography.small,
    color: Colors.primary,
    fontWeight: '600',
    textAlign: 'right'
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md
  },
  statNumber: {
    ...Typography.title,
    color: Colors.primary,
    fontWeight: '700'
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: Spacing.xs
  }
});