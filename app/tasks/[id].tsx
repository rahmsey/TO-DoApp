// app/tasks/[id].tsx
import React, { useEffect, useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { loadTasks, saveTasks } from "../../src/storage/taskStorage";
import { Task } from "../../src/types/Task";

export default function TaskDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const tasks = await loadTasks();
      const found = tasks.find(t => t.id === Number(id));
      if (!found) {
        Alert.alert("Not found", "Task not found"); 
        router.back();
        return;
      }
      setTask(found);
      setTitle(found.title);
      setDueDate(found.dueDate ? new Date(found.dueDate) : null);
    };
    load();
  }, [id]);

  const handleSave = async () => {
    if (!task) return;
    const updated: Task = { ...task, title, dueDate: dueDate ? dueDate.toISOString() : undefined };
    const all = await loadTasks();
    const merged = all.map(t => t.id === updated.id ? updated : t);
    await saveTasks(merged);
    router.back();
  };

  const handleDateChange = (_: any, selected?: Date) => {
    setShowPicker(false);
    if (selected) setDueDate(selected);
  };

  if (!task) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Button title={dueDate ? `Due: ${dueDate.toDateString()}` : "Select Due Date"} onPress={() => setShowPicker(true)} />
      {showPicker && (
        <DateTimePicker value={dueDate || new Date()} mode="date" display="default" onChange={handleDateChange} />
      )}

      <View style={{ height: 12 }} />
      <Button title="Save" onPress={handleSave} />
      <View style={{ height: 8 }} />
      <Button title="Back" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, marginBottom: 8 },
  input: { borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 12 },
});
