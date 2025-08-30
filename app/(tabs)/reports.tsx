import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart3, PieChart, TrendingUp, Users, FileText, Calendar } from 'lucide-react-native';
import { Typography, Spacing } from '@/constants/theme';
import { useAppSettings } from '@/hooks/useAppSettings';
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

export default function ReportsScreen() {
  const { colors } = useAppSettings();
  
  const reportCards: ReportCard[] = [
    {
      id: '1',
      title: 'Total Voters Reached',
      description: 'This month',
      icon: <Users size={24} color={colors.primary} />,
      value: '2,450',
      change: '+12%',
      changeType: 'positive'
    },
    {
      id: '2',
      title: 'Applications Processed',
      description: 'This week',
      icon: <FileText size={24} color={colors.secondary} />,
      value: '156',
      change: '+8%',
      changeType: 'positive'
    },
    {
      id: '3',
      title: 'Events Organized',
      description: 'This month',
      icon: <Calendar size={24} color={colors.accent} />,
      value: '12',
      change: '-2%',
      changeType: 'negative'
    },
    {
      id: '4',
      title: 'Target Achievement',
      description: 'Overall progress',
      icon: <TrendingUp size={24} color={colors.success} />,
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
      icon: <BarChart3 size={32} color={colors.primary} />
    },
    {
      id: '2',
      title: 'Application Reports',
      description: 'Status and processing analytics',
      icon: <PieChart size={32} color={colors.secondary} />
    },
    {
      id: '3',
      title: 'Performance Dashboard',
      description: 'Target vs achievement analysis',
      icon: <TrendingUp size={32} color={colors.accent} />
    },
    {
      id: '4',
      title: 'Event Reports',
      description: 'Event participation and feedback',
      icon: <Calendar size={32} color={colors.success} />
    }
  ];
  
  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return colors.success;
      case 'negative':
        return colors.error;
      default:
        return colors.text.secondary;
    }
  };

  const handleReportPress = (reportId: string) => {
    console.log('Report pressed:', reportId);
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <StatusBar 
        backgroundColor={colors.primary} 
        barStyle="light-content" 
        translucent={false}
      />
      
      {/* Custom Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>Reports & Analytics</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>
      
      <View style={styles.content}>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            {reportCards.map((card) => (
              <Card key={card.id} style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  {card.icon}
                  <Text style={[styles.change, { color: getChangeColor(card.changeType) }]}>
                    {card.change}
                  </Text>
                </View>
                <Text style={[styles.metricValue, { color: colors.text.primary }]}>{card.value}</Text>
                <Text style={[styles.metricTitle, { color: colors.text.primary }]}>{card.title}</Text>
                <Text style={[styles.metricDescription, { color: colors.text.secondary }]}>{card.description}</Text>
              </Card>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Detailed Reports</Text>
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
                    <Text style={[styles.reportTitle, { color: colors.text.primary }]}>{report.title}</Text>
                    <Text style={[styles.reportDescription, { color: colors.text.secondary }]}>{report.description}</Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
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
  headerSpacer: {
    width: 32,
  },
  headerTitle: {
    ...Typography.title,
    color: colors.text.white,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: Spacing.md,
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
    ...Typography.caption
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
    backgroundColor: colors.surface,
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
    ...Typography.caption
  }
});