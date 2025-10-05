import React, { useState } from "react";
import { View, Text, Modal, Pressable, ActivityIndicator } from "react-native";
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
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!task) return;
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Overlay (tap outside to close) */}
      <Pressable
        onPress={!loading ? onClose : undefined}
        className="flex-1 bg-black/50 justify-center items-center"
      >
        {/* Modal Content */}
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-white w-11/12 rounded-2xl p-6 shadow-lg"
        >
          {/* Task Title */}
          <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
            {task?.title}
          </Text>

          {/* Task Description */}
          <Text className="text-gray-600 text-base mb-6 text-center">
            {task?.description || "No description provided."}
          </Text>

          {/* Buttons Row */}
          <View className="flex-row justify-between mt-2">
            <Pressable
              onPress={onClose}
              disabled={loading}
              className="flex-1 mr-2 bg-gray-200 py-3 rounded-xl active:opacity-80"
            >
              <Text className="text-gray-800 text-center font-semibold text-base">
                Close
              </Text>
            </Pressable>

            <Pressable
              onPress={handleDelete}
              disabled={loading}
              className={`flex-1 ml-2 rounded-xl py-3 flex-row justify-center items-center ${
                loading ? "bg-red-400" : "bg-red-600"
              } active:opacity-80`}
            >
              {loading ? (
                <>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text className="text-white font-semibold ml-2 text-base">
                    Deleting
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
