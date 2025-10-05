import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { account, tables, DB_ID, SPRINTS_ID, TASKS_ID } from "@/lib/appwrite";
import { Query } from "appwrite";
import TaskModal from "@/components/TaskModal";
import EmptyState from "@/components/EmptyState";
import { useRouter } from "expo-router";
import SprintLoadingState from "@/components/SprintLoadingState";
import CreateTaskModal from "@/components/CreateTask";


export default function SprintBoard() {
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sprint, setSprint] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router=useRouter();

  const screenWidth = Dimensions.get("window").width;
  const columnWidth = screenWidth / 3 - 16;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshToken,setToken]=useState(false);

  const refreshTasks = async (sprintId: string) => {
    const taskRes = await tables.listRows({
      databaseId: DB_ID,
      tableId: TASKS_ID,
      queries: [Query.equal("sprintId", sprintId)],
    });
    setTasks(taskRes.rows);
  };

  useEffect(() => {
    const fetchSprintData = async () => {
      try {
        setLoading(true);
        const user = await account.get();

        const sprintRes = await tables.listRows({
          databaseId: DB_ID,
          tableId: SPRINTS_ID,
          queries: [Query.equal("userId", user.$id), Query.equal("status", "ACTIVE")],
        });

        if (sprintRes.rows.length === 0) {
          setError("No active sprint found. Create a sprint to get started!");
          setLoading(false);
          return;
        }

        const activeSprint = sprintRes.rows[0];
        setSprint(activeSprint);

        const taskRes = await tables.listRows({
          databaseId: DB_ID,
          tableId: TASKS_ID,
          queries: [Query.equal("sprintId", activeSprint.$id)],
        });

        setTasks(taskRes.rows);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching sprint data:", err);
        setError("Failed to load sprint. Please try again.");
        setLoading(false);
      }
    };

    fetchSprintData();
  }, []);

  const dummyTasks = {
    todo: tasks.filter((t) => t.status === "TODO"),
    doing: tasks.filter((t) => t.status === "DOING"),
    completed: tasks.filter((t) => t.status === "COMPLETED"),
  };

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
              onPress={() => setSelectedTask(task)}
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

  if (loading) {
    return (
     <SprintLoadingState/>
    );
  }

  if (error) {
    return(
    <EmptyState
      title="No Active Sprint"
      message="Looks like you haven’t started a sprint yet. Create one to begin tracking your tasks and progress!"
      buttonText="Create Sprint"
      onPress={() => router.replace("/(tabs)")}
    />)
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Text className="text-xl font-bold text-center py-3">
        {sprint?.title || "Sprint"}
      </Text>

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

      <TaskModal
        visible={!!selectedTask}
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />

      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full justify-center items-center shadow-lg"
         onPress={() => setShowCreateModal(true)}
      >
        <Text className="text-white text-3xl font-bold">+</Text>
      </TouchableOpacity>

      <CreateTaskModal
      visible={showCreateModal}
      sprintId={sprint?.$id}
      onClose={() => setShowCreateModal(false)}
      onCreated={() => refreshTasks(sprint.$id)} 
    />
    </SafeAreaView>
  );
}
