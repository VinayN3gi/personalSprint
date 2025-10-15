import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface EmptyStateProps {
  title: string;
  message: string;
  buttonText?: string;
  onPress?: () => void;
}

export default function EmptyState({
  title,
  message,
  buttonText = "Retry",
  onPress,
}: EmptyStateProps) {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50 px-6">

      {/* Title */}
      <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
        {title}
      </Text>

      {/* Message */}
      <Text className="text-gray-500 text-center mb-6 leading-relaxed text-base max-w-sm">
        {message}
      </Text>

      {/* Action Button */}
      <TouchableOpacity
        className="bg-blue-600 px-6 py-3 rounded-lg shadow-sm active:bg-blue-700"
        onPress={onPress}
      >
        <Text className="text-white text-center font-semibold text-base">
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
