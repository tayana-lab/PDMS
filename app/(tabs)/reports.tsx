import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { BarChart3, PieChart, TrendingUp, Users, FileText, Calendar } from 'lucide-react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';
import Card from '@/components/ui/Card';

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
}

const reportCards: ReportCard[] = [
  {
    id: '1',
    title: 'Total Voters Reached',
    description: 'This month',
    icon: <Users size={24} color={Colors.primary} />,
    value: '2,450',
    change: '+12%',
    changeType: 'positive'
  },
  {
    id: '2',
    title: 'Applications Processed',
    description: 'This week',
    icon: <FileText size={24} color={Colors.secondary} />,
    value: '156',
    change: '+8%',
    changeType: 'positive'
  },
  {
    id: '3',
    title: 'Events Organized',
    description: 'This month',
    icon: <Calendar size={24} color={Colors.accent} />,
    value: '12',
    change: '-2%',
    changeType: 'negative'
  },
  {
    id: '4',
    title: 'Target Achievement',
    description: 'Overall progress',
    icon: <TrendingUp size={24} color={Colors.success} />,
    value: '78%',
    change: '+5%',
    changeType: 'positive'
  }
];

const reportTypes = [
  {
    id: '1',
    title: 'Voter Analytics',
    description: 'Detailed voter engagement reports',
    icon: <BarChart3 size={32} color={Colors.primary} />
  },
  {
    id: '2',
    title: 'Application Reports',
    description: 'Status and processing analytics',
    icon: <PieChart size={32} color={Colors.secondary} />
  },
  {
    id: '3',
    title: 'Performance Dashboard',
    description: 'Target vs achievement analysis',
    icon: <TrendingUp size={32} color={Colors.accent} />
  },
  {
    id: '4',
    title: 'Event Reports',
    description: 'Event participation and feedback',
    icon: <Calendar size={32} color={Colors.success} />
  }
];

export default function ReportsScreen() {
  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return Colors.success;
      case 'negative':
        return Colors.error;
      default:
        return Colors.text.secondary;
    }
  };

  const handleReportPress = (reportId: string) => {
    console.log('Report pressed:', reportId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports & Analytics</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            {reportCards.map((card) => (
              <Card key={card.id} style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  {card.icon}
                  <Text style={[styles.change, { color: getChangeColor(card.changeType) }]}>
                    {card.change}
                  </Text>
                </View>
                <Text style={styles.metricValue}>{card.value}</Text>
                <Text style={styles.metricTitle}>{card.title}</Text>
                <Text style={styles.metricDescription}>{card.description}</Text>
              </Card>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detailed Reports</Text>
          {reportTypes.map((report) => (
            <TouchableOpacity
              key={report.id}
              onPress={() => handleReportPress(report.id)}
              activeOpacity={0.8}
            >
              <Card style={styles.reportCard}>
                <View style={styles.reportContent}>
                  <View style={styles.reportIcon}>
                    {report.icon}
                  </View>
                  <View style={styles.reportInfo}>
                    <Text style={styles.reportTitle}>{report.title}</Text>
                    <Text style={styles.reportDescription}>{report.description}</Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface
  },
  header: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background
  },
  title: {
    ...Typography.title
  },
  content: {
    flex: 1
  },
  section: {
    padding: Spacing.lg
  },
  sectionTitle: {
    ...Typography.subtitle,
    marginBottom: Spacing.md
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md
  },
  metricCard: {
    width: '47%',
    padding: Spacing.md
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm
  },
  change: {
    ...Typography.caption,
    fontWeight: '600'
  },
  metricValue: {
    ...Typography.title,
    fontWeight: '700',
    marginBottom: Spacing.xs
  },
  metricTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs
  },
  metricDescription: {
    ...Typography.caption,
    color: Colors.text.secondary
  },
  reportCard: {
    marginBottom: Spacing.md
  },
  reportContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  reportIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md
  },
  reportInfo: {
    flex: 1
  },
  reportTitle: {
    ...Typography.subtitle,
    marginBottom: Spacing.xs
  },
  reportDescription: {
    ...Typography.caption,
    color: Colors.text.secondary
  }
});