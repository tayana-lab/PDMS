import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Typography, Spacing, BorderRadius } from '@/constants/theme';
import { progressData } from '@/constants/mockData';
import { useAppSettings } from '@/hooks/useAppSettings';
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
  const { colors } = useAppSettings();
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text.primary }]}>Progress Dashboard</Text>
      
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
  }
});