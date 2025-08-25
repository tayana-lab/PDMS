import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Phone, MessageSquare, Lock, CreditCard } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const { width } = Dimensions.get('window');

type OnboardingStep = 'steps' | 'mobile' | 'otp' | 'pin' | 'pan';

interface StepItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
}

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('steps');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const steps: StepItem[] = [
    {
      id: 'mobile',
      icon: <Phone size={24} color={currentStep === 'mobile' ? '#007AFF' : '#8E8E93'} />,
      title: 'Mobile',
      isActive: currentStep === 'mobile',
    },
    {
      id: 'otp',
      icon: <MessageSquare size={24} color={currentStep === 'otp' ? '#007AFF' : '#8E8E93'} />,
      title: 'OTP',
      isActive: currentStep === 'otp',
    },
    {
      id: 'pin',
      icon: <Lock size={24} color={currentStep === 'pin' ? '#007AFF' : '#8E8E93'} />,
      title: 'PIN',
      isActive: currentStep === 'pin',
    },
    {
      id: 'pan',
      icon: <CreditCard size={24} color={currentStep === 'pan' ? '#007AFF' : '#8E8E93'} />,
      title: 'PAN',
      isActive: currentStep === 'pan',
    },
  ];

  const handleStepPress = (stepId: string) => {
    setCurrentStep(stepId as OnboardingStep);
  };

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
      setCurrentStep('pan');
    }, 1000);
  };

  const handlePanSubmit = async () => {
    if (!panNumber.trim() || panNumber.length !== 10) {
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
      <Text style={styles.stepsTitle}>Complete Your Registration</Text>
      <Text style={styles.stepsSubtitle}>Follow these steps to set up your account</Text>
      
      <View style={styles.stepsGrid}>
        {steps.map((step, index) => (
          <TouchableOpacity
            key={step.id}
            style={[
              styles.stepCard,
              step.isActive && styles.stepCardActive
            ]}
            onPress={() => handleStepPress(step.id)}
          >
            <View style={[
              styles.stepIconContainer,
              step.isActive && styles.stepIconContainerActive
            ]}>
              {step.icon}
            </View>
            <Text style={[
              styles.stepTitle,
              step.isActive && styles.stepTitleActive
            ]}>
              {step.title}
            </Text>
          </TouchableOpacity>
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
        <View style={styles.stepDot} />
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
        title="Set PIN"
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

  const renderPanView = () => (
    <View style={styles.formContainer}>
      <View style={styles.stepIndicator}>
        <View style={[styles.stepDot, styles.stepDotCompleted]} />
        <View style={[styles.stepDot, styles.stepDotCompleted]} />
        <View style={[styles.stepDot, styles.stepDotCompleted]} />
        <View style={[styles.stepDot, styles.stepDotActive]} />
      </View>
      
      <Text style={styles.formTitle}>Enter PAN Details</Text>
      <Text style={styles.formSubtitle}>Provide your PAN number for verification</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>PAN Number</Text>
        <Input
          value={panNumber}
          onChangeText={setPanNumber}
          placeholder="Enter PAN number"
          maxLength={10}
          autoCapitalize="characters"
          style={styles.panInput}
        />
      </View>
      
      <Button
        title="Complete Registration"
        onPress={handlePanSubmit}
        loading={isLoading}
        disabled={panNumber.length !== 10}
        style={styles.submitButton}
      />
      
      <TouchableOpacity onPress={() => setCurrentStep('pin')}>
        <Text style={styles.backText}>Back to PIN</Text>
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
      case 'pan':
        return renderPanView();
      default:
        return renderStepsView();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      <LinearGradient
        colors={['#F8F9FA', '#FFFFFF']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          {renderCurrentStep()}
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
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
  stepsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 40,
  },
  stepCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  stepCardActive: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepIconContainerActive: {
    backgroundColor: '#E3F2FD',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  stepTitleActive: {
    color: '#007AFF',
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
  panInput: {
    textTransform: 'uppercase',
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