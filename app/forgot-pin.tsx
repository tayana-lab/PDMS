import React, { useState, useRef } from 'react';
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
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Phone, MessageSquare, Lock, ArrowLeft, Check } from 'lucide-react-native';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import { Spacing, BorderRadius, Shadows } from '@/constants/theme';

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
    subtitle: 'Create a new 4-digit PIN',
    icon: Lock,
    label: 'New PIN'
  }
];

export default function ForgotPinScreen() {
  const [currentStep, setCurrentStep] = useState<Step>('mobile');
  const [mobile, setMobile] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const otpInputRefs = useRef<TextInput[]>([]);
  
  const { colors, currentTheme, t } = useAppSettings();
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
        const otpValue = otpDigits.join('');
        if (!otpValue.trim() || otpValue.length !== 6) {
          Alert.alert('Error', 'Please enter a valid 6-digit OTP');
          return;
        }
        const result = await verifyOTP(mobile, otpValue);
        if (result.success) {
          setCurrentStep('newPin');
        } else {
          Alert.alert('Error', result.error || 'Invalid OTP');
        }
      } else if (currentStep === 'newPin') {
        if (!newPin.trim() || newPin.length !== 4) {
          Alert.alert('Error', 'Please enter a 4-digit PIN');
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

  const handleOtpChange = (value: string, index: number) => {
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: t('resetPin'),
            headerShown: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
                <ArrowLeft size={24} color={colors.text.primary} />
              </TouchableOpacity>
            ),
            headerStyle: {
              backgroundColor: colors.surface,
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: '600',
              color: colors.text.primary,
            },
            headerTintColor: colors.text.primary,
          }}
        />
        <StatusBar
          barStyle={currentTheme === "dark" ? "light-content" : "dark-content"}
          backgroundColor={colors.surface}
        />
        {/* Step Indicators */}
        <View style={styles.stepIndicatorContainer}>
          {steps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            const StepIcon = step.icon;

            return (
              <React.Fragment key={step.id}>
                <View style={styles.stepWrapper}>
                  <View style={[
                    styles.stepIconContainer,
                    isActive && styles.stepIconActive,
                    isCompleted && styles.stepIconCompleted,
                    !isActive && !isCompleted && styles.stepIconInactive
                  ]}>
                    {isCompleted ? (
                      <Check
                        size={20}
                        color={colors.background}
                      />
                    ) : (
                      <StepIcon
                        size={20}
                        color={isActive ? colors.background : colors.text.secondary}
                      />
                    )}
                  </View>
                  
                  <Text style={[
                    styles.stepLabel,
                    isActive && styles.stepLabelActive,
                    isCompleted && styles.stepLabelCompleted,
                    !isActive && !isCompleted && styles.stepLabelInactive
                  ]}>
                    {t(step.label.toLowerCase())}
                  </Text>
                </View>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <View style={[
                    styles.stepConnector,
                    (isCompleted || index < currentStepIndex) && styles.stepConnectorCompleted
                  ]} />
                )}
              </React.Fragment>
            );
          })}
        </View>

        <KeyboardAvoidingView
          style={styles.mainContent}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <View style={styles.center}>
            <View style={styles.loginCard}>
              <Text style={styles.title}>
                {t(currentStepConfig.title.toLowerCase().replace(/\s+/g, ''))}
              </Text>
              <Text style={styles.subtitle}>
                {t(currentStepConfig.subtitle.toLowerCase().replace(/\s+/g, '').replace(/'/g, ''))}
              </Text>

              {/* Form Fields */}
              <View style={styles.inputGroup}>
                {currentStep === 'mobile' && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>{t('mobileNumber')}</Text>
                    <View style={styles.inputWrapper}>
                      <Phone
                        size={20}
                        color={colors.text.light}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        value={mobile}
                        onChangeText={setMobile}
                        placeholder={t('enterMobileNumber')}
                        placeholderTextColor={colors.text.light}
                        keyboardType="phone-pad"
                        maxLength={10}
                      />
                    </View>
                  </View>
                )}

                {currentStep === 'otp' && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>{t('verificationCode')}</Text>
                    <View style={styles.otpContainer}>
                      {otpDigits.map((digit, index) => (
                        <TextInput
                          key={index}
                          ref={(ref) => {
                            if (ref) {
                              otpInputRefs.current[index] = ref;
                            }
                          }}
                          style={[
                            styles.otpBox,
                            digit ? styles.otpBoxFilled : null
                          ]}
                          value={digit}
                          onChangeText={(value) => {
                            if (value.length <= 1) {
                              handleOtpChange(value, index);
                            }
                          }}
                          onKeyPress={({ nativeEvent }) => {
                            handleOtpKeyPress(nativeEvent.key, index);
                          }}
                          keyboardType="numeric"
                          maxLength={1}
                          textAlign="center"
                          selectTextOnFocus
                        />
                      ))}
                    </View>
                    <Text style={styles.helperText}>
                      {t('codeSentTo')} +91 {mobile}
                    </Text>
                  </View>
                )}

                {currentStep === 'newPin' && (
                  <>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>{t('newPin')}</Text>
                      <View style={styles.inputWrapper}>
                        <Lock
                          size={20}
                          color={colors.text.light}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          style={[styles.input, styles.pinInput]}
                          value={newPin}
                          onChangeText={setNewPin}
                          placeholder={t('enter4DigitPin')}
                          placeholderTextColor={colors.text.light}
                          keyboardType="numeric"
                          maxLength={4}
                          secureTextEntry
                        />
                      </View>
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>{t('confirmPin')}</Text>
                      <View style={styles.inputWrapper}>
                        <Lock
                          size={20}
                          color={colors.text.light}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          style={[styles.input, styles.pinInput]}
                          value={confirmPin}
                          onChangeText={setConfirmPin}
                          placeholder={t('reEnterPin')}
                          placeholderTextColor={colors.text.light}
                          keyboardType="numeric"
                          maxLength={4}
                          secureTextEntry
                        />
                      </View>
                    </View>
                  </>
                )}
              </View>

              {/* Action Buttons */}
              <View style={styles.btnGroup}>
                <Button
                  title={currentStep === 'newPin' ? t('resetPin') : t('continue')}
                  onPress={handleNext}
                  loading={isLoading}
                  style={styles.primaryBtn}
                />
                {currentStep !== 'mobile' && (
                  <Button
                    title={t('back')}
                    onPress={handleBack}
                    variant="ghost"
                  />
                )}
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  headerBackButton: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },

  // Step Indicator Styles
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    marginTop: Spacing.sm,
    backgroundColor: colors.background,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    ...Shadows.medium,
  },
  stepWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  stepConnector: {
    width: 40,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: Spacing.sm,
    marginTop: -20,
  },
  stepConnectorCompleted: {
    backgroundColor: colors.primary,
  },
  stepIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: Spacing.sm,
  },
  stepIconActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepIconCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepIconInactive: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: colors.primary,
  },
  stepLabelCompleted: {
    color: colors.primary,
  },
  stepLabelInactive: {
    color: colors.text.secondary,
  },

  // Main Content
  mainContent: {
    flex: 1,
    marginHorizontal: Spacing.lg,
    justifyContent: 'center',
  },

  // Layout Center
  center: {
    flex: 1,
    justifyContent: "center",
  },

  // Card & Forms
  loginCard: {
    backgroundColor: colors.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.medium,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: Spacing.sm,
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
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
    backgroundColor: "transparent",
    borderWidth: 0,
    minHeight: 50,
    height: 50,
    textAlignVertical: 'center',
  },
  pinInput: {
    letterSpacing: 2,
    textAlign: 'center',
  },
  btnGroup: {
    gap: Spacing.sm,
  },
  primaryBtn: {
    marginTop: Spacing.sm,
  },
  helperText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: "center",
    marginTop: Spacing.xs,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  otpBox: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: colors.surface,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    ...Shadows.small,
  },
  otpBoxFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
});