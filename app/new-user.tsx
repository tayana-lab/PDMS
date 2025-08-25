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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Phone, MessageSquare, Lock, ArrowLeft } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Spacing } from '@/constants/theme';

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
  
  const { sendOTP, verifyOTP, createAccount } = useAuth();

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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
        
        <LinearGradient
          colors={["#FF6B35", "#FF8A65", "#FFAB91"]}
          style={styles.gradientBackground}
        >
          {/* Custom Header */}
          <View style={styles.customHeader}>
            <Button
              title=""
              onPress={handleBack}
              variant="ghost"
              style={styles.backButton}
              icon={<ArrowLeft size={24} color="#fff" />}
            />
            <Text style={styles.headerTitle}>New User</Text>
            <View style={styles.headerSpacer} />
          </View>

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
                    isActive && styles.stepIconActive,
                    isCompleted && styles.stepIconCompleted,
                    !isActive && !isCompleted && styles.stepIconInactive
                  ]}>
                    <StepIcon 
                      size={16} 
                      color={isActive ? "#FF6B35" : isCompleted ? "#fff" : "rgba(255,255,255,0.6)"} 
                    />
                  </View>
                  <Text style={[
                    styles.stepLabel,
                    { color: isActive ? "#fff" : "rgba(255,255,255,0.7)" }
                  ]}>
                    {step.label}
                  </Text>
                  {index < steps.length - 1 && (
                    <View style={[
                      styles.stepConnector,
                      { backgroundColor: isCompleted ? "#fff" : "rgba(255,255,255,0.3)" }
                    ]} />
                  )}
                </View>
              );
            })}
          </View>

          <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.center}>
              <View style={styles.loginCard}>
                <Text style={styles.title}>
                  {currentStepConfig.title}
                </Text>
                <Text style={styles.subtitle}>
                  {currentStepConfig.subtitle}
                </Text>

                {/* Form Fields using same Input component as login */}
                <View style={styles.inputGroup}>
                  {currentStep === 'mobile' && (
                    <Input
                      label="Mobile Number"
                      value={mobile}
                      onChangeText={setMobile}
                      placeholder="Enter mobile number"
                      keyboardType="phone-pad"
                      maxLength={10}
                    />
                  )}

                  {currentStep === 'otp' && (
                    <>
                      <Input
                        label="Verification Code"
                        value={otp}
                        onChangeText={setOtp}
                        placeholder="Enter 4-digit OTP"
                        keyboardType="numeric"
                        maxLength={4}
                      />
                      <Text style={styles.helperText}>
                        Code sent to +91 {mobile}
                      </Text>
                    </>
                  )}

                  {currentStep === 'pin' && (
                    <>
                      <Input
                        label="Create PIN"
                        value={pin}
                        onChangeText={setPin}
                        placeholder="Enter 4-digit PIN"
                        keyboardType="numeric"
                        maxLength={4}
                        secureTextEntry
                      />
                      <Input
                        label="Confirm PIN"
                        value={confirmPin}
                        onChangeText={setConfirmPin}
                        placeholder="Re-enter PIN"
                        keyboardType="numeric"
                        maxLength={4}
                        secureTextEntry
                      />
                    </>
                  )}
                </View>

                {/* Action Buttons */}
                <View style={styles.btnGroup}>
                  <Button
                    title={currentStep === 'pin' ? 'Create Account' : 'Continue'}
                    onPress={handleNext}
                    loading={isLoading}
                    style={styles.primaryBtn}
                  />
                  {currentStep !== 'mobile' && (
                    <Button
                      title="Previous"
                      onPress={() => {
                        if (currentStep === 'otp') setCurrentStep('mobile');
                        else if (currentStep === 'pin') setCurrentStep('otp');
                      }}
                      variant="ghost"
                    />
                  )}
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1 
  },
  container: { 
    flex: 1 
  },
  gradientBackground: { 
    flex: 1 
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
  },
  stepIndicator: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  stepIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  stepIconActive: {
    backgroundColor: '#fff',
  },
  stepIconCompleted: {
    backgroundColor: '#4CAF50',
  },
  stepIconInactive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  stepConnector: {
    position: 'absolute',
    top: 18,
    left: '70%',
    right: '-70%',
    height: 2,
    zIndex: -1,
  },
  keyboardView: {
    flex: 1,
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    paddingHorizontal: 20 
  },
  loginCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  title: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#FF6B35', 
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputGroup: { 
    marginBottom: 20, 
    gap: 16 
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  btnGroup: { 
    gap: 12 
  },
  primaryBtn: { 
    borderRadius: 14, 
    paddingVertical: 12 
  },
});