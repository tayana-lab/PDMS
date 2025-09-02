import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Edit3, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  User,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Heart,
  Download
} from 'lucide-react-native';
import Card from '@/components/ui/Card';
import { Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAppSettings } from '@/hooks/useAppSettings';
import applicationData from './ApplicationDetails.json';
import schemeData from './SchemeDetails.json';

interface HelpDeskApplication {
  id: string;
  user_id: string;
  name: string;
  voter_id: string;
  aadhaar_number: string;
  mobile_number: string;
  email: string;
  dob: string;
  gender: string;
  religion: string;
  caste: string;
  address_line1: string;
  address_line2: string;
  district: string;
  assembly_mandalam: string;
  panchayat: string | null;
  municipalitie: string | null;
  corporation: string | null;
  ward: string;
  pincode: string;
  occupation: string;
  marital_status: string;
  income_range: string;
  benefited_scheme: string;
  scheme_id: string;
  scheme_details: string;
  required_help: string;
  documents: string[];
  status: string;
  created_at: string;
  updated_at: string;
  state_id: string;
  district_id: string;
  mandal_id: string;
  ward_id: string;
  panchayath_id: string | null;
  municipalitie_id: string | null;
  corporation_id: string | null;
  application_id: string;
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
  editButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  placeholder: {
    width: 32,
    height: 32,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  statusCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusInfo: {
    flex: 1,
  },
  applicationId: {
    ...Typography.title,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  applicationDate: {
    ...Typography.caption,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
  },
  statusText: {
    ...Typography.body,
    fontWeight: '600',
  },
  sectionCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.subtitle,
    fontWeight: '600',
  },
  infoGrid: {
    gap: Spacing.md,
  },
  infoItem: {
    gap: Spacing.xs,
  },
  infoLabel: {
    ...Typography.caption,
    fontWeight: '600',
  },
  infoValue: {
    ...Typography.body,
  },
  helpText: {
    ...Typography.body,
    lineHeight: 22,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  documentText: {
    ...Typography.body,
    fontWeight: '600',
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  timelineDate: {
    ...Typography.caption,
  },
  bottomSpacing: {
    height: Spacing.xl,
  },
});

export default function ApplicationDetailsScreen() {
  const { applicationId } = useLocalSearchParams();
  const { colors } = useAppSettings();

  console.log('ApplicationDetails: Received applicationId:', applicationId);
  console.log('ApplicationDetails: Available applications:', applicationData.applications.map(app => ({ id: app.application_id, name: app.name })));

  let application = applicationData.applications.find(
    app => app.application_id === applicationId
  ) as HelpDeskApplication | undefined;

  // If not found in real data, create a dummy application for demo purposes
  if (!application && typeof applicationId === 'string') {
    console.log('ApplicationDetails: Creating dummy application for ID:', applicationId);
    
    // Determine details based on application ID
    let requiredHelp = 'Need assistance with application documentation.';
    let status = 'PENDING';
    let createdDate = new Date().toISOString();
    
    if (applicationId.includes('PMAY')) {
      requiredHelp = 'Document verification assistance required';
      status = 'PENDING';
      createdDate = '2024-01-15T10:30:00Z';
    } else if (applicationId.includes('PMKSN')) {
      requiredHelp = 'Bank account linking support';
      status = 'APPROVED';
      createdDate = '2024-01-10T14:20:00Z';
    } else if (applicationId.includes('ABHI')) {
      requiredHelp = 'Income certificate clarification needed';
      status = 'REJECTED';
      createdDate = '2024-01-05T09:15:00Z';
    }
    
    const scheme = schemeData.items[0]; // Use first scheme as default
    application = {
      id: `demo-${applicationId}`,
      user_id: 'demo-user',
      name: 'Rajesh Kumar',
      voter_id: 'EPIC100000',
      aadhaar_number: '123456789013',
      mobile_number: '9876543210',
      email: 'rajesh.kumar@example.com',
      dob: '1978-05-15T18:30:00',
      gender: 'MALE',
      religion: 'Hindu',
      caste: 'General',
      address_line1: 'MG Road',
      address_line2: 'Kochi',
      district: 'Ernakulam',
      assembly_mandalam: 'Kochi Central',
      panchayat: null,
      municipalitie: 'Kochi Corporation',
      corporation: null,
      ward: 'Ward 12',
      pincode: '682001',
      occupation: 'Business',
      marital_status: 'Married',
      income_range: '10-15L',
      benefited_scheme: 'NO',
      scheme_id: scheme?.id ?? 'scheme-demo',
      scheme_details: '',
      required_help: requiredHelp,
      documents: [
        'https://example.com/documents/application_form.pdf',
        'https://example.com/documents/supporting_docs.pdf'
      ],
      status: status,
      created_at: createdDate,
      updated_at: createdDate,
      state_id: 'kerala',
      district_id: 'ernakulam',
      mandal_id: 'ernakulam_kochi_central',
      ward_id: 'ernakulam_kochi_central_ward_12',
      panchayath_id: null,
      municipalitie_id: 'ernakulam_kochi_central_kochi_corporation',
      corporation_id: null,
      application_id: applicationId,
    } as HelpDeskApplication;
  }

  console.log('ApplicationDetails: Found application:', application ? application.name : 'NOT FOUND');

  const scheme = schemeData.items.find(
    s => s.id === application?.scheme_id
  );

  const styles = createStyles(colors);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return colors.warning;
      case 'APPROVED':
        return colors.success;
      case 'REJECTED':
        return colors.error;
      default:
        return colors.text.secondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return <Clock size={20} color={colors.warning} />;
      case 'APPROVED':
        return <CheckCircle size={20} color={colors.success} />;
      case 'REJECTED':
        return <XCircle size={20} color={colors.error} />;
      default:
        return <FileText size={20} color={colors.text.secondary} />;
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleDownloadDocument = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open document URL');
      }
    } catch {
      Alert.alert('Error', 'Failed to open document');
    }
  };

  const handleEdit = () => {
    Alert.alert(
      'Edit Application',
      'This would open the edit form for this application.',
      [{ text: 'OK' }]
    );
  };

  if (!application) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        
        {/* Custom Header */}
        <SafeAreaView edges={['top']} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              onPress={() => {
                console.log('Application Details: Back button pressed (not found case)');
                try {
                  if (router.canGoBack()) {
                    console.log('Going back...');
                    router.back();
                  } else {
                    console.log('Cannot go back, replacing with tabs...');
                    router.replace('/(tabs)');
                  }
                } catch (error) {
                  console.error('Navigation error:', error);
                  router.replace('/(tabs)');
                }
              }} 
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={colors.text.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Application Details</Text>
            <View style={styles.placeholder} />
          </View>
        </SafeAreaView>
        <View style={styles.errorContainer}>
          <FileText size={48} color={colors.text.light} />
          <Text style={[styles.errorText, { color: colors.text.light }]}>
            Application not found
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Custom Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => {
              console.log('Application Details: Back button pressed');
              try {
                if (router.canGoBack()) {
                  console.log('Going back...');
                  router.back();
                } else {
                  console.log('Cannot go back, replacing with tabs...');
                  router.replace('/(tabs)');
                }
              } catch (error) {
                console.error('Navigation error:', error);
                router.replace('/(tabs)');
              }
            }} 
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.text.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Application Details</Text>
          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            <Edit3 size={20} color={colors.text.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Header */}
        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusInfo}>
              <Text style={[styles.applicationId, { color: colors.text.primary }]}>
                {application.application_id}
              </Text>
              <Text style={[styles.applicationDate, { color: colors.text.secondary }]}>
                Submitted: {new Date(application.created_at).toLocaleDateString()}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(application.status) + '20' }]}>
              {getStatusIcon(application.status)}
              <Text style={[styles.statusText, { color: getStatusColor(application.status) }]}>
                {application.status}
              </Text>
            </View>
          </View>
        </Card>

        {/* Personal Information */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <User size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Personal Information</Text>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Name</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{application.name}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Voter ID</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{application.voter_id}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Aadhaar Number</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{application.aadhaar_number}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Age & Gender</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                {calculateAge(application.dob)} years, {application.gender}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Date of Birth</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                {new Date(application.dob).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Religion</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{application.religion}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Caste</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{application.caste}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Marital Status</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{application.marital_status}</Text>
            </View>
          </View>
        </Card>

        {/* Contact Information */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Phone size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Contact Information</Text>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Mobile Number</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{application.mobile_number}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Email</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{application.email}</Text>
            </View>
          </View>
        </Card>

        {/* Address Information */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Address Information</Text>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Address Line 1</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{application.address_line1}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Address Line 2</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{application.address_line2}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>District</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{application.district}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Assembly Mandalam</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{application.assembly_mandalam}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Ward</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{application.ward}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Pincode</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{application.pincode}</Text>
            </View>
            {application.panchayat && (
              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Panchayat</Text>
                <Text style={[styles.infoValue, { color: colors.text.primary }]}>{application.panchayat}</Text>
              </View>
            )}
            {application.municipalitie && (
              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Municipality</Text>
                <Text style={[styles.infoValue, { color: colors.text.primary }]}>{application.municipalitie}</Text>
              </View>
            )}
            {application.corporation && (
              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Corporation</Text>
                <Text style={[styles.infoValue, { color: colors.text.primary }]}>{application.corporation}</Text>
              </View>
            )}
          </View>
        </Card>

        {/* Professional Information */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Briefcase size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Professional Information</Text>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Occupation</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{application.occupation}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Income Range</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{application.income_range}</Text>
            </View>
          </View>
        </Card>

        {/* Scheme Information */}
        {scheme && (
          <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Heart size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Scheme Information</Text>
            </View>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Scheme Name</Text>
                <Text style={[styles.infoValue, { color: colors.text.primary }]}>{scheme.name}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Category</Text>
                <Text style={[styles.infoValue, { color: colors.text.primary }]}>{scheme.category}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Budget</Text>
                <Text style={[styles.infoValue, { color: colors.text.primary }]}>₹{scheme.budget.toLocaleString()}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Previously Benefited</Text>
                <Text style={[styles.infoValue, { color: colors.text.primary }]}>{application.benefited_scheme}</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Help Required */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <FileText size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Help Required</Text>
          </View>
          <Text style={[styles.helpText, { color: colors.text.primary }]}>
            {application.required_help}
          </Text>
        </Card>

        {/* Documents */}
        {application.documents.length > 0 && (
          <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <FileText size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Documents</Text>
            </View>
            {application.documents.map((doc, index) => (
              <TouchableOpacity
                key={index}
                style={styles.documentItem}
                onPress={() => handleDownloadDocument(doc)}
              >
                <Download size={16} color={colors.primary} />
                <Text style={[styles.documentText, { color: colors.primary }]}>
                  Document {index + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </Card>
        )}

        {/* Timeline */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Timeline</Text>
          </View>
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: colors.success }]} />
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineTitle, { color: colors.text.primary }]}>Application Submitted</Text>
              <Text style={[styles.timelineDate, { color: colors.text.secondary }]}>
                {new Date(application.created_at).toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: colors.warning }]} />
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineTitle, { color: colors.text.primary }]}>Last Updated</Text>
              <Text style={[styles.timelineDate, { color: colors.text.secondary }]}>
                {new Date(application.updated_at).toLocaleString()}
              </Text>
            </View>
          </View>
        </Card>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}