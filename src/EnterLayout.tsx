import React, { useEffect, useRef, useState } from "react";
import { Platform, Pressable, Text, Vibration, View } from "react-native";
import { PinCodeT } from "./types";
import { DEFAULT } from "./common";
import NumbersPanel from "./components/NumbersPanel";
import Pin from "./components/Pin";

const EnterLayout = ({
  pin,
  styles,
  mode,
  textOptions,
  options,
  onSwitchMode,
  onEnter,
  onReset,
  onMaxAttempt,
  onHashPin,
  onLocalAuth,
  onLocalAuthSuccess,
  onLocalAuthError,
}: {
  pin: string | undefined;
  styles?: PinCodeT.EnterStyles;
  mode: PinCodeT.Modes;
  textOptions: PinCodeT.TextOptions;
  options?: PinCodeT.Options;
  onSwitchMode?: () => void;
  onEnter: (newPin: string) => void;
  onMaxAttempt: () => void;
  onReset: () => void;
  onHashPin: (pinEnter: string) => string;
  onLocalAuth?: () => Promise<boolean> | boolean;
  onLocalAuthSuccess?: () => void;
  onLocalAuthError?: (error?: unknown) => void;
}) => {
  const [curPin, setCurPin] = useState("");
  const [disabled, disableButtons] = useState(false);
  const [failureCount, setFailureCount] = useState(0);
  const [showError, setShowError] = useState(false);
  const localAuthRequestedRef = useRef(false);

  async function onNumberPress(value: string) {
    const newPin =
      value == "delete"
        ? curPin.substring(0, curPin.length - 1)
        : curPin + value;

    setCurPin(newPin);

    if (newPin.length == options?.pinLength) {
      await processEnterPin(onHashPin(newPin) || newPin);
    }
  }

  async function processEnterPin(enteredPin: string) {
    disableButtons(true);

    if (pin === enteredPin) {
      setFailureCount(0);
      disableButtons(false);
      onEnter(enteredPin);
      return;
    }

    if (
      !options?.disableLock &&
      failureCount >=
        (options?.maxAttempt || DEFAULT.Options.maxAttempt || 5) - 1
    ) {
      disableButtons(false);
      onMaxAttempt();
      return;
    }

    setCurPin("");
    setFailureCount(failureCount + 1);

    if (Platform.OS === "ios") {
      Vibration.vibrate(); // android requires VIBRATE permission
    }

    setShowError(true);
    setTimeout(
      () => setShowError(false),
      options?.retryLockDuration || DEFAULT.Options.retryLockDuration
    );
    setTimeout(
      () => disableButtons(false),
      options?.retryLockDuration || DEFAULT.Options.retryLockDuration
    );
  }

  async function triggerLocalAuth() {
    if (!options?.allowLocalAuth || !onLocalAuth || disabled) return;

    disableButtons(true);
    try {
      const authenticated = await onLocalAuth();
      if (authenticated) {
        onLocalAuthSuccess?.();
      } else {
        onLocalAuthError?.();
      }
    } catch (error) {
      onLocalAuthError?.(error);
    } finally {
      disableButtons(false);
    }
  }

  useEffect(() => {
    if (!options?.allowLocalAuth || !options?.autoTriggerLocalAuth || !onLocalAuth) return;
    if (localAuthRequestedRef.current) return;

    localAuthRequestedRef.current = true;
    triggerLocalAuth();
  }, [onLocalAuth, options?.allowLocalAuth, options?.autoTriggerLocalAuth]);

  return (
    <>
      <View style={[DEFAULT.Styles.enter?.header, styles?.header]}>
        <Text style={[DEFAULT.Styles.enter?.title, styles?.title]}>
          {textOptions.enter?.title || DEFAULT.TextOptions.enter?.title}
        </Text>

        <Text style={[DEFAULT.Styles.enter?.subTitle, styles?.subTitle]}>
          {textOptions.enter?.subTitle?.replace(
            "{{pinLength}}",
            (options?.pinLength || DEFAULT.Options.pinLength || 4).toString()
          )}
        </Text>
        {showError && (
          <Text style={[DEFAULT.Styles.enter?.errorText, styles?.errorText]}>
            {textOptions.enter?.error || DEFAULT.TextOptions.enter?.error}
          </Text>
        )}
      </View>
      <View style={[DEFAULT.Styles.enter?.content, styles?.content]}>
        <Pin
          pin={curPin}
          pinLength={options?.pinLength || DEFAULT.Options.pinLength || 4}
          style={styles?.pinContainer}
          pinStyle={[DEFAULT.Styles.enter?.pin, styles?.pin]}
          enteredPinStyle={[
            DEFAULT.Styles.enter?.enteredPin,
            styles?.enteredPin,
          ]}
        />

        <NumbersPanel
          disabled={disabled}
          onButtonPress={onNumberPress}
          randomPositions={options?.randomPositions}
          backSpace={options?.backSpace}
          backSpaceText={textOptions.enter?.backSpace}
          buttonStyle={styles?.button}
          rowStyle={styles?.buttonRow}
          style={styles?.buttonContainer}
          textStyle={styles?.buttonText}
          disabledStyle={styles?.buttonTextDisabled}
        />
      </View>
      <View style={[DEFAULT.Styles.enter?.footer, styles?.footer]}>
        {options?.allowLocalAuth && onLocalAuth && (
          <Pressable
            disabled={disabled}
            onPress={triggerLocalAuth}
            style={(state) => ({ opacity: state.pressed || disabled ? 0.6 : 1 })}
          >
            <Text
              style={[DEFAULT.Styles.enter?.footerText, styles?.footerText]}
            >
              {textOptions.enter?.localAuthButton ||
                DEFAULT.TextOptions.enter?.localAuthButton}
            </Text>
          </Pressable>
        )}
        {options?.allowReset && (
          <Pressable
            onPress={onReset}
            style={(state) => ({ opacity: state.pressed ? 0.6 : 1 })}
          >
            <Text
              style={[DEFAULT.Styles.enter?.footerText, styles?.footerText]}
            >
              {textOptions.enter?.footerText ||
                DEFAULT.TextOptions.enter?.footerText}
            </Text>
          </Pressable>
        )}
        {options?.footerComponent}
      </View>
    </>
  );
};

export default EnterLayout;
