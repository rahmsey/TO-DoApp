// app/tasks/_layout.tsx
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function TaskLayout() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? "#111" : "#fff",
        },
        headerTintColor: isDark ? "#fff" : "#000",
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "600",
        },
        headerShadowVisible: false,
      }}
    >
      {/* Task List screen */}
      <Stack.Screen
        name="index"
        options={{
          title: "Task List", // this appears at top
        }}
      />

      {/* Add Task screen */}
      <Stack.Screen
        name="add"
        options={{
          title: "Add Task",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
