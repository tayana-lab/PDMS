import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Phone, MessageSquare, Lock } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAppSettings } from '@/hooks/useAppSettings';



type OnboardingStep = 'steps' | 'mobile' | 'otp' | 'pin';

interface StepItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
}

export default function OnboardingScreen() {
  const { colors } = useAppSettings();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('steps');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const steps: StepItem[] = [
    {
      id: 'mobile',
      icon: <Phone size={32} color={currentStep === 'mobile' ? '#007AFF' : '#8E8E93'} />,
      title: 'Mobile',
      isActive: currentStep === 'mobile',
    },
    {
      id: 'otp',
      icon: <MessageSquare size={32} color={currentStep === 'otp' ? '#007AFF' : '#8E8E93'} />,
      title: 'OTP',
      isActive: currentStep === 'otp',
    },
    {
      id: 'pin',
      icon: <Lock size={32} color={currentStep === 'pin' ? '#007AFF' : '#8E8E93'} />,
      title: 'PIN',
      isActive: currentStep === 'pin',
    },
  ];



  const handleMobileSubmit = async () => {
    if (!mobileNumber.trim() || mobileNumber.length !== 10) {
      return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('otp');
    }, 1000);
  };

  const handleOtpSubmit = async () => {
    if (!otp.trim() || otp.length !== 6) {
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('pin');
    }, 1000);
  };

  const handlePinSubmit = async () => {
    if (!pin.trim() || pin.length !== 4) {
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1000);
  };



  const renderStepsView = () => (
    <View style={styles.stepsContainer}>
      <Text style={styles.stepsTitle}>New User Registration</Text>
      <Text style={styles.stepsSubtitle}>Follow these simple steps to get started</Text>
      
      <View style={styles.stepsRow}>
        {steps.map((step, index) => (
          <View key={step.id} style={styles.stepWrapper}>
            <View style={[
              styles.stepCircle,
              step.isActive && styles.stepCircleActive
            ]}>
              {step.icon}
            </View>
            <Text style={[
              styles.stepLabel,
              step.isActive && styles.stepLabelActive
            ]}>
              {step.title}
            </Text>
            {index < steps.length - 1 && (
              <View style={styles.stepConnector} />
            )}
          </View>
        ))}
      </View>
      
      <Button
        title="Start Registration"
        onPress={() => setCurrentStep('mobile')}
        style={styles.startButton}
      />
    </View>
  );

  const renderMobileView = () => (
    <View style={styles.formContainer}>
      <View style={styles.stepIndicator}>
        <View style={[styles.stepDot, styles.stepDotActive]} />
        <View style={styles.stepDot} />
        <View style={styles.stepDot} />
      </View>
      
      <Text style={styles.formTitle}>Enter Mobile Number</Text>
      <Text style={styles.formSubtitle}>We&apos;ll send you a verification code</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Mobile Number</Text>
        <View style={styles.phoneInputContainer}>
          <Phone size={20} color="#007AFF" style={styles.phoneIcon} />
          <Input
            value={mobileNumber}
            onChangeText={setMobileNumber}
            placeholder="Enter mobile number"
            keyboardType="phone-pad"
            maxLength={10}
            style={styles.phoneInput}
          />
        </View>
      </View>
      
      <Button
        title="Send OTP"
        onPress={handleMobileSubmit}
        loading={isLoading}
        disabled={mobileNumber.length !== 10}
        style={styles.submitButton}
      />
      
      <TouchableOpacity onPress={() => setCurrentStep('steps')}>
        <Text style={styles.backText}>Back to Steps</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOtpView = () => (
    <View style={styles.formContainer}>
      <View style={styles.stepIndicator}>
        <View style={[styles.stepDot, styles.stepDotCompleted]} />
        <View style={[styles.stepDot, styles.stepDotActive]} />
        <View style={styles.stepDot} />
      </View>
      
      <Text style={styles.formTitle}>Verify OTP</Text>
      <Text style={styles.formSubtitle}>Enter the 6-digit code sent to {mobileNumber}</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>OTP Code</Text>
        <Input
          value={otp}
          onChangeText={setOtp}
          placeholder="Enter 6-digit OTP"
          keyboardType="numeric"
          maxLength={6}
          style={styles.otpInput}
        />
      </View>
      
      <Button
        title="Verify OTP"
        onPress={handleOtpSubmit}
        loading={isLoading}
        disabled={otp.length !== 6}
        style={styles.submitButton}
      />
      
      <TouchableOpacity onPress={() => setCurrentStep('mobile')}>
        <Text style={styles.backText}>Back to Mobile</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPinView = () => (
    <View style={styles.formContainer}>
      <View style={styles.stepIndicator}>
        <View style={[styles.stepDot, styles.stepDotCompleted]} />
        <View style={[styles.stepDot, styles.stepDotCompleted]} />
        <View style={[styles.stepDot, styles.stepDotActive]} />
      </View>
      
      <Text style={styles.formTitle}>Set PIN</Text>
      <Text style={styles.formSubtitle}>Create a 4-digit PIN for secure access</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>PIN</Text>
        <Input
          value={pin}
          onChangeText={setPin}
          placeholder="Enter 4-digit PIN"
          keyboardType="numeric"
          maxLength={4}
          secureTextEntry
          style={styles.pinInput}
        />
      </View>
      
      <Button
        title="Complete Registration"
        onPress={handlePinSubmit}
        loading={isLoading}
        disabled={pin.length !== 4}
        style={styles.submitButton}
      />
      
      <TouchableOpacity onPress={() => setCurrentStep('otp')}>
        <Text style={styles.backText}>Back to OTP</Text>
      </TouchableOpacity>
    </View>
  );



  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'steps':
        return renderStepsView();
      case 'mobile':
        return renderMobileView();
      case 'otp':
        return renderOtpView();
      case 'pin':
        return renderPinView();
      default:
        return renderStepsView();
    }
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <LinearGradient
        colors={[colors.surface, colors.background]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          {renderCurrentStep()}
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepsTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 8,
  },
  stepsSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 40,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
    paddingHorizontal: 20,
  },
  stepWrapper: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  stepCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  stepCircleActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#007AFF',
  },
  stepConnector: {
    position: 'absolute',
    top: 32,
    right: -50,
    width: 100,
    height: 2,
    backgroundColor: '#E5E5EA',
    zIndex: -1,
  },
  startButton: {
    width: '100%',
    maxWidth: 300,
    borderRadius: 12,
    paddingVertical: 16,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 60,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    gap: 8,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E5EA',
  },
  stepDotActive: {
    backgroundColor: '#007AFF',
  },
  stepDotCompleted: {
    backgroundColor: '#34C759',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  phoneIcon: {
    marginRight: 12,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  otpInput: {
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: 4,
  },
  pinInput: {
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: 8,
  },

  submitButton: {
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center',
    fontWeight: '500',
  },
});