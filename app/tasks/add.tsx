import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { loadTasks, saveTasks } from "../../src/storage/taskStorage";
import { Task } from "../../src/types/Task";
import { Ionicons } from "@expo/vector-icons";

export default function AddTaskScreen() {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const router = useRouter();

  // FAB Animation
  const scale = useRef(new Animated.Value(1)).current;

  const runBounce = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.92, duration: 90, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1.08, duration: 140, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) setDueDate(selectedDate);
  };

  const addTask = async () => {
    if (!title.trim()) {
      Alert.alert("Missing Title", "Please enter a task title.");
      return;
    }

    const tasks = await loadTasks();

    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false,
      dueDate: dueDate ? dueDate.toISOString() : undefined,
    };

    await saveTasks([...tasks, newTask]);

    router.back();
  };

  const handleVoiceInput = () => {
    runBounce();

    Alert.alert(
      "Voice Input Disabled in Demo",
      "Whisper speech-to-text requires paid billing.\n" +
        "In production, this microphone FAB would:\n" +
        "• Start listening\n" +
        "• Convert speech to text\n" +
        "• Split sentences into multiple tasks automatically."
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task Title</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter task title..."
        value={title}
        onChangeText={setTitle}
      />

      {/* Date Picker */}
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker(true)}>
        <Text style={styles.dateButtonText}>
          {dueDate ? `Due Date: ${dueDate.toDateString()}` : "Select Due Date"}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}

      <View style={{ height: 20 }} />

      <Button title="Save Task" onPress={addTask} />

      {/* Voice Input FAB */}
      <View style={{ alignItems: "center", marginTop: 30 }}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleVoiceInput}
            style={styles.voiceFab}
          >
            <Ionicons name="mic-outline" size={30} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.voiceLabel}>Voice Input</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  label: { fontSize: 16, marginBottom: 6, fontWeight: "500" },

  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
    backgroundColor: "#fff",
  },

  dateButton: {
    padding: 12,
    backgroundColor: "#EAF3FF",
    borderRadius: 6,
    marginBottom: 10,
  },
  dateButtonText: { fontSize: 16, color: "#1A73E8" },

  // Floating Voice FAB
  voiceFab: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },

    elevation: 6,
  },

  voiceLabel: {
    marginTop: 8,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
});
