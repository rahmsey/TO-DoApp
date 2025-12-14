import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "../types/Task";

const KEY = "TASKS_V1";

export async function loadTasks(): Promise<Task[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Task[];
  } catch (e) {
    console.warn("loadTasks error", e);
    return [];
  }
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(tasks));
  } catch (e) {
    console.warn("saveTasks error", e);
  }
}

export async function updateTask(updatedTask: Task): Promise<void> {
  const tasks = await loadTasks();
  const updated = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
  await saveTasks(updated);
}
