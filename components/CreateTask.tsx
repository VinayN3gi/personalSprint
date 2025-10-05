import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { tables, DB_ID, TASKS_ID, ID } from "@/lib/appwrite";
import { useAuth } from "@/hooks/useAuth";

interface CreateTaskModalProps {
  visible: boolean;
  sprintId: string;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateTaskModal({
  visible,
  sprintId,
  onClose,
  onCreated,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const {user}=useAuth()


  const handleCreateTask = async () => {
    if (!title.trim() || !desc.trim()) {
      Alert.alert("Missing Info", "Please enter a task title.");
      return;
    }


    try {
      setLoading(true);
      await tables.createRow({
        databaseId: DB_ID,
        tableId: TASKS_ID,
        rowId: ID.unique(),
        data: {
          sprintId: sprintId,
          title,
          status: "TODO", 
          userId:user?.$id,
          description:desc,
        },
      });

      setLoading(false);
      setTitle("");
      setDesc("");
      onCreated();
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
      Alert.alert("Error", "Failed to create task. Please try again.");
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-center items-center bg-black/40"
      >
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className="bg-white w-11/12 rounded-2xl p-6 shadow-lg">
          <Text className="text-xl font-bold text-gray-900 text-center mb-4">
            Create Task
          </Text>

          {/* Task Title */}
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-3 text-base"
            placeholder="Task title"
            value={title}
            onChangeText={setTitle}
          />

          {/* Task Description */}
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-5 text-base"
            placeholder="Task description (optional)"
            value={desc}
            onChangeText={setDesc}
            multiline
          />

          {/* Buttons */}
          <View className="flex-row justify-between">
            <TouchableOpacity
              className="flex-1 bg-gray-200 rounded-lg py-3 mr-2"
              onPress={onClose}
              disabled={loading}
            >
              <Text className="text-gray-800 text-center font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 rounded-lg py-3 ml-2 ${
                loading ? "bg-blue-400" : "bg-blue-600"
              }`}
              onPress={handleCreateTask}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-center font-semibold">
                  Create
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
