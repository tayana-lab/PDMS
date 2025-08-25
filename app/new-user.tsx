import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Phone, MessageSquare, Lock } from 'lucide-react-native';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Spacing, BorderRadius } from '@/constants/theme';

type Step = 'mobile' | 'otp' | 'pin';

interface StepConfig {
  id: Step;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  label: string;
}

const steps: StepConfig[] = [
  {
    id: 'mobile',
    title: 'Enter Mobile Number',
    subtitle: "We'll send you a verification code",
    icon: Phone,
    label: 'Mobile'
  },
  {
    id: 'otp',
    title: 'Verify OTP',
    subtitle: 'Enter the code sent to your mobile',
    icon: MessageSquare,
    label: 'OTP'
  },
  {
    id: 'pin',
    title: 'Set PIN',
    subtitle: 'Create a 4-digit PIN for secure access',
    icon: Lock,
    label: 'PIN'
  }
];

export default function NewUserScreen() {
  const [currentStep, setCurrentStep] = useState<Step>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { colors } = useAppSettings();
  const { sendOTP, verifyOTP, createAccount } = useAuth();

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const currentStepConfig = steps[currentStepIndex];
  const IconComponent = currentStepConfig.icon;

  const handleNext = async () => {
    setIsLoading(true);
    
    try {
      if (currentStep === 'mobile') {
        if (!mobile.trim() || mobile.length !== 10) {
          Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
          return;
        }
        // Send OTP logic here
        await sendOTP(mobile);
        setCurrentStep('otp');
      } else if (currentStep === 'otp') {
        if (!otp.trim() || otp.length !== 4) {
          Alert.alert('Error', 'Please enter a valid 4-digit OTP');
          return;
        }
        // Verify OTP logic here
        const result = await verifyOTP(mobile, otp);
        if (result.success) {
          setCurrentStep('pin');
        } else {
          Alert.alert('Error', result.error || 'Invalid OTP');
        }
      } else if (currentStep === 'pin') {
        if (!pin.trim() || pin.length !== 4) {
          Alert.alert('Error', 'Please enter a 4-digit PIN');
          return;
        }
        if (pin !== confirmPin) {
          Alert.alert('Error', 'PINs do not match');
          return;
        }
        // Create account logic here
        const result = await createAccount(mobile, pin);
        if (result.success) {
          Alert.alert('Success', 'Account created successfully!', [
            { text: 'OK', onPress: () => router.replace('/(tabs)') }
          ]);
        } else {
          Alert.alert('Error', result.error || 'Failed to create account');
        }
      }
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'mobile') {
      router.back();
    } else if (currentStep === 'otp') {
      setCurrentStep('mobile');
    } else if (currentStep === 'pin') {
      setCurrentStep('otp');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Step Indicators */}
        <View style={styles.stepIndicatorContainer}>
          {steps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            const StepIcon = step.icon;
            
            return (
              <View key={step.id} style={styles.stepIndicator}>
                <View style={[
                  styles.stepIconContainer,
                  isActive && { backgroundColor: colors.primary },
                  isCompleted && { backgroundColor: colors.success },
                  !isActive && !isCompleted && { backgroundColor: colors.border }
                ]}>
                  <StepIcon 
                    size={20} 
                    color={isActive || isCompleted ? colors.text.white : colors.text.secondary} 
                  />
                </View>
                <Text style={[
                  styles.stepLabel,
                  { color: isActive ? colors.primary : colors.text.secondary }
                ]}>
                  {step.label}
                </Text>
                {index < steps.length - 1 && (
                  <View style={[
                    styles.stepConnector,
                    { backgroundColor: isCompleted ? colors.success : colors.border }
                  ]} />
                )}
              </View>
            );
          })}
        </View>

        {/* Main Content Card */}
        <View style={styles.contentContainer}>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            {/* Header */}
            <View style={styles.header}>
              <View style={[styles.mainIconContainer, { backgroundColor: colors.primary }]}>
                <IconComponent size={32} color={colors.text.white} />
              </View>
              <Text style={[styles.title, { color: colors.text.primary }]}>
                {currentStepConfig.title}
              </Text>
              <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                {currentStepConfig.subtitle}
              </Text>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              {currentStep === 'mobile' && (
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: colors.text.primary }]}>Mobile Number</Text>
                  <View style={styles.phoneInputContainer}>
                    <Phone size={20} color={colors.text.secondary} style={styles.phoneIcon} />
                    <Input
                      value={mobile}
                      onChangeText={setMobile}
                      placeholder="Enter mobile number"
                      keyboardType="phone-pad"
                      maxLength={10}
                      style={styles.phoneInput}
                    />
                  </View>
                </View>
              )}

              {currentStep === 'otp' && (
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: colors.text.primary }]}>Verification Code</Text>
                  <Input
                    value={otp}
                    onChangeText={setOtp}
                    placeholder="Enter 4-digit OTP"
                    keyboardType="numeric"
                    maxLength={4}
                    textAlign="center"
                    style={styles.otpInput}
                  />
                  <Text style={[styles.helperText, { color: colors.text.secondary }]}>
                    Code sent to +91 {mobile}
                  </Text>
                </View>
              )}

              {currentStep === 'pin' && (
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: colors.text.primary }]}>Create PIN</Text>
                  <Input
                    value={pin}
                    onChangeText={setPin}
                    placeholder="Enter 4-digit PIN"
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                    textAlign="center"
                    style={styles.pinInput}
                  />
                  <Text style={[styles.inputLabel, { color: colors.text.primary, marginTop: Spacing.md }]}>Confirm PIN</Text>
                  <Input
                    value={confirmPin}
                    onChangeText={setConfirmPin}
                    placeholder="Re-enter PIN"
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                    textAlign="center"
                    style={styles.pinInput}
                  />
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                title={currentStep === 'pin' ? 'Create Account' : 'Continue'}
                onPress={handleNext}
                loading={isLoading}
                style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              />
              <Button
                title="Back"
                onPress={handleBack}
                variant="ghost"
                style={styles.backButton}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    marginTop: Spacing.lg,
  },
  stepIndicator: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  stepConnector: {
    position: 'absolute',
    top: 24,
    left: '75%',
    right: '-75%',
    height: 2,
    zIndex: -1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  mainIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    marginBottom: Spacing.xl,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  phoneIcon: {
    position: 'absolute',
    left: Spacing.md,
    zIndex: 1,
  },
  phoneInput: {
    paddingLeft: 48,
  },
  otpInput: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 8,
  },
  pinInput: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 4,
  },
  helperText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  buttonContainer: {
    gap: Spacing.md,
  },
  primaryButton: {
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
  },
  backButton: {
    borderRadius: BorderRadius.lg,
  },
});