// app/tasks/index.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SectionList,
  TextInput,
  Animated,
  Platform,
  LayoutAnimation,
  UIManager,
  useColorScheme,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { loadTasks, saveTasks } from "../../src/storage/taskStorage";
import { Task } from "../../src/types/Task";
import { Colors } from "../../src/constants/colors";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type SortMode = "due" | "title" | "completed";

export default function TaskListScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("due");
  const router = useRouter();

  const scheme = useColorScheme();
  const theme = Colors[scheme ?? "light"];

  const fabScale = useRef(new Animated.Value(1)).current;

  const runFabBounce = () => {
    Animated.sequence([
      Animated.timing(fabScale, { toValue: 0.9, duration: 80, useNativeDriver: true }),
      Animated.timing(fabScale, { toValue: 1.05, duration: 150, useNativeDriver: true }),
      Animated.timing(fabScale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  };

  const sortBy = (list: Task[]) => {
    if (sortMode === "title") {
      return [...list].sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortMode === "completed") {
      return [...list].sort((a, b) => Number(a.completed) - Number(b.completed));
    }
    return [...list].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  };

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const data = await loadTasks();
        setTasks(sortBy(data));
      };
      load();
    }, [sortMode])
  );

  useEffect(() => {
    setTasks((prev) => sortBy(prev));
  }, [sortMode]);

  const filtered = tasks.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase())
  );

  const pending = filtered.filter((t) => !t.completed);
  const completed = filtered.filter((t) => t.completed);

  const sections = [
    { title: "Pending Tasks", data: pending },
    { title: "Completed Tasks", data: completed },
  ];

  const animateLayout = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const toggleTask = async (id: number) => {
    animateLayout();
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    const sorted = sortBy(updated);
    setTasks(sorted);
    await saveTasks(sorted);
  };

  const deleteTask = async (id: number) => {
    animateLayout();
    const updated = tasks.filter((t) => t.id !== id);
    const sorted = sortBy(updated);
    setTasks(sorted);
    await saveTasks(sorted);
  };

  const Row = ({ item }: { item: Task }) => {
    const scale = useRef(new Animated.Value(1)).current;

    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <View
          style={[
            styles.taskCard,
            { backgroundColor: theme.card, shadowColor: theme.text }
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.taskLeft}
            onPress={() => toggleTask(item.id)}
            onPressIn={() =>
              Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start()
            }
            onPressOut={() =>
              Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()
            }
          >
            <Text
              style={[
                styles.statusIcon,
                { color: item.completed ? theme.completed : theme.checkboxBorder }
              ]}
            >
              {item.completed ? "✔" : "○"}
            </Text>

            <View>
              <Text
                style={[
                  styles.taskText,
                  { color: theme.text },
                  item.completed && { textDecorationLine: "line-through", color: theme.textSecondary }
                ]}
              >
                {item.title}
              </Text>

              {item.dueDate && (
                <Text style={[styles.dueDate, { color: theme.textSecondary }]}>
                  Due: {new Date(item.dueDate).toDateString()}
                </Text>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => deleteTask(item.id)}>
            <Text style={[styles.delete, { color: theme.delete }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Search + Sorting */}
      <View style={styles.toolbar}>
        <TextInput
          style={[
            styles.search,
            { backgroundColor: theme.searchBackground, color: theme.text }
          ]}
          placeholder="Search tasks..."
          placeholderTextColor={theme.textSecondary}
          value={query}
          onChangeText={setQuery}
        />

        <View style={styles.sortRow}>
          {(["due", "title", "completed"] as SortMode[]).map((mode) => (
            <TouchableOpacity
              key={mode}
              onPress={() => setSortMode(mode)}
              style={[
                styles.sortBtn,
                sortMode === mode && { backgroundColor: "#cfe3ff" }
              ]}
            >
              <Text style={[styles.sortText, { color: theme.text }]}>
                {mode === "due" ? "Due" : mode === "title" ? "Title" : "Status"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* FIXED SECTION HEADER */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Row item={item} />}
        renderSectionHeader={({ section }) =>
          section.data.length > 0 ? (
            <View style={[styles.sectionHeaderContainer, { backgroundColor: theme.background }]}>
              <Text style={[styles.sectionHeader, { color: theme.text }]}>
                {section.title}
              </Text>
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 140 }}
      />

      {/* FAB */}
      <Animated.View
        style={{
          transform: [{ scale: fabScale }],
          position: "absolute",
          right: 20,
          bottom: 20,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            runFabBounce();
            router.push("/tasks/add");
          }}
          style={[styles.fab, { backgroundColor: "#007AFF" }]}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  toolbar: { marginBottom: 12 },

  search: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    fontSize: 16,
  },

  sortRow: { flexDirection: "row", marginBottom: 8 },
  sortBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 6,
  },
  sortText: { fontSize: 14 },

  /* FIXED HEADER */
  sectionHeaderContainer: {
    paddingVertical: 8,
    backgroundColor: "#f2f2f6",
  },

  sectionHeader: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 6,
  },

  taskCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    marginBottom: 12,
    borderRadius: 14,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  taskLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  statusIcon: { fontSize: 22, marginRight: 12 },

  taskText: { fontSize: 16, fontWeight: "600" },

  dueDate: { marginTop: 4, fontSize: 13 },

  delete: { fontWeight: "700" },

  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },

  fabText: { color: "#fff", fontSize: 32, lineHeight: 36 },
});
