import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  FileText, 
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Info,
  Briefcase,
  Users
} from 'lucide-react-native';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useAppSettings } from '@/hooks/useAppSettings';
import applicationData from './ApplicationDetails.json';



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
  application_id: string;
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
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
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusInfo: {
    flex: 1,
  },
  applicationId: {
    ...Typography.title,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  submittedDate: {
    ...Typography.caption,
    marginBottom: Spacing.xs,
  },
  updatedDate: {
    ...Typography.caption,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  statusText: {
    ...Typography.body,
    fontWeight: '600',
  },
  sectionCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
    borderWidth: 1,
    borderColor: colors.border,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
  },
  fullWidth: {
    minWidth: '100%',
  },
  infoLabel: {
    ...Typography.caption,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  infoValue: {
    ...Typography.body,
    lineHeight: 20,
  },
  helpText: {
    ...Typography.body,
    lineHeight: 22,
    padding: Spacing.sm,
    backgroundColor: colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  documentsContainer: {
    gap: Spacing.sm,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.sm,
    backgroundColor: colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  documentName: {
    ...Typography.body,
    fontWeight: '500',
  },
  actionButtons: {
    gap: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  actionButton: {
    marginHorizontal: 0,
  },
});

export default function VoterRequestDetailsScreen() {
  const { requestId } = useLocalSearchParams();
  const { colors, t } = useAppSettings();
  const styles = createStyles(colors);

  // Find the application by ID
  const application = applicationData.applications.find(
    app => app.id === requestId || app.application_id === requestId
  ) as HelpDeskApplication | undefined;

  if (!application) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen
          options={{
            title: t('requestDetails') || 'Request Details',
            headerShown: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ArrowLeft size={24} color={colors.text.primary} />
              </TouchableOpacity>
            ),
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTitleStyle: {
              fontSize: 16,
              fontWeight: '600',
              color: colors.text.primary,
            },
          }}
        />
        <View style={styles.errorContainer}>
          <FileText size={48} color={colors.text.light} />
          <Text style={[styles.errorText, { color: colors.text.light }]}>
            {t('requestNotFound') || 'Request not found'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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

  const handleDocumentDownload = (documentUrl: string, index: number) => {
    Alert.alert(
      t('downloadDocument') || 'Download Document',
      t('downloadDocumentMessage') || 'Do you want to open this document?',
      [
        {
          text: t('cancel') || 'Cancel',
          style: 'cancel'
        },
        {
          text: t('open') || 'Open',
          onPress: () => {
            Linking.openURL(documentUrl).catch(() => {
              Alert.alert(
                t('error') || 'Error',
                t('cannotOpenDocument') || 'Cannot open document'
              );
            });
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = () => {
    const addressParts = [
      application.address_line1,
      application.address_line2,
      application.ward,
      application.panchayat || application.municipalitie || application.corporation,
      application.district,
      application.pincode
    ].filter(Boolean);
    
    return addressParts.join(', ');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: `${t('request') || 'Request'} #${application.application_id}`,
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text.primary} />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text.primary,
          },
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Header */}
        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusInfo}>
              <Text style={[styles.applicationId, { color: colors.text.primary }]}>
                {application.application_id}
              </Text>
              <Text style={[styles.submittedDate, { color: colors.text.secondary }]}>
                {t('submitted') || 'Submitted'}: {formatDate(application.created_at)}
              </Text>
              {application.updated_at !== application.created_at && (
                <Text style={[styles.updatedDate, { color: colors.text.secondary }]}>
                  {t('lastUpdated') || 'Last Updated'}: {formatDate(application.updated_at)}
                </Text>
              )}
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
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              {t('personalInformation') || 'Personal Information'}
            </Text>
          </View>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                {t('fullName') || 'Full Name'}
              </Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                {application.name}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                {t('voterId') || 'Voter ID'}
              </Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                {application.voter_id}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                {t('aadhaarNumber') || 'Aadhaar Number'}
              </Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                {application.aadhaar_number}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                {t('dateOfBirth') || 'Date of Birth'}
              </Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                {new Date(application.dob).toLocaleDateString('en-IN')}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                {t('gender') || 'Gender'}
              </Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                {application.gender}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                {t('religion') || 'Religion'}
              </Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                {application.religion}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                {t('caste') || 'Caste'}
              </Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                {application.caste}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                {t('maritalStatus') || 'Marital Status'}
              </Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                {application.marital_status}
              </Text>
            </View>
          </View>
        </Card>

        {/* Contact Information */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Phone size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              {t('contactInformation') || 'Contact Information'}
            </Text>
          </View>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                {t('mobileNumber') || 'Mobile Number'}
              </Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                {application.mobile_number}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                {t('email') || 'Email'}
              </Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                {application.email}
              </Text>
            </View>
          </View>
        </Card>

        {/* Address Information */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              {t('addressInformation') || 'Address Information'}
            </Text>
          </View>
          
          <View style={styles.infoGrid}>
            <View style={[styles.infoItem, styles.fullWidth]}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                {t('fullAddress') || 'Full Address'}
              </Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                {formatAddress()}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                {t('district') || 'District'}
              </Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                {application.district}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                {t('assemblyMandalam') || 'Assembly Mandalam'}
              </Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                {application.assembly_mandalam}
              </Text>
            </View>
          </View>
        </Card>

        {/* Professional Information */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Briefcase size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              {t('professionalInformation') || 'Professional Information'}
            </Text>
          </View>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                {t('occupation') || 'Occupation'}
              </Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                {application.occupation}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                {t('incomeRange') || 'Income Range'}
              </Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                {application.income_range}
              </Text>
            </View>
          </View>
        </Card>

        {/* Scheme Information */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Users size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              {t('schemeInformation') || 'Scheme Information'}
            </Text>
          </View>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                {t('benefitedFromScheme') || 'Previously Benefited from Scheme'}
              </Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                {application.benefited_scheme === 'YES' ? t('yes') || 'Yes' : t('no') || 'No'}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                {t('schemeId') || 'Scheme ID'}
              </Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                {application.scheme_id}
              </Text>
            </View>
          </View>
        </Card>

        {/* Help Required */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Info size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              {t('helpRequired') || 'Help Required'}
            </Text>
          </View>
          
          <Text style={[styles.helpText, { color: colors.text.primary }]}>
            {application.required_help || t('noHelpDetailsProvided') || 'No help details provided'}
          </Text>
        </Card>

        {/* Documents */}
        {application.documents && application.documents.length > 0 && (
          <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <FileText size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                {t('documents') || 'Documents'} ({application.documents.length})
              </Text>
            </View>
            
            <View style={styles.documentsContainer}>
              {application.documents.map((doc, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.documentItem}
                  onPress={() => handleDocumentDownload(doc, index)}
                >
                  <View style={styles.documentInfo}>
                    <FileText size={16} color={colors.primary} />
                    <Text style={[styles.documentName, { color: colors.text.primary }]}>
                      {t('document') || 'Document'} {index + 1}
                    </Text>
                  </View>
                  <Download size={16} color={colors.text.secondary} />
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title={t('updateStatus') || 'Update Status'}
            onPress={() => {
              Alert.alert(
                t('updateStatus') || 'Update Status',
                t('updateStatusMessage') || 'This feature will be available soon.',
                [{ text: t('ok') || 'OK' }]
              );
            }}
            variant="primary"
            style={styles.actionButton}
          />
          
          <Button
            title={t('addNotes') || 'Add Notes'}
            onPress={() => {
              Alert.alert(
                t('addNotes') || 'Add Notes',
                t('addNotesMessage') || 'This feature will be available soon.',
                [{ text: t('ok') || 'OK' }]
              );
            }}
            variant="secondary"
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

