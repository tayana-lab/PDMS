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
  }
});