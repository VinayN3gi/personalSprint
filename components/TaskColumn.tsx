import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";

interface TaskColumnProps {
  title: string;
  tasks: any[];
  color: string;
  cardColor: string;
  isLast?: boolean;
  onSelectTask: (task: any) => void;
}

const screenWidth = Dimensions.get("window").width;
const columnWidth = screenWidth / 3 - 16;

export default function TaskColumn({
  title,
  tasks,
  color,
  cardColor,
  isLast = false,
  onSelectTask,
}: TaskColumnProps) {
  return (
    <View
      style={{ width: columnWidth }}
      className={`px-1 ${isLast ? "mr-3" : ""}`}
    >
      <Text className={`text-base font-bold mb-3 text-center ${color}`}>
        {title} ({tasks.length})
      </Text>

      <ScrollView className="space-y-4">
        {tasks.length === 0 ? (
          <Text className="text-center text-gray-500 text-sm italic">
            No tasks here
          </Text>
        ) : (
          tasks.map((task) => (
            <TouchableOpacity
              key={task.$id}
              className={`rounded-lg shadow px-3 py-4 ${cardColor} mb-3`}
              onPress={() => onSelectTask(task)}
            >
              <Text className="font-semibold text-gray-900 text-sm">
                {task.title}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
