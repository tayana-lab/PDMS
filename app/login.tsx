import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { Phone, Lock } from "lucide-react-native";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useAuth } from "@/hooks/useAuth";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native-gesture-handler";

const LoginScreen = () => {
  const { settings } = useAppSettings();
  const { login } = useAuth();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");

  const handleLogin = async () => {
    if (!phone || !pin) {
      alert("Please enter phone number and pin");
      return;
    }
    try {
      const success = await login(phone, pin);
      if (success) {
        router.push("/home");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      alert("Login failed. Try again.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Gradient background */}
      <LinearGradient
        colors={["#FF6B35", "#FF8A65", "#FFAB91"]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{settings?.appName || "My App"}</Text>
            <Text style={styles.subtitle}>Welcome back! Please log in</Text>
          </View>

          {/* Phone input */}
          <View style={styles.inputContainer}>
            <Phone size={20} color="#fff" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#eee"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              returnKeyType="done"
            />
          </View>

          {/* PIN input */}
          <View style={styles.inputContainer}>
            <Lock size={20} color="#fff" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="PIN"
              placeholderTextColor="#eee"
              secureTextEntry
              value={pin}
              onChangeText={setPin}
              returnKeyType="done"
            />
          </View>

          {/* Login button */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          {/* New user */}
          <TouchableOpacity
            style={styles.link}
            onPress={() => router.push("/register")}
          >
            <Text style={styles.linkText}>New User</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#f0f0f0",
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FF6B35",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: "#fff",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
