// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // removes global header completely
      }}
    >
      {/* Home index (redirects to /tasks automatically) */}
      <Stack.Screen name="index" />

      {/* Folder layout for /tasks */}
      <Stack.Screen name="tasks" />
    </Stack>
  );
}
