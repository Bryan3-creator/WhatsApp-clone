import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";

import Colors from "@/constants/Colors";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import {
  isClerkAPIResponseError,
  useSignIn,
  useSignUp,
} from "@clerk/clerk-expo";

const CELL_COUNT = 6;

const Page = () => {
  const [code, setCode] = useState("");
  const { phone, signIn } = useLocalSearchParams<{
    phone: string;
    signIn: string;
  }>();
  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });
  const router = useRouter();
  const { signUp, setActive } = useSignUp();
  const { signIn: signInAuth } = useSignIn();
  console.log({ signIn });
  useEffect(() => {
    if (code.length === 6) {
      if (signIn === "true") {
        verifySignIn();
      } else {
        verifyCode();
      }
    }
  }, [code]);

  const verifyCode = async () => {
    try {
      const signUpAttemp = await signUp?.attemptPhoneNumberVerification({
        code,
      });
      if (signUpAttemp?.status !== "complete") return;
      await setActive!({
        session: signUpAttemp?.createdSessionId,
      });
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        Alert.alert("Error", error?.errors[0].longMessage);
      }
    }
  };

  const verifySignIn = async () => {
    try {
      const signInAttempt = await signInAuth?.attemptFirstFactor({
        strategy: "phone_code",
        code,
      });

      if (signInAttempt?.status !== "complete") return;
      await setActive!({
        session: signInAttempt.createdSessionId,
      });
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        Alert.alert("Error", error.errors[0].longMessage);
      }
    }
  };

  const resendCode = async () => {
    try {
      if (signIn === "true") {
        const { supportedFirstFactors } = await signInAuth!.create({
          identifier: phone!,
        });
        const phoneCodeFactor = supportedFirstFactors.find(
          (factor) => factor.strategy === "phone_code"
        ) as any;
        if (!phoneCodeFactor) return;
        const { phoneNumberId } = phoneCodeFactor;
        await signInAuth?.prepareFirstFactor({
          strategy: "phone_code",
          phoneNumberId,
        });
      } else {
        const signUpAttempt = await signUp?.create({
          phoneNumber: phone,
        });

        await signUpAttempt.preparePhoneNumberVerification();
      }
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        Alert.alert("Error", error.errors[0].longMessage);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ headerTitle: phone, headerTitleAlign: "center" }}
      />
      <Text style={styles.description}>
        We have sent you an SMS with a code to the number above.
      </Text>
      <Text style={styles.description}>
        To complete your phone number verification, please enter the 6-digit
        activation code.
      </Text>
      <CodeField
        ref={ref}
        {...props}
        value={code}
        onChangeText={setCode}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        renderCell={({ index, symbol, isFocused }) => {
          return (
            <View
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
            >
              <Text
                style={styles.cellText}
                onLayout={getCellOnLayoutHandler(index)}
              >
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          );
        }}
      />
      <TouchableOpacity style={styles.button} onPress={resendCode}>
        <Text style={styles.buttonText}>
          Didn't receive a verification code?
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: Colors.background,
    flex: 1,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    paddingBottom: 20,
  },
  codeFieldRoot: {
    marginTop: 20,
    width: 260,
    marginLeft: "auto",
    marginRight: "auto",
    gap: 4,
  },
  cell: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#CCC",
    borderBottomWidth: 2,
  },
  focusCell: {
    borderBottomColor: Colors.gray,
    borderBottomWidth: 2,
  },
  cellText: {
    color: "#000",
    fontSize: 18,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: Colors.primary,
    fontSize: 18,
    textAlign: "center",
  },
});
