import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { tables, DB_ID, SPRINTS_ID } from "@/lib/appwrite";


interface HeaderProps {
  progress: number;
  completedTasks: number;
  totalTasks: number;
  startDate?: string;
  endDate?: string;
  duration?: number;
  sprintId?: string;
  status?: string;
  onSprintEnded?: () => void;
  onCompleted:()=>void
}

const SprintboardHeader = ({
  progress,
  totalTasks,
  completedTasks,
  startDate,
  endDate,
  duration,
  sprintId,
  status,
  onSprintEnded,
  onCompleted
}: HeaderProps) => {
  const [loading, setLoading] = useState(false);


  const getCurrentDay = () => {
    if (!startDate) return 0;
    const now = new Date();
    const start = new Date(startDate);
    const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 1;
  };

  const currentDay = getCurrentDay();
  const sprintLength = duration || 7;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleEndSprint = async () => {
    if (!sprintId) return;
    setLoading(true);

    try {
      await tables.updateRow({
        databaseId: DB_ID,
        tableId: SPRINTS_ID,
        rowId: sprintId,
        data: { status: "COMPLETED" },
      });

      setLoading(false);
      onCompleted()
      onSprintEnded && onSprintEnded();
    } catch (err) {
      console.error("Error ending sprint:", err);
      setLoading(false);
    }
  };

  return (
    <View className="mx-4 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
      {/* Sprint Title and Day Tracker */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold text-gray-900">Sprint Progress</Text>
        <Text className="text-sm font-medium text-blue-600">
          Day {currentDay > sprintLength ? sprintLength : currentDay}/{sprintLength}
        </Text>
      </View>

      {/* Progress Bar */}
      <View className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
        <View
          style={{ width: `${progress * 100}%` }}
          className="h-full bg-green-500"
        />
      </View>

      {/* Task Progress */}
      <Text className="text-sm text-center mt-2 text-gray-600">
        {completedTasks}/{totalTasks} tasks completed
      </Text>

      {/* Sprint Dates */}
      {(startDate || endDate) && (
        <View className="flex-row justify-between mt-3">
          <Text className="text-xs text-gray-500">
            Start: <Text className="font-medium text-gray-700">{formatDate(startDate)}</Text>
          </Text>
          <Text className="text-xs text-gray-500">
            End: <Text className="font-medium text-gray-700">{formatDate(endDate)}</Text>
          </Text>
        </View>
      )}

      {/* End Sprint Button */}
      {status === "ACTIVE" && (
        <TouchableOpacity
          onPress={() => handleEndSprint()}
          disabled={loading}
          className={`mt-4 py-3 rounded-lg ${
            loading ? "bg-red-400" : "bg-red-600"
          } flex-row justify-center items-center active:opacity-90`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">End Sprint</Text>
          )}
        </TouchableOpacity>

      )}
    </View>
  );
};

export default SprintboardHeader;
