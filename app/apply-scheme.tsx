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
  Platform,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, FileText, Calendar, User, Phone, Mail, MapPin, Briefcase, Heart } from 'lucide-react-native';
import { Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useAppSettings } from '@/hooks/useAppSettings';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useScheme } from '@/hooks/useApi';
import { Scheme } from '@/lib/api-client';

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
  const { 
    schemeId, 
    voterId, 
    voterName, 
    age, 
    gender, 
    mobileNumber, 
    guardianName, 
    houseName, 
    address, 
    ward, 
    assemblyConstituency 
  } = useLocalSearchParams<{ 
    schemeId: string;
    voterId?: string;
    voterName?: string;
    age?: string;
    gender?: string;
    mobileNumber?: string;
    guardianName?: string;
    houseName?: string;
    address?: string;
    ward?: string;
    assemblyConstituency?: string;
  }>();
  
  const schemeQuery = useScheme(schemeId || '');
  const [formData, setFormData] = useState<ApplicationForm>(initialFormData);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { colors } = useAppSettings();

  const totalSteps = 4;

  const scheme = schemeQuery.data;
  
  useEffect(() => {
    if (schemeId && schemeQuery.isError) {
      console.log('ApplyScheme: Scheme not found for ID:', schemeId);
      Alert.alert('Error', 'Scheme not found');
      router.back();
    }
  }, [schemeId, schemeQuery.isError]);

  // Auto-fill form with voter data when available
  useEffect(() => {
    if (voterId && voterName) {
      console.log('ApplyScheme: Auto-filling form with voter data:', {
        voterId,
        voterName: decodeURIComponent(voterName),
        age,
        gender,
        mobileNumber
      });
      
      const decodedVoterName = decodeURIComponent(voterName);
      const decodedGuardianName = guardianName ? decodeURIComponent(guardianName) : '';
      const decodedHouseName = houseName ? decodeURIComponent(houseName) : '';
      const decodedAddress = address ? decodeURIComponent(address) : '';
      const decodedAssemblyConstituency = assemblyConstituency ? decodeURIComponent(assemblyConstituency) : '';
      
      // Calculate date of birth from age if available
      let dateOfBirth = '';
      if (age && parseInt(age) > 0) {
        const currentYear = new Date().getFullYear();
        const birthYear = currentYear - parseInt(age);
        dateOfBirth = `01/01/${birthYear}`;
      }
      
      setFormData(prev => ({
        ...prev,
        fullName: decodedVoterName,
        voterId: voterId,
        mobileNumber: mobileNumber || '',
        dateOfBirth: dateOfBirth,
        gender: gender?.toUpperCase() || '',
        addressLine1: decodedHouseName,
        addressLine2: decodedAddress,
        ward: ward || '',
        assemblyMandalam: decodedAssemblyConstituency
      }));
    }
  }, [voterId, voterName, age, gender, mobileNumber, guardianName, houseName, address, ward, assemblyConstituency]);

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
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Full Name *</Text>
        <View style={styles.inputWrapper}>
          <User size={20} color={colors.text.light} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={formData.fullName}
            onChangeText={(value) => updateFormData('fullName', value)}
            placeholder="Enter your full name"
            placeholderTextColor={colors.text.light}
          />
        </View>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Voter ID *</Text>
        <View style={styles.inputWrapper}>
          <FileText size={20} color={colors.text.light} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={formData.voterId}
            onChangeText={(value) => updateFormData('voterId', value.toUpperCase())}
            placeholder="Enter your voter ID"
            placeholderTextColor={colors.text.light}
            autoCapitalize="characters"
          />
        </View>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Aadhaar Number *</Text>
        <View style={styles.inputWrapper}>
          <FileText size={20} color={colors.text.light} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={formData.aadhaarNumber}
            onChangeText={(value) => updateFormData('aadhaarNumber', value.replace(/\D/g, '').slice(0, 12))}
            placeholder="Enter your 12-digit Aadhaar number"
            placeholderTextColor={colors.text.light}
            keyboardType="numeric"
            maxLength={12}
          />
        </View>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Mobile Number *</Text>
        <View style={styles.inputWrapper}>
          <Phone size={20} color={colors.text.light} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={formData.mobileNumber}
            onChangeText={(value) => updateFormData('mobileNumber', value.replace(/\D/g, '').slice(0, 10))}
            placeholder="Enter your mobile number"
            placeholderTextColor={colors.text.light}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email</Text>
        <View style={styles.inputWrapper}>
          <Mail size={20} color={colors.text.light} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value.toLowerCase())}
            placeholder="Enter your email address"
            placeholderTextColor={colors.text.light}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Date of Birth *</Text>
        <View style={styles.inputWrapper}>
          <Calendar size={20} color={colors.text.light} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
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
            placeholder="DD/MM/YYYY"
            placeholderTextColor={colors.text.light}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>
      </View>
      
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
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Religion</Text>
        <View style={styles.inputWrapper}>
          <Heart size={20} color={colors.text.light} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={formData.religion}
            onChangeText={(value) => updateFormData('religion', value)}
            placeholder="Enter your religion"
            placeholderTextColor={colors.text.light}
          />
        </View>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Caste</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={formData.caste}
            onChangeText={(value) => updateFormData('caste', value)}
            placeholder="Enter your caste"
            placeholderTextColor={colors.text.light}
          />
        </View>
      </View>
    </View>
  );

  const renderAddressInformation = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text.primary }]}>Address Information</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Address Line 1 *</Text>
        <View style={styles.inputWrapper}>
          <MapPin size={20} color={colors.text.light} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={formData.addressLine1}
            onChangeText={(value) => updateFormData('addressLine1', value)}
            placeholder="House number, street name"
            placeholderTextColor={colors.text.light}
          />
        </View>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Address Line 2</Text>
        <View style={styles.inputWrapper}>
          <MapPin size={20} color={colors.text.light} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={formData.addressLine2}
            onChangeText={(value) => updateFormData('addressLine2', value)}
            placeholder="Area, locality"
            placeholderTextColor={colors.text.light}
          />
        </View>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>District *</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={formData.district}
            onChangeText={(value) => updateFormData('district', value)}
            placeholder="Enter your district"
            placeholderTextColor={colors.text.light}
          />
        </View>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Assembly Mandalam</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={formData.assemblyMandalam}
            onChangeText={(value) => updateFormData('assemblyMandalam', value)}
            placeholder="Enter assembly mandalam"
            placeholderTextColor={colors.text.light}
          />
        </View>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Panchayat</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={formData.panchayat}
            onChangeText={(value) => updateFormData('panchayat', value)}
            placeholder="Enter panchayat"
            placeholderTextColor={colors.text.light}
          />
        </View>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Municipality</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={formData.municipality}
            onChangeText={(value) => updateFormData('municipality', value)}
            placeholder="Enter municipality"
            placeholderTextColor={colors.text.light}
          />
        </View>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Corporation</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={formData.corporation}
            onChangeText={(value) => updateFormData('corporation', value)}
            placeholder="Enter corporation"
            placeholderTextColor={colors.text.light}
          />
        </View>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Ward</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={formData.ward}
            onChangeText={(value) => updateFormData('ward', value)}
            placeholder="Enter ward"
            placeholderTextColor={colors.text.light}
          />
        </View>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Pincode *</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={formData.pincode}
            onChangeText={(value) => updateFormData('pincode', value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter 6-digit pincode"
            placeholderTextColor={colors.text.light}
            keyboardType="numeric"
            maxLength={6}
          />
        </View>
      </View>
    </View>
  );

  const renderAdditionalInformation = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text.primary }]}>Additional Information</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Occupation *</Text>
        <View style={styles.inputWrapper}>
          <Briefcase size={20} color={colors.text.light} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={formData.occupation}
            onChangeText={(value) => updateFormData('occupation', value)}
            placeholder="Enter your occupation"
            placeholderTextColor={colors.text.light}
          />
        </View>
      </View>
      
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
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Required Help/Additional Information</Text>
        <View style={[styles.inputWrapper, styles.multilineWrapper]}>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={formData.requiredHelp}
            onChangeText={(value) => updateFormData('requiredHelp', value)}
            placeholder="Describe any specific help you need or additional information"
            placeholderTextColor={colors.text.light}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>
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

  if (schemeQuery.isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={[styles.loadingText, { color: colors.text.primary }]}>Loading scheme details...</Text>
      </View>
    );
  }
  
  if (schemeQuery.isError || !scheme) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={[styles.loadingText, { color: colors.text.primary }]}>Scheme not found</Text>
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
          <Text style={styles.headerTitle}>{scheme?.name || 'Apply for Scheme'}</Text>
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
  inputContainer: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: Spacing.sm,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...Shadows.small,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    minHeight: 50,
    height: 50,
    textAlignVertical: 'center',
  },
  multilineWrapper: {
    alignItems: 'flex-start',
    minHeight: 100,
  },
  multilineInput: {
    minHeight: 80,
    height: 80,
    textAlignVertical: 'top',
    paddingTop: Spacing.md,
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