import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { PinCode, PinCodeT } from "react-native-pincode-2";

const PIN_KEY = "demo.pin";

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [pin, setPin] = useState<string | undefined>(undefined);
  const [pinVisible, setPinVisible] = useState(false);
  const [pinMode, setPinMode] = useState<PinCodeT.Modes>(PinCodeT.Modes.Enter);

  useEffect(() => {
    void bootstrap();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active" && pin) {
        setPinMode(PinCodeT.Modes.Enter);
        setPinVisible(true);
      }
    });

    return () => subscription.remove();
  }, [pin]);

  async function bootstrap() {
    try {
      const storedPin = await SecureStore.getItemAsync(PIN_KEY);

      if (storedPin) {
        setPin(storedPin);
        setPinMode(PinCodeT.Modes.Enter);
        setPinVisible(true);
      } else {
        setPin(undefined);
        setPinMode(PinCodeT.Modes.Set);
        setPinVisible(true);
      }
    } finally {
      setIsReady(true);
    }
  }

  async function handleSet(newPin: string) {
    await SecureStore.setItemAsync(PIN_KEY, newPin);
    setPin(newPin);
    setPinMode(PinCodeT.Modes.Enter);
    setPinVisible(false);
  }

  async function handleReset() {
    await SecureStore.deleteItemAsync(PIN_KEY);
    setPin(undefined);
    setPinMode(PinCodeT.Modes.Set);
    setPinVisible(true);
  }

  async function handleLocalAuth(): Promise<boolean> {
    if (!pin) return false;

    const [hasHardware, isEnrolled] = await Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
    ]);

    if (!hasHardware || !isEnrolled) {
      return false;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to unlock",
      cancelLabel: "Cancel",
      fallbackLabel: "Use PIN",
      disableDeviceFallback: false,
    });

    return result.success;
  }

  function showSetMode() {
    setPinMode(PinCodeT.Modes.Set);
    setPinVisible(true);
  }

  function lockNow() {
    if (!pin) return;
    setPinMode(PinCodeT.Modes.Enter);
    setPinVisible(true);
  }

  if (!isReady) {
    return (
      <SafeAreaView style={styles.loaderRoot}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <Text style={styles.title}>Expo PIN Demo</Text>
        <Text style={styles.subtitle}>
          {pin ? "PIN configured" : "No PIN configured yet"}
        </Text>

        <Pressable style={styles.button} onPress={lockNow}>
          <Text style={styles.buttonText}>Lock now</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={showSetMode}>
          <Text style={styles.buttonText}>{pin ? "Change PIN" : "Create PIN"}</Text>
        </Pressable>

        {pin && (
          <Pressable style={[styles.button, styles.buttonDanger]} onPress={handleReset}>
            <Text style={styles.buttonText}>Remove PIN</Text>
          </Pressable>
        )}
      </View>

      <PinCode
        pin={pin}
        visible={pinVisible}
        mode={pinMode}
        options={{
          pinLength: 4,
          maxAttempt: 5,
          lockDuration: 30000,
          allowReset: true,
          allowLocalAuth: !!pin,
          autoTriggerLocalAuth: !!pin,
        }}
        textOptions={{
          enter: {
            title: "Protected space",
            subTitle: "Enter your {{pinLength}}-digit PIN.",
            localAuthButton: "Use Face ID / Fingerprint",
          },
        }}
        styles={{
          main: {
            ...StyleSheet.absoluteFillObject,
            zIndex: 99,
            backgroundColor: "#111827",
            paddingTop: 80,
          },
        }}
        onHashPin={(enteredPin) => enteredPin}
        onLocalAuth={handleLocalAuth}
        onLocalAuthSuccess={() => setPinVisible(false)}
        onLocalAuthError={() => {
          // PIN screen remains visible as fallback
        }}
        onEnter={() => setPinVisible(false)}
        onSet={handleSet}
        onSetCancel={() => {
          if (pin) {
            setPinVisible(false);
          } else {
            showSetMode();
          }
        }}
        onReset={handleReset}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  loaderRoot: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    color: "#4b5563",
    marginBottom: 16,
  },
  button: {
    minWidth: 220,
    alignItems: "center",
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 10,
  },
  buttonDanger: {
    backgroundColor: "#dc2626",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
