import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { Phone, MessageSquare, Lock, ArrowLeft } from 'lucide-react-native';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Spacing, BorderRadius } from '@/constants/theme';

type Step = 'mobile' | 'otp' | 'newPin';

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
    id: 'newPin',
    title: 'Reset PIN',
    subtitle: 'Create a new 6-digit PIN',
    icon: Lock,
    label: 'New PIN'
  }
];

export default function ForgotPinScreen() {
  const [currentStep, setCurrentStep] = useState<Step>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { colors } = useAppSettings();
  const { sendOTP, verifyOTP, resetPin } = useAuth();

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const currentStepConfig = steps[currentStepIndex];

  const handleNext = async () => {
    setIsLoading(true);
    
    try {
      if (currentStep === 'mobile') {
        if (!mobile.trim() || mobile.length !== 10) {
          Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
          return;
        }
        await sendOTP(mobile);
        setCurrentStep('otp');
      } else if (currentStep === 'otp') {
        if (!otp.trim() || otp.length !== 6) {
          Alert.alert('Error', 'Please enter a valid 6-digit OTP');
          return;
        }
        const result = await verifyOTP(mobile, otp);
        if (result.success) {
          setCurrentStep('newPin');
        } else {
          Alert.alert('Error', result.error || 'Invalid OTP');
        }
      } else if (currentStep === 'newPin') {
        if (!newPin.trim() || newPin.length !== 6) {
          Alert.alert('Error', 'Please enter a 6-digit PIN');
          return;
        }
        if (newPin !== confirmPin) {
          Alert.alert('Error', 'PINs do not match');
          return;
        }
        const result = await resetPin(mobile, newPin);
        if (result.success) {
          Alert.alert('Success', 'PIN reset successfully!', [
            { text: 'OK', onPress: () => router.replace('/login') }
          ]);
        } else {
          Alert.alert('Error', result.error || 'Failed to reset PIN');
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
    } else if (currentStep === 'newPin') {
      setCurrentStep('otp');
    }
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Reset PIN',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} style={styles.headerBackButton}>
              <ArrowLeft size={24} color={colors.text.white} />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.text.white,
          },
          headerTintColor: colors.text.white,
        }}
      />
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <LinearGradient
        colors={[colors.primary, colors.primary + 'CC', colors.primary + '99']}
        style={styles.gradientBackground}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Step Indicators */}
          <View style={styles.stepIndicatorContainer}>
            {steps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;
              const StepIcon = step.icon;
              
              return (
                <TouchableOpacity 
                  key={step.id} 
                  style={styles.stepIndicator}
                  onPress={() => {
                    if (index < currentStepIndex) {
                      setCurrentStep(step.id);
                    }
                  }}
                  disabled={index > currentStepIndex}
                >
                  <View style={[
                    styles.stepIconContainer,
                    isActive && styles.stepIconActive,
                    isCompleted && styles.stepIconCompleted,
                    !isActive && !isCompleted && styles.stepIconInactive
                  ]}>
                    <StepIcon 
                      size={16} 
                      color={isActive || isCompleted ? '#fff' : colors.primary} 
                    />
                  </View>
                  <Text style={[
                    styles.stepLabel,
                    isActive && styles.stepLabelActive,
                    isCompleted && styles.stepLabelCompleted,
                    !isActive && !isCompleted && styles.stepLabelInactive
                  ]}>
                    {step.label}
                  </Text>
                  {index < steps.length - 1 && (
                    <View style={[
                      styles.stepConnector,
                      isCompleted && styles.stepConnectorCompleted
                    ]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.center}>
              <View style={styles.card}>
                <Text style={styles.title}>
                  {currentStepConfig.title}
                </Text>
                <Text style={styles.subtitle}>
                  {currentStepConfig.subtitle}
                </Text>

                {/* Form Fields */}
                <View style={styles.inputGroup}>
                  {currentStep === 'mobile' && (
                    <Input
                      label="Mobile Number"
                      value={mobile}
                      onChangeText={setMobile}
                      placeholder="Enter mobile number"
                      keyboardType="phone-pad"
                      maxLength={10}
                      leftIcon={<Phone size={20} color={colors.text.secondary} />}
                    />
                  )}

                  {currentStep === 'otp' && (
                    <>
                      <Input
                        label="Verification Code"
                        value={otp}
                        onChangeText={setOtp}
                        placeholder="Enter 6-digit OTP"
                        keyboardType="numeric"
                        maxLength={6}
                        leftIcon={<MessageSquare size={20} color={colors.text.secondary} />}
                        style={styles.otpInput}
                      />
                      <Text style={styles.helperText}>
                        Code sent to +91 {mobile}
                      </Text>
                    </>
                  )}

                  {currentStep === 'newPin' && (
                    <>
                      <Input
                        label="New PIN"
                        value={newPin}
                        onChangeText={setNewPin}
                        placeholder="Enter 6-digit PIN"
                        keyboardType="numeric"
                        maxLength={6}
                        secureTextEntry
                        leftIcon={<Lock size={20} color={colors.text.secondary} />}
                        style={styles.pinInput}
                      />
                      <Input
                        label="Confirm PIN"
                        value={confirmPin}
                        onChangeText={setConfirmPin}
                        placeholder="Re-enter PIN"
                        keyboardType="numeric"
                        maxLength={6}
                        secureTextEntry
                        leftIcon={<Lock size={20} color={colors.text.secondary} />}
                        style={styles.pinInput}
                        containerStyle={{ marginTop: 12 }}
                      />
                    </>
                  )}
                </View>

                {/* Action Buttons */}
                <View style={styles.btnGroup}>
                  <Button
                    title={currentStep === 'newPin' ? 'Reset PIN' : 'Continue'}
                    onPress={handleNext}
                    loading={isLoading}
                    style={styles.primaryBtn}
                  />
                  <Button
                    title="Back"
                    onPress={handleBack}
                    variant="ghost"
                  />
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { 
    flex: 1 
  },
  headerBackButton: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },
  gradientBackground: { 
    flex: 1 
  },
  safeArea: { 
    flex: 1 
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  stepIndicator: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  stepIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 2,
  },
  stepIconActive: {
    backgroundColor: colors.primary,
    borderColor: '#fff',
  },
  stepIconCompleted: {
    backgroundColor: colors.success,
    borderColor: '#fff',
  },
  stepIconInactive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderColor: 'rgba(255,255,255,0.5)',
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#fff',
  },
  stepLabelCompleted: {
    color: '#fff',
  },
  stepLabelInactive: {
    color: 'rgba(255,255,255,0.7)',
  },
  stepConnector: {
    position: 'absolute',
    top: 20,
    left: '75%',
    right: '-75%',
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    zIndex: -1,
  },
  stepConnectorCompleted: {
    backgroundColor: colors.success,
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    paddingHorizontal: 26
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    width: "100%",
    maxWidth: 380,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  title: { 
    fontSize: 22, 
    fontWeight: "700", 
    color: colors.primary, 
    textAlign: "center" 
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: 16,
  },
  inputGroup: { 
    marginBottom: 20, 
    gap: 12 
  },
  btnGroup: { 
    gap: 12 
  },
  primaryBtn: { 
    borderRadius: BorderRadius.lg, 
    paddingVertical: 12 
  },
  otpInput: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 4,
    textAlign: 'center',
  },
  pinInput: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 2,
    textAlign: 'center',
  },
  helperText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: "center",
    marginTop: 8,
  },
});