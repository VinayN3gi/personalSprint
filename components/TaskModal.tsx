import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { tables, DB_ID, TASKS_ID } from "@/lib/appwrite";

interface TaskModalProps {
  visible: boolean;
  task: any | null;
  onClose: () => void;
  onCreated: () => void;
}

export default function TaskModal({
  visible,
  task,
  onClose,
  onCreated,
}: TaskModalProps) {
  const [loading, setLoading] = useState(false); // delete loading
  const [movingTo, setMovingTo] = useState<string | null>(null); // which move button is active

  if (!task) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      await tables.deleteRow({
        databaseId: DB_ID,
        tableId: TASKS_ID,
        rowId: task.$id,
      });
      setLoading(false);
      onCreated();
      onClose();
    } catch (error) {
      console.error("Error deleting task:", error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      setMovingTo(newStatus);
      await tables.updateRow({
        databaseId: DB_ID,
        tableId: TASKS_ID,
        rowId: task.$id,
        data: { status: newStatus },
      });
      setMovingTo(null);
      onCreated();
      onClose();
    } catch (error) {
      console.error("Error updating task status:", error);
      setMovingTo(null);
    }
  };

  const currentStatus = task.status;
  let nextStatus: string | null = null;
  let prevStatus: string | null = null;

  if (currentStatus === "TODO") nextStatus = "DOING";
  else if (currentStatus === "DOING") {
    nextStatus = "DONE";
    prevStatus = "TODO";
  } else if (currentStatus === "DONE") prevStatus = "DOING";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "TODO":
        return "bg-gray-200 text-gray-800";
      case "DOING":
        return "bg-blue-100 text-blue-700";
      case "DONE":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={!loading && !movingTo ? onClose : undefined}
        className="flex-1 bg-black/50 justify-center items-center px-4"
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-md rounded-2xl p-6 shadow-lg"
        >
          {/* Title */}
          <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
            {task.title}
          </Text>

          {/* Description */}
          <Text className="text-gray-600 text-base mb-6 text-center">
            {task.description || "No description provided."}
          </Text>

          {/* Current Status */}
          <View className="items-center mb-5">
            <Text className="text-sm text-gray-500 mb-1">Current Status</Text>
            <View
              className={`px-4 py-1 rounded-full ${getStatusColor(
                currentStatus
              )}`}
            >
              <Text className="font-semibold text-sm uppercase">
                {currentStatus}
              </Text>
            </View>
          </View>

          {/* Move Buttons */}
          {(prevStatus || nextStatus) && (
            <View className="flex-row justify-center mb-4">
              {prevStatus && (
                <Pressable
                  onPress={() => handleStatusChange(prevStatus)}
                  disabled={!!movingTo || loading}
                  className={`px-4 py-3 rounded-xl mr-2 ${
                    movingTo === prevStatus
                      ? "bg-gray-400"
                      : "bg-gray-600 active:bg-gray-700 active:opacity-90"
                  }`}
                >
                  {movingTo === prevStatus ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text className="text-white font-semibold">
                      Move to {prevStatus}
                    </Text>
                  )}
                </Pressable>
              )}

              {nextStatus && (
                <Pressable
                  onPress={() => handleStatusChange(nextStatus)}
                  disabled={!!movingTo || loading}
                  className={`px-4 py-3 rounded-xl ml-2 ${
                    movingTo === nextStatus
                      ? "bg-blue-400"
                      : "bg-blue-600 active:bg-blue-700 active:opacity-90"
                  }`}
                >
                  {movingTo === nextStatus ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text className="text-white font-semibold">
                      Move to {nextStatus}
                    </Text>
                  )}
                </Pressable>
              )}
            </View>
          )}

          {/* Action Buttons */}
          <View className="flex-row justify-between mt-2">
            <Pressable
              onPress={onClose}
              disabled={loading || !!movingTo}
              className="flex-1 mr-2 bg-gray-200 py-3 rounded-xl active:opacity-80"
            >
              <Text className="text-gray-800 text-center font-semibold text-base">
                Close
              </Text>
            </Pressable>

            <Pressable
              onPress={handleDelete}
              disabled={loading || !!movingTo}
              className={`flex-1 ml-2 rounded-xl py-3 flex-row justify-center items-center ${
                loading ? "bg-red-400" : "bg-red-600"
              } active:opacity-80`}
            >
              {loading ? (
                <>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text className="text-white font-semibold ml-2 text-base">
                    Deleting...
                  </Text>
                </>
              ) : (
                <Text className="text-white text-center font-semibold text-base">
                  Delete
                </Text>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
