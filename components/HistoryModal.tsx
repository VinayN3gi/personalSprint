import React from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
} from "react-native";

interface HistoryModalProps {
  visible: boolean;
  sprint: any | null;
  onClose: () => void;
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const HistoryModal = ({ visible, sprint, onClose }: HistoryModalProps) => {
  if (!sprint) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/40 justify-center items-center px-4"
        onPress={onClose}
      >
        <Pressable
          className="bg-white w-full rounded-2xl p-6 max-w-md"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-xl font-bold text-gray-900 text-center mb-3">
            {sprint?.title}
          </Text>

          <View className="border-t border-gray-200 my-2" />

          <View className="space-y-2 mt-2">
            <Text className="text-sm text-gray-700">
              <Text className="font-semibold">Duration:</Text>{" "}
              {sprint?.duration} days
            </Text>
            <Text className="text-sm text-gray-700">
              <Text className="font-semibold">Start Date:</Text>{" "}
              {formatDate(sprint?.startDate)}
            </Text>
            <Text className="text-sm text-gray-700">
              <Text className="font-semibold">End Date:</Text>{" "}
              {formatDate(sprint?.endDate)}
            </Text>

            <View className="border-t border-gray-200 my-3" />

            <Text className="text-sm text-gray-700">
              <Text className="font-semibold">Total Tasks:</Text>{" "}
              {sprint?.totalTask ?? 0}
            </Text>
            <Text className="text-sm text-gray-700">
              <Text className="font-semibold">Completed Tasks:</Text>{" "}
              <Text className="text-green-600">
                {sprint?.completedTask ?? 0}
              </Text>
            </Text>
            <Text className="text-sm text-gray-700">
              <Text className="font-semibold">Carried Forward:</Text>{" "}
              <Text className="text-red-500">
                {sprint?.carriedForwardTask ?? 0}
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            className="mt-6 bg-blue-600 rounded-xl py-3"
            onPress={onClose}
          >
            <Text className="text-center text-white font-semibold text-base">
              Close
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default HistoryModal;
