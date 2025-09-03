import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  LayoutAnimation,
} from "react-native";
import { router } from "expo-router";
import { Phone } from "lucide-react-native";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { useAppSettings } from "@/hooks/useAppSettings";

import { useAuth } from "@/hooks/useAuth";
import { useRequestOtp, useLogin } from "@/hooks/useApi";
import Button from "@/components/ui/Button";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const [mobileNumber, setMobileNumber] = useState("");

  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const otpInputRefs = useRef<TextInput[]>([]);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Banner images array
  const bannerImages = [
    {
      uri: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/akbi9amrsr36bu10mpbj4",
      slogan: "Sabka Saath, Sabka Vikas"
    },
    {
      uri: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/onaptyoia584jcqbmalfg",
      slogan: "Unity in Diversity"
    },
    {
      uri: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/1y7ginuej799zpineibmz",
      slogan: "Seva Hi Sangathan"
    }
  ];

  const { setAuthData } = useAuth();
  const { colors, currentTheme, t } = useAppSettings();
  const requestOtpMutation = useRequestOtp();
  const loginMutation = useLogin();

  // Auto-scroll banner images
  useEffect(() => {
    if (isKeyboardVisible) return; // Don't auto-scroll when keyboard is visible
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % bannerImages.length;
      setCurrentBannerIndex(currentIndex);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: currentIndex * width,
          animated: true,
        });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [bannerImages.length, isKeyboardVisible]);

  // Keyboard visibility listeners with Android-specific handling
  useEffect(() => {
    let keyboardTimer: NodeJS.Timeout;
    let isKeyboardShowing = false;
    
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        clearTimeout(keyboardTimer);
        if (!isKeyboardShowing) {
          isKeyboardShowing = true;
          // Disable layout animations on Android to prevent flickering
          if (Platform.OS === 'android') {
            LayoutAnimation.configureNext({
              duration: 0,
              update: { type: 'linear', property: 'opacity' },
            });
          }
          setIsKeyboardVisible(true);
        }
      }
    );
    
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        clearTimeout(keyboardTimer);
        if (isKeyboardShowing) {
          isKeyboardShowing = false;
          // Longer delay for Android to prevent flickering
          const delay = Platform.OS === 'android' ? 400 : 150;
          keyboardTimer = setTimeout(() => {
            // Disable layout animations on Android to prevent flickering
            if (Platform.OS === 'android') {
              LayoutAnimation.configureNext({
                duration: 0,
                update: { type: 'linear', property: 'opacity' },
              });
            }
            setIsKeyboardVisible(false);
          }, delay);
        }
      }
    );

    return () => {
      clearTimeout(keyboardTimer);
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // OTP Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleRequestOtp = async () => {
    if (!mobileNumber.trim()) {
      Alert.alert(t('error'), t('pleaseEnterMobileNumber'));
      return;
    }
    if (mobileNumber.length !== 10) {
      Alert.alert(t('error'), t('mobileNumberMust10Digits'));
      return;
    }

    setIsLoading(true);
    try {
      await requestOtpMutation.mutateAsync({ mobile_number: mobileNumber });
      setOtpSent(true);
      setOtpTimer(60); // 60 seconds timer
      Alert.alert(t('success'), t('otpSentSuccessfully'));
    } catch (error: any) {
      Alert.alert(t('error'), error.message || t('failedToSendOtp'));
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

  const handleLogin = async () => {
    const otpValue = otpDigits.join('');
    if (!mobileNumber.trim() || !otpValue.trim()) {
      Alert.alert(t('error'), t('pleaseEnterBothMobileAndOtp'));
      return;
    }
    if (otpValue.length !== 6) {
      Alert.alert(t('error'), t('otpMust6Digits'));
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginMutation.mutateAsync({
        mobile_number: mobileNumber,
        otp: otpValue,
      });
      
      // Set authentication data with token from API response
      await setAuthData(response);
      
      Alert.alert(t('success'), `${t('welcome')} ${response.karyakarta.name}!`);
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert(t('error'), error.message || t('loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-pin");
  };

  const handleRegister = () => {
    router.push("/new-user");
  };

  const dismissKeyboard = () => {
    // Prevent layout animation on Android to reduce flickering
    if (Platform.OS === 'android') {
      LayoutAnimation.configureNext({
        duration: 0,
        update: { type: 'linear', property: 'opacity' },
      });
    }
    Keyboard.dismiss();
  };

  const styles = createStyles(colors, isKeyboardVisible);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={currentTheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.surface}
      />

      {/* BJP Banner Carousel - Smooth transition */}
      {!isKeyboardVisible && (
        <View style={styles.bannerWrapper}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentBannerIndex(index);
            }}
          >
            {bannerImages.map((banner, index) => (
              <View key={index} style={styles.bannerSlide}>
                <Image 
                  source={{ uri: banner.uri }} 
                  style={styles.bannerImage} 
                  resizeMode="cover"
                />
                <View style={styles.bannerOverlay}>
                  <Text style={styles.bannerSlogan}>
                    &ldquo;{banner.slogan}&rdquo;
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Main Content */}
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <KeyboardAvoidingView
          style={styles.mainContent}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
       
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Image
                source={{
                  uri: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/883hzv1gvf1dh5pk5dd8q",
                }}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.welcomeSubtitle}>BHARATIYA JANATA PARTY</Text>
          </View>

          {/* Login Card */}
          <View style={styles.loginCard}>
            {!otpSent ? (
              <>
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
                      value={mobileNumber}
                      onChangeText={setMobileNumber}
                      placeholder={t('enterMobileNumber')}
                      placeholderTextColor={colors.text.light}
                      keyboardType="phone-pad"
                      maxLength={10}
                    />
                  </View>
                </View>

                <Button
                  title={isLoading ? t('sendingOtp') : t('sendOtp')}
                  onPress={handleRequestOtp}
                  disabled={isLoading || mobileNumber.length !== 10}
                  loading={isLoading}
                  style={styles.loginButton}
                />
              </>
            ) : (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{t('enterOtp')}</Text>
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
                        secureTextEntry={!showOtp}
                        selectTextOnFocus
                      />
                    ))}
                  </View>
                  <TouchableOpacity
                    style={styles.showHideButton}
                    onPress={() => setShowOtp(!showOtp)}
                  >
                    <Text style={styles.showHideText}>
                      {showOtp ? t('hideOtp') : t('showOtp')}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Button
                  title={isLoading ? t('loggingIn') : t('login')}
                  onPress={handleLogin}
                  disabled={isLoading || otpDigits.join('').length !== 6}
                  loading={isLoading}
                  style={styles.loginButton}
                />

                <View style={styles.resendContainer}>
                  {otpTimer > 0 ? (
                    <Text style={styles.timerText}>
                      {t('resendOtpIn')} {otpTimer}s
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={handleRequestOtp}>
                      <Text style={styles.resendText}>{t('resendOtp')}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}



            <View style={styles.forgotPin}>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.registerLink}>{t('forgotPin')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Register Section */}
          <View style={styles.registerSection}>
            <Text style={styles.registerText}>
              {t('dontHaveAccount')}{" "}
             
                <Text style={styles.registerLink} onPress={handleRegister} >{t('register')}</Text>
              
            </Text>
          </View>
  
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const createStyles = (colors: any, isKeyboardVisible: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
    },

bannerWrapper: {
      height: 200,
      marginHorizontal: Spacing.lg,
      marginTop: Spacing.lg,
      borderRadius: 12,
      overflow: "hidden",
      position: "relative",
    },
    bannerSlide: {
      width: width - (Spacing.lg * 2),
      height: "100%",
      position: "relative",
    },
    bannerImage: {
      width: "100%",
      height: "100%",
    },
    paginationContainer: {
      position: "absolute",
      bottom: 10,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      marginHorizontal: 4,
    },
    paginationDotActive: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    bannerOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
    },
    bannerSlogan: {
      fontSize: 16,
      fontWeight: "600",
      fontStyle: "italic",
      color: "#fff",
      textAlign: "center",
    },

    // Main Content
    mainContent: {
      flex: 1,
      marginHorizontal: Spacing.lg,  
      justifyContent: "center",
      paddingTop: isKeyboardVisible ? Spacing.lg : 0,
    },
    mainContentKeyboardVisible: {
      flex: 1,
      justifyContent: "flex-start",
      paddingTop: Spacing.lg,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: Spacing.lg
    },

    logoSection: {
      alignItems: "center",
      marginBottom: 10,
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 10,
    },
    logoImage: {
      width: 75,
      height: 75,
    },
    welcomeSubtitle: {
      fontSize: 16,
      color: colors.text.secondary,
    },

    loginCard: {
      backgroundColor: colors.background,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      ...Shadows.medium,
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
      paddingRight: 50,
    },
    eyeIcon: {
      position: "absolute",
      right: Spacing.md,
      padding: Spacing.xs,
    },
    loginButton: {
      marginTop: Spacing.sm,
      marginBottom: Spacing.md,
    },

    forgotPin: {
      alignItems: "flex-end",
      textAlign: "right",
    },

    registerSection: {
      alignItems: "center",
      marginTop:10,
      marginBottom: Spacing.md,
    },
    registerText: {
      fontSize: 16,
      color: colors.text.secondary,
    },
    registerLink: {
      color: colors.primary,
      fontWeight: "500",
    },
    resendContainer: {
      alignItems: "center",
      marginTop: Spacing.sm,
    },
    timerText: {
      fontSize: 14,
      color: colors.text.secondary,
    },
    resendText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "500",
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
    showHideButton: {
      alignSelf: 'flex-end',
      paddingVertical: Spacing.xs,
    },
    showHideText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '500',
    },
  });
