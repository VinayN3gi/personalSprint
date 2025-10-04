import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const dummyTasks = {
  todo: [
    { id: "1", title: "Write project plan", desc: "Draft the sprint plan document" },
    { id: "2", title: "Set up repo", desc: "Initialize GitHub repository" },
    { id: "5", title: "Review notes", desc: "Check sprint backlog items" },
  ],
  doing: [
    { id: "3", title: "UI Prototype", desc: "Design prototype screens in Figma" },
    { id: "6", title: "API Setup", desc: "Integrate Appwrite backend" },
  ],
  completed: [
    { id: "4", title: "Research tools", desc: "Look into productivity apps for reference" },
  ],
};

export default function SprintBoard() {
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const screenWidth = Dimensions.get("window").width;
  const columnWidth = screenWidth / 3 - 16;

  // Progress bar calculation
  const totalTasks =
    dummyTasks.todo.length +
    dummyTasks.doing.length +
    dummyTasks.completed.length;
  const completedTasks = dummyTasks.completed.length;
  const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;

  const renderColumn = (
    title: string,
    tasks: any[],
    color: string,
    cardColor: string,
    isLast: boolean = false
  ) => (
    <View
      style={{ width: columnWidth }}
      className={`px-1 ${isLast ? "mr-3" : ""}`}
    >
      {/* Column header with counter */}
      <Text className={`text-base font-bold mb-3 text-center ${color}`}>
        {title} ({tasks.length})
      </Text>

      {/* Scrollable tasks */}
      <ScrollView className="space-y-4">
        {tasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            className={`rounded-lg shadow px-3 py-4 ${cardColor} mb-3`}
            onPress={() => setSelectedTask(task)}
          >
            <Text className="font-semibold text-gray-900 text-sm">
              {task.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Sprint Header */}
      <Text className="text-xl font-bold text-center py-3">
        Sprint 1 (Day 3 of 7)
      </Text>

      {/* Progress Bar */}
      <View className="mx-4 mb-4">
        <View className="h-3 w-full bg-gray-300 rounded-full overflow-hidden">
          <View
            style={{ width: `${progress * 100}%` }}
            className="h-full bg-green-500"
          />
        </View>
        <Text className="text-sm text-center mt-2 text-gray-600">
          {completedTasks}/{totalTasks} tasks completed
        </Text>
      </View>

      {/* Columns with full-height dashed dividers */}
      <View className="flex-row flex-1 px-2">
        {renderColumn("TO DO", dummyTasks.todo, "text-gray-700", "bg-gray-300/90")}
        <View
          className="w-px border-l border-gray-400 mx-2"
          style={{ borderStyle: "dashed", borderWidth: 1 }}
        />
        {renderColumn("DOING", dummyTasks.doing, "text-blue-600", "bg-blue-100")}
        <View
          className="w-px border-l border-gray-400 mx-2"
          style={{ borderStyle: "dashed", borderWidth: 1 }}
        />
        {renderColumn(
          "COMPLETED",
          dummyTasks.completed,
          "text-green-600",
          "bg-green-100",
          true
        )}
      </View>

      {/* Task Modal */}
      <Modal
        visible={!!selectedTask}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedTask(null)}
      >
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="bg-white rounded-xl w-11/12 p-6">
            <Text className="text-xl font-bold mb-2">{selectedTask?.title}</Text>
            <Text className="text-gray-700 mb-6">{selectedTask?.desc}</Text>
            <Pressable
              onPress={() => setSelectedTask(null)}
              className="bg-blue-600 rounded-lg py-3"
            >
              <Text className="text-white text-center font-semibold">Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Floating Add Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full justify-center items-center shadow-lg"
        onPress={() => {}}
      >
        <Text className="text-white text-3xl font-bold">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
