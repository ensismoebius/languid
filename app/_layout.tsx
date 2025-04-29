import { AuthProvider } from "@/contexts/AuthContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack
          screenOptions={
            {
              headerShown: false,
              contentStyle: { backgroundColor: "#eee" },
            }
          }
        >
          <Stack.Screen name="index" />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
