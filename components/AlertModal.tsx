import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";


// ✅ Reusable Custom Alert Modal
export function AlertModal({
  visible,
  title,
  message,
  onClose,
}: {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        className="flex-1 bg-black/40 justify-center items-center px-6"
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl w-full max-w-md p-6 shadow-lg"
        >
          <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
            {title}
          </Text>
          <Text className="text-gray-600 text-base mb-5 text-center">
            {message}
          </Text>

          <TouchableOpacity
            onPress={onClose}
            className="bg-blue-600 py-3 rounded-lg active:opacity-90"
          >
            <Text className="text-white text-center font-semibold text-base">
              OK
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

