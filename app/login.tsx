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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Colors, Spacing } from "@/constants/theme";
import { leaders } from "@/constants/leaders";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const { width } = Dimensions.get("window");

type LoginStep = "login" | "mobile" | "otp";

export default function LoginScreen() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<LoginStep>("login");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const { login, sendOTP, verifyOTP } = useAuth();

  // Auto-scroll leader banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % leaders.length;
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            x: nextIndex * width,
            animated: true,
          });
        }
        return nextIndex;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    if (!phone.trim() || !pin.trim()) {
      Alert.alert("Error", "Enter both phone and PIN");
      return;
    }
    setIsLoading(true);
    try {
      const result = await login(phone, pin);
      if (result.success) router.replace("/(tabs)");
      else Alert.alert("Error", result.error || "Login failed");
    } finally {
      setIsLoading(false);
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
        {/* BJP Leaders Banner */}
        <View style={styles.bannerWrapper}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
          >
            {leaders.map((leader) => (
              <View key={leader.id} style={styles.bannerSlide}>
                <Image source={{ uri: leader.image }} style={styles.bannerImage} />
                <View style={styles.bannerTextBox}>
                  <Text style={styles.bannerName}>{leader.name}</Text>
                  <Text style={styles.bannerPosition}>{leader.position}</Text>
                  <Text style={styles.bannerSlogan}>
                    “Sabka Saath, Sabka Vikas”
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Main Content */}
       
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.center}>
              <View style={styles.loginCard}>
                <Text style={styles.title}>
                  {step === "login" ? "Welcome Back" : step === "mobile" ? "New User" : "Verify OTP"}
                </Text>
                <Text style={styles.subtitle}>
                  {step === "login"
                    ? "Sign in to continue"
                    : step === "mobile"
                    ? "Enter your mobile number"
                    : `OTP sent to ${phone}`}
                </Text>

                {/* Compact Inputs */}
                <View style={styles.inputGroup}>
                  {step === "login" && (
                    <>
                      <Input
                        label="Phone"
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="Phone number"
                        keyboardType="phone-pad"
                        maxLength={10}
                      />
                      <Input
                        label="PIN"
                        value={pin}
                        onChangeText={setPin}
                        placeholder="4-digit PIN"
                        secureTextEntry
                        maxLength={4}
                      />
                    </>
                  )}
                  {step === "mobile" && (
                    <Input
                      label="Phone"
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="Phone number"
                      keyboardType="phone-pad"
                      maxLength={10}
                    />
                  )}
                  {step === "otp" && (
                    <Input
                      label="OTP"
                      value={otp}
                      onChangeText={setOtp}
                      placeholder="Enter OTP"
                      keyboardType="numeric"
                      maxLength={4}
                    />
                  )}
                </View>

                {/* Compact Buttons */}
                <View style={styles.btnGroup}>
                  {step === "login" && (
                    <>
                      <Button
                        title="Sign In"
                        onPress={handleLogin}
                        loading={isLoading}
                        style={styles.primaryBtn}
                      />
                      <Button
                        title="New User"
                        onPress={() => router.push('/new-user')}
                        variant="outline"
                      />
                    </>
                  )}
                  {step === "mobile" && (
                    <>
                      <Button
                        title="Send OTP"
                        onPress={() => setStep("otp")}
                        loading={isLoading}
                        style={styles.primaryBtn}
                      />
                      <Button
                        title="Back"
                        onPress={() => setStep("login")}
                        variant="ghost"
                      />
                    </>
                  )}
                  {step === "otp" && (
                    <>
                      <Button
                        title="Verify"
                        onPress={() => router.replace("/(tabs)")}
                        loading={isLoading}
                        style={styles.primaryBtn}
                      />
                      <Button
                        title="Back"
                        onPress={() => setStep("mobile")}
                        variant="ghost"
                      />
                    </>
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
  container: { flex: 1 },
  gradientBackground: { flex: 1 },
  bannerWrapper: { height: 120 },
  bannerSlide: {
    width,
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    justifyContent: "center",
  },
  bannerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: Spacing.md,
    borderWidth: 2,
    borderColor: "#fff",
  },
  bannerTextBox: { flex: 1 },
  bannerName: { fontSize: 16, fontWeight: "700", color: "#fff" },
  bannerPosition: { fontSize: 12, color: "rgba(255,255,255,0.9)" },
  bannerSlogan: { fontSize: 11, fontStyle: "italic", color: "rgba(255,255,255,0.8)" },

  safeArea: { flex: 1 },
  center: { flex: 1, justifyContent: "center", paddingHorizontal: 20 },
  loginCard: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxWidth: 380,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#FF6B35", textAlign: "center" },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  inputGroup: { marginBottom: 20, gap: 12 },
  btnGroup: { gap: 12 },
  primaryBtn: { borderRadius: 14, paddingVertical: 12 },
});
