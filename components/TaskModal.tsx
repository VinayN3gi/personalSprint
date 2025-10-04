import React from "react";
import { View, Text, Modal, Pressable } from "react-native";

interface TaskModalProps {
  visible: boolean;
  task: any | null;
  onClose: () => void;
}

export default function TaskModal({ visible, task, onClose }: TaskModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 justify-center items-center">
        <View className="bg-white rounded-xl w-11/12 p-6">
          <Text className="text-xl font-bold mb-2">{task?.title}</Text>
          <Text className="text-gray-700 mb-6">{task?.desc}</Text>

          <Pressable
            onPress={onClose}
            className="bg-blue-600 rounded-lg py-3"
          >
            <Text className="text-white text-center font-semibold">Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
