import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { AuthProvider } from '../contexts/AuthContext';


export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#eee" },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="Editor" />
        </Stack>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
