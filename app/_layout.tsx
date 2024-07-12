import { useFonts } from "expo-font";
import { Slot, Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { LogBox } from "react-native";
import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

LogBox.ignoreLogs(["Reanimated"]);

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const InitialLayout = () => {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (!isLoaded) return;
    /*   if (isSignedIn) {
      router.replace("/(tabs)/chats");
    } else if (!isSignedIn) {
      router.replace("/"); 
    } */
  }, [isSignedIn]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack initialRouteName="verify/[phone]">
      <Stack.Screen
        name="otp"
        options={{
          headerTitle: "Enter Your Phone Number",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="verify/[phone]"
        options={{
          headerTitle: "Verify Your Phone Number",
          headerShown: true,
          headerBackTitle: "Edit number",
        }}
      />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
};

const RootLayout = () => {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <InitialLayout />
    </ClerkProvider>
  );
};

export default RootLayout;
