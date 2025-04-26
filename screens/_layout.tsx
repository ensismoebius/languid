import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={
          {
            headerShown: false,
            contentStyle: { backgroundColor: "#eee" },
          }
        }
      >
        <Stack.Screen name="Editor" />
        <Stack.Screen name="LoginScreen" />
      </Stack>
    </SafeAreaProvider>
  );
}
