import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, FileText, Calendar, User, Phone, Mail, MapPin, Briefcase, Heart } from 'lucide-react-native';
import { Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAppSettings } from '@/hooks/useAppSettings';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import schemeData from './SchemeDetails.json';

interface GovernmentScheme {
  id: string;
  name: string;
  category: string;
  description: string;
  beneficiaries: string;
  budget: number;
  status: string;
  min_age: number;
  max_age: number;
  gender: string;
  official_site?: string | null;
}

interface ApplicationForm {
  // Personal Information
  fullName: string;
  voterId: string;
  aadhaarNumber: string;
  mobileNumber: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  religion: string;
  caste: string;
  
  // Address Information
  addressLine1: string;
  addressLine2: string;
  district: string;
  assemblyMandalam: string;
  panchayat: string;
  municipality: string;
  corporation: string;
  ward: string;
  pincode: string;
  
  // Additional Information
  occupation: string;
  maritalStatus: string;
  incomeRange: string;
  benefitedScheme: string;
  requiredHelp: string;
}

const initialFormData: ApplicationForm = {
  fullName: '',
  voterId: '',
  aadhaarNumber: '',
  mobileNumber: '',
  email: '',
  dateOfBirth: '',
  gender: '',
  religion: '',
  caste: '',
  addressLine1: '',
  addressLine2: '',
  district: '',
  assemblyMandalam: '',
  panchayat: '',
  municipality: '',
  corporation: '',
  ward: '',
  pincode: '',
  occupation: '',
  maritalStatus: '',
  incomeRange: '',
  benefitedScheme: 'NO',
  requiredHelp: ''
};

const genderOptions = ['MALE', 'FEMALE', 'OTHER'];
const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];
const incomeRangeOptions = ['Below 1L', '1-3L', '3-5L', '5-10L', '10L+'];

export default function ApplySchemeScreen() {
  const { schemeId } = useLocalSearchParams<{ schemeId: string }>();
  const [scheme, setScheme] = useState<GovernmentScheme | null>(null);
  const [formData, setFormData] = useState<ApplicationForm>(initialFormData);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { colors } = useAppSettings();

  const totalSteps = 4;

  useEffect(() => {
    if (schemeId) {
      const foundScheme = schemeData.items.find(item => item.id === schemeId);
      if (foundScheme) {
        setScheme(foundScheme);
        console.log('ApplyScheme: Found scheme:', foundScheme.name);
      } else {
        console.log('ApplyScheme: Scheme not found for ID:', schemeId);
        Alert.alert('Error', 'Scheme not found');
        router.back();
      }
    }
  }, [schemeId]);

  const updateFormData = (field: keyof ApplicationForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Personal Information
        return !!(formData.fullName && formData.voterId && formData.aadhaarNumber && 
                 formData.mobileNumber && formData.dateOfBirth && formData.gender);
      case 2: // Address Information
        return !!(formData.addressLine1 && formData.district && formData.pincode);
      case 3: // Additional Information
        return !!(formData.occupation && formData.maritalStatus && formData.incomeRange);
      case 4: // Review
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      Alert.alert('Incomplete Information', 'Please fill in all required fields before proceeding.');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      Alert.alert('Incomplete Application', 'Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const applicationId = `VK${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
      
      console.log('Application submitted:', {
        applicationId,
        schemeId: scheme?.id,
        schemeName: scheme?.name,
        applicantData: formData
      });
      
      Alert.alert(
        'Application Submitted Successfully!',
        `Your application has been submitted with ID: ${applicationId}\n\nYou will receive updates on your registered mobile number and email.`,
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/(tabs)/applications');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting application:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        
        return (
          <View key={stepNumber} style={styles.stepItem}>
            <View style={[
              styles.stepCircle,
              {
                backgroundColor: isActive ? colors.primary : isCompleted ? colors.success : colors.border,
                borderColor: isActive ? colors.primary : isCompleted ? colors.success : colors.border
              }
            ]}>
              <Text style={[
                styles.stepNumber,
                { color: isActive || isCompleted ? colors.text.white : colors.text.secondary }
              ]}>
                {stepNumber}
              </Text>
            </View>
            {stepNumber < totalSteps && (
              <View style={[
                styles.stepLine,
                { backgroundColor: stepNumber < currentStep ? colors.success : colors.border }
              ]} />
            )}
          </View>
        );
      })}
    </View>
  );

  const renderPersonalInformation = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text.primary }]}>Personal Information</Text>
      
      <Input
        label="Full Name *"
        placeholder="Enter your full name"
        value={formData.fullName}
        onChangeText={(value) => updateFormData('fullName', value)}
        leftIcon={<User size={20} color={colors.text.secondary} />}
        style={styles.input}
      />
      
      <Input
        label="Voter ID *"
        placeholder="Enter your voter ID"
        value={formData.voterId}
        onChangeText={(value) => updateFormData('voterId', value.toUpperCase())}
        leftIcon={<FileText size={20} color={colors.text.secondary} />}
        style={styles.input}
        autoCapitalize="characters"
      />
      
      <Input
        label="Aadhaar Number *"
        placeholder="Enter your 12-digit Aadhaar number"
        value={formData.aadhaarNumber}
        onChangeText={(value) => updateFormData('aadhaarNumber', value.replace(/\D/g, '').slice(0, 12))}
        leftIcon={<FileText size={20} color={colors.text.secondary} />}
        style={styles.input}
        keyboardType="numeric"
        maxLength={12}
      />
      
      <Input
        label="Mobile Number *"
        placeholder="Enter your mobile number"
        value={formData.mobileNumber}
        onChangeText={(value) => updateFormData('mobileNumber', value.replace(/\D/g, '').slice(0, 10))}
        leftIcon={<Phone size={20} color={colors.text.secondary} />}
        style={styles.input}
        keyboardType="phone-pad"
        maxLength={10}
      />
      
      <Input
        label="Email"
        placeholder="Enter your email address"
        value={formData.email}
        onChangeText={(value) => updateFormData('email', value.toLowerCase())}
        leftIcon={<Mail size={20} color={colors.text.secondary} />}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <Input
        label="Date of Birth *"
        placeholder="DD/MM/YYYY"
        value={formData.dateOfBirth}
        onChangeText={(value) => {
          // Format as DD/MM/YYYY
          const cleaned = value.replace(/\D/g, '');
          let formatted = cleaned;
          if (cleaned.length >= 2) {
            formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
          }
          if (cleaned.length >= 4) {
            formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
          }
          updateFormData('dateOfBirth', formatted);
        }}
        leftIcon={<Calendar size={20} color={colors.text.secondary} />}
        style={styles.input}
        keyboardType="numeric"
        maxLength={10}
      />
      
      <Text style={[styles.fieldLabel, { color: colors.text.primary }]}>Gender *</Text>
      <View style={styles.optionContainer}>
        {genderOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              {
                backgroundColor: formData.gender === option ? colors.primary : colors.surface,
                borderColor: formData.gender === option ? colors.primary : colors.border
              }
            ]}
            onPress={() => updateFormData('gender', option)}
          >
            <Text style={[
              styles.optionText,
              { color: formData.gender === option ? colors.text.white : colors.text.primary }
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Input
        label="Religion"
        placeholder="Enter your religion"
        value={formData.religion}
        onChangeText={(value) => updateFormData('religion', value)}
        leftIcon={<Heart size={20} color={colors.text.secondary} />}
        style={styles.input}
      />
      
      <Input
        label="Caste"
        placeholder="Enter your caste"
        value={formData.caste}
        onChangeText={(value) => updateFormData('caste', value)}
        style={styles.input}
      />
    </View>
  );

  const renderAddressInformation = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text.primary }]}>Address Information</Text>
      
      <Input
        label="Address Line 1 *"
        placeholder="House number, street name"
        value={formData.addressLine1}
        onChangeText={(value) => updateFormData('addressLine1', value)}
        leftIcon={<MapPin size={20} color={colors.text.secondary} />}
        style={styles.input}
      />
      
      <Input
        label="Address Line 2"
        placeholder="Area, locality"
        value={formData.addressLine2}
        onChangeText={(value) => updateFormData('addressLine2', value)}
        leftIcon={<MapPin size={20} color={colors.text.secondary} />}
        style={styles.input}
      />
      
      <Input
        label="District *"
        placeholder="Enter your district"
        value={formData.district}
        onChangeText={(value) => updateFormData('district', value)}
        style={styles.input}
      />
      
      <Input
        label="Assembly Mandalam"
        placeholder="Enter assembly mandalam"
        value={formData.assemblyMandalam}
        onChangeText={(value) => updateFormData('assemblyMandalam', value)}
        style={styles.input}
      />
      
      <Input
        label="Panchayat"
        placeholder="Enter panchayat"
        value={formData.panchayat}
        onChangeText={(value) => updateFormData('panchayat', value)}
        style={styles.input}
      />
      
      <Input
        label="Municipality"
        placeholder="Enter municipality"
        value={formData.municipality}
        onChangeText={(value) => updateFormData('municipality', value)}
        style={styles.input}
      />
      
      <Input
        label="Corporation"
        placeholder="Enter corporation"
        value={formData.corporation}
        onChangeText={(value) => updateFormData('corporation', value)}
        style={styles.input}
      />
      
      <Input
        label="Ward"
        placeholder="Enter ward"
        value={formData.ward}
        onChangeText={(value) => updateFormData('ward', value)}
        style={styles.input}
      />
      
      <Input
        label="Pincode *"
        placeholder="Enter 6-digit pincode"
        value={formData.pincode}
        onChangeText={(value) => updateFormData('pincode', value.replace(/\D/g, '').slice(0, 6))}
        style={styles.input}
        keyboardType="numeric"
        maxLength={6}
      />
    </View>
  );

  const renderAdditionalInformation = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text.primary }]}>Additional Information</Text>
      
      <Input
        label="Occupation *"
        placeholder="Enter your occupation"
        value={formData.occupation}
        onChangeText={(value) => updateFormData('occupation', value)}
        leftIcon={<Briefcase size={20} color={colors.text.secondary} />}
        style={styles.input}
      />
      
      <Text style={[styles.fieldLabel, { color: colors.text.primary }]}>Marital Status *</Text>
      <View style={styles.optionContainer}>
        {maritalStatusOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              {
                backgroundColor: formData.maritalStatus === option ? colors.primary : colors.surface,
                borderColor: formData.maritalStatus === option ? colors.primary : colors.border
              }
            ]}
            onPress={() => updateFormData('maritalStatus', option)}
          >
            <Text style={[
              styles.optionText,
              { color: formData.maritalStatus === option ? colors.text.white : colors.text.primary }
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Text style={[styles.fieldLabel, { color: colors.text.primary }]}>Income Range *</Text>
      <View style={styles.optionContainer}>
        {incomeRangeOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              {
                backgroundColor: formData.incomeRange === option ? colors.primary : colors.surface,
                borderColor: formData.incomeRange === option ? colors.primary : colors.border
              }
            ]}
            onPress={() => updateFormData('incomeRange', option)}
          >
            <Text style={[
              styles.optionText,
              { color: formData.incomeRange === option ? colors.text.white : colors.text.primary }
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Text style={[styles.fieldLabel, { color: colors.text.primary }]}>Previously Benefited from Government Scheme?</Text>
      <View style={styles.optionContainer}>
        {['YES', 'NO'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              {
                backgroundColor: formData.benefitedScheme === option ? colors.primary : colors.surface,
                borderColor: formData.benefitedScheme === option ? colors.primary : colors.border
              }
            ]}
            onPress={() => updateFormData('benefitedScheme', option)}
          >
            <Text style={[
              styles.optionText,
              { color: formData.benefitedScheme === option ? colors.text.white : colors.text.primary }
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Input
        label="Required Help/Additional Information"
        placeholder="Describe any specific help you need or additional information"
        value={formData.requiredHelp}
        onChangeText={(value) => updateFormData('requiredHelp', value)}
        style={styles.input}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
    </View>
  );

  const renderReview = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text.primary }]}>Review Application</Text>
      
      <Card style={styles.reviewCard}>
        <Text style={[styles.reviewSectionTitle, { color: colors.primary }]}>Scheme Details</Text>
        <Text style={[styles.reviewText, { color: colors.text.primary }]}>{scheme?.name}</Text>
        <Text style={[styles.reviewSubText, { color: colors.text.secondary }]}>{scheme?.category}</Text>
      </Card>
      
      <Card style={styles.reviewCard}>
        <Text style={[styles.reviewSectionTitle, { color: colors.primary }]}>Personal Information</Text>
        <Text style={[styles.reviewText, { color: colors.text.primary }]}>Name: {formData.fullName}</Text>
        <Text style={[styles.reviewText, { color: colors.text.primary }]}>Voter ID: {formData.voterId}</Text>
        <Text style={[styles.reviewText, { color: colors.text.primary }]}>Mobile: {formData.mobileNumber}</Text>
        <Text style={[styles.reviewText, { color: colors.text.primary }]}>Email: {formData.email || 'Not provided'}</Text>
        <Text style={[styles.reviewText, { color: colors.text.primary }]}>DOB: {formData.dateOfBirth}</Text>
        <Text style={[styles.reviewText, { color: colors.text.primary }]}>Gender: {formData.gender}</Text>
      </Card>
      
      <Card style={styles.reviewCard}>
        <Text style={[styles.reviewSectionTitle, { color: colors.primary }]}>Address</Text>
        <Text style={[styles.reviewText, { color: colors.text.primary }]}>{formData.addressLine1}</Text>
        {formData.addressLine2 && <Text style={[styles.reviewText, { color: colors.text.primary }]}>{formData.addressLine2}</Text>}
        <Text style={[styles.reviewText, { color: colors.text.primary }]}>{formData.district}, {formData.pincode}</Text>
      </Card>
      
      <Card style={styles.reviewCard}>
        <Text style={[styles.reviewSectionTitle, { color: colors.primary }]}>Additional Details</Text>
        <Text style={[styles.reviewText, { color: colors.text.primary }]}>Occupation: {formData.occupation}</Text>
        <Text style={[styles.reviewText, { color: colors.text.primary }]}>Marital Status: {formData.maritalStatus}</Text>
        <Text style={[styles.reviewText, { color: colors.text.primary }]}>Income Range: {formData.incomeRange}</Text>
        <Text style={[styles.reviewText, { color: colors.text.primary }]}>Previously Benefited: {formData.benefitedScheme}</Text>
        {formData.requiredHelp && <Text style={[styles.reviewText, { color: colors.text.primary }]}>Help Required: {formData.requiredHelp}</Text>}
      </Card>
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInformation();
      case 2:
        return renderAddressInformation();
      case 3:
        return renderAdditionalInformation();
      case 4:
        return renderReview();
      default:
        return null;
    }
  };

  const styles = createStyles(colors);

  if (!scheme) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={[styles.loadingText, { color: colors.text.primary }]}>Loading scheme details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar 
        backgroundColor={colors.primary} 
        barStyle="light-content" 
        translucent={false}
      />
      
      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Apply for Scheme</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>
      
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Step Indicator */}
        {renderStepIndicator()}
        
        {/* Scheme Info */}
        <Card style={styles.schemeInfoCard}>
          <Text style={[styles.schemeName, { color: colors.text.primary }]}>{scheme.name}</Text>
          <Text style={[styles.schemeCategory, { color: colors.primary }]}>{scheme.category}</Text>
        </Card>
        
        {/* Form Content */}
        <ScrollView 
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.formContent}
        >
          {renderStepContent()}
        </ScrollView>
        
        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {currentStep > 1 && (
            <Button
              title="Previous"
              onPress={handlePrevious}
              variant="outline"
              style={styles.navButton}
            />
          )}
          
          {currentStep < totalSteps ? (
            <Button
              title="Next"
              onPress={handleNext}
              style={[styles.navButton, currentStep === 1 && styles.fullWidthButton]}
              disabled={!validateStep(currentStep)}
            />
          ) : (
            <Button
              title={isSubmitting ? "Submitting..." : "Submit Application"}
              onPress={handleSubmit}
              style={styles.navButton}
              disabled={isSubmitting}
              loading={isSubmitting}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.body,
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
  },
  headerTitle: {
    ...Typography.title,
    color: colors.text.white,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: Spacing.md,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    ...Typography.caption,
    fontWeight: '600',
  },
  stepLine: {
    width: 40,
    height: 2,
    marginHorizontal: Spacing.xs,
  },
  schemeInfoCard: {
    margin: Spacing.md,
    padding: Spacing.md,
  },
  schemeName: {
    ...Typography.subtitle,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  schemeCategory: {
    ...Typography.caption,
    fontWeight: '600',
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    paddingBottom: Spacing.xl,
  },
  stepContent: {
    padding: Spacing.md,
  },
  stepTitle: {
    ...Typography.title,
    fontWeight: '600',
    marginBottom: Spacing.lg,
  },
  input: {
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  optionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  optionText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  reviewCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  reviewSectionTitle: {
    ...Typography.subtitle,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  reviewText: {
    ...Typography.body,
    marginBottom: Spacing.xs,
  },
  reviewSubText: {
    ...Typography.caption,
  },
  navigationContainer: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navButton: {
    flex: 1,
  },
  fullWidthButton: {
    flex: 1,
  },
});