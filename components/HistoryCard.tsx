import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface HistoryCardProps {
  item: any;
  onPress: () => void;
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

const HistoryCard = ({ item, onPress }: HistoryCardProps) => {
  return (
    <TouchableOpacity
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-4 active:bg-gray-50"
      onPress={onPress}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold text-gray-900">{item.title}</Text>
        <Text className="text-sm text-gray-500">{formatDate(item.endDate)}</Text>
      </View>

      {/* Stats Row */}
      <View className="flex-row justify-between mt-2">
        <View>
          <Text className="text-sm text-gray-500">Total Tasks</Text>
          <Text className="text-base font-medium text-gray-800">
            {item.totalTask ?? 0}
          </Text>
        </View>
        <View>
          <Text className="text-sm text-gray-500">Completed</Text>
          <Text className="text-base font-medium text-green-600">
            {item.completedTask ?? 0}
          </Text>
        </View>
        <View>
          <Text className="text-sm text-gray-500">Carried Over</Text>
          <Text className="text-base font-medium text-red-500">
            {item.carriedForwardTask ?? 0}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default HistoryCard;
