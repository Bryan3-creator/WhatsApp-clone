import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { defaultStyles } from "@/constants/Styles";
import MaskInput from "react-native-mask-input";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  isClerkAPIResponseError,
  useSignIn,
  useSignUp,
} from "@clerk/clerk-expo";

const GER_PHONE = [
  "+",
  /\d/,
  /\d/,
  " ",
  /\d/,
  /\d/,
  /\d/,
  " ",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

const otp = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();
  const { signUp } = useSignUp();
  const { signIn } = useSignIn();

  const sendCode = async () => {
    try {
      await signUp?.create({
        phoneNumber,
      });
      await signUp?.preparePhoneNumberVerification();
      router.push(`verify/${phoneNumber}`);
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        console.log(error?.errors[0]);

        if (error.errors[0].code === "form_identifier_exists") {
          await trySignIn();
          router.push(`verify/${phoneNumber}?signIn=true`);
        }
      }
    }
  };

  const trySignIn = async () => {
    if (!signIn) return null;
    try {
      const { supportedFirstFactors } = await signIn.create({
        identifier: phoneNumber,
      });
      const phoneCodeFactor = supportedFirstFactors.find(
        (factor) => factor.strategy === "phone_code"
      );
      if (!phoneCodeFactor) return;
      const { phoneNumberId } = phoneCodeFactor as any;
      await signIn.prepareFirstFactor({
        strategy: "phone_code",
        phoneNumberId,
      });
    } catch (error) {}
  };

  return (
    <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.containerTop}>
          <Text style={styles.description}>
            WhatsApp will need to verify your account. Carrier charges may apply
          </Text>
          <View style={styles.list}>
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>Germany</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </View>
            <View style={styles.separator} />
            <MaskInput
              value={phoneNumber}
              onChangeText={(masked, unmasked) => {
                setPhoneNumber(masked);
                console.log({ masked, unmasked });
              }}
              keyboardType="numeric"
              autoFocus
              placeholder="+12 Your phone number"
              mask={GER_PHONE}
              style={styles.input}
            />
          </View>
          <Text style={styles.legal}>
            You must be <Text style={styles.link}>at least 16 years old</Text>{" "}
            to register. Learn how WhatsApp works with the{" "}
            <Text style={styles.link}>Meta Companies.</Text>
          </Text>
        </View>
        <View style={styles.containerBottom}>
          <TouchableOpacity
            style={[
              styles.sendButton,
              phoneNumber !== "" ? styles.enabled : null,
            ]}
            disabled={phoneNumber === ""}
            onPress={sendCode}
          >
            <Text
              style={[
                styles.sendButtonText,
                phoneNumber !== "" ? styles.enabled : null,
              ]}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default otp;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: Colors.background,
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 1,
  },
  containerTop: {},
  containerBottom: {},
  description: {
    color: Colors.gray,
  },
  list: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    width: "100%",
    paddingHorizontal: 8,
    marginVertical: 20,
    padding: 10,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    padding: 6,
  },
  listItemText: {
    color: Colors.primary,
    fontSize: 18,
  },
  separator: {
    width: "100%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.gray,
  },
  input: {
    width: "100%",
    padding: 6,
    marginTop: 10,
    fontSize: 16,
    backgroundColor: "#FFF",
  },
  legal: {
    fontSize: 15,
    textAlign: "center",
  },
  link: {
    color: Colors.primary,
  },
  sendButton: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: Colors.lightGray,
    marginBottom: 20,
  },
  enabled: {
    backgroundColor: Colors.primary,
    color: "#FFF",
  },
  sendButtonText: {
    fontSize: 20,
  },
});
