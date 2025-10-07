import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { account, tables, DB_ID, HISTORY_ID } from "@/lib/appwrite";
import { Query } from "appwrite";

const HistoryPage = () => {
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSprint, setSelectedSprint] = useState<any | null>(null);
  

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const user = await account.get();

        const res = await tables.listRows({
          databaseId: DB_ID,
          tableId: HISTORY_ID,
          queries: [Query.equal("userId", user.$id)],
        });

        // Sort newest first
        const sorted = res.rows.sort(
          (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
        );

        setHistoryList(sorted);
      } catch (err) {
        console.error("Error fetching sprint history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderHistoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-4 active:bg-gray-50"
      onPress={() => setSelectedSprint(item)}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold text-gray-900">{item.title}</Text>
        <Text className="text-sm text-gray-500">{formatDate(item.endDate)}</Text>
      </View>

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

  return (
    <SafeAreaView className="flex-1 bg-gray-100 px-4 pt-4">
      <Text className="text-2xl font-bold text-center mb-4 text-gray-900">
        Sprint History
      </Text>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="text-gray-600 mt-2">Loading history...</Text>
        </View>
      ) : historyList.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600 text-base">
            No sprint history found yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={historyList}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.$id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* Details Modal */}
      <Modal
        visible={!!selectedSprint}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedSprint(null)}
      >
        <Pressable
          className="flex-1 bg-black/40 justify-center items-center px-4"
          onPress={() => setSelectedSprint(null)}
        >
          <Pressable
            className="bg-white w-full rounded-2xl p-6 max-w-md"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="text-xl font-bold text-gray-900 text-center mb-3">
              {selectedSprint?.title}
            </Text>

            <View className="border-t border-gray-200 my-2" />

            <View className="space-y-2 mt-2">
              <Text className="text-sm text-gray-700">
                <Text className="font-semibold">Duration:</Text>{" "}
                {selectedSprint?.duration} days
              </Text>

              <Text className="text-sm text-gray-700">
                <Text className="font-semibold">Start Date:</Text>{" "}
                {formatDate(selectedSprint?.startDate)}
              </Text>

              <Text className="text-sm text-gray-700">
                <Text className="font-semibold">End Date:</Text>{" "}
                {formatDate(selectedSprint?.endDate)}
              </Text>

              <View className="border-t border-gray-200 my-3" />

              <Text className="text-sm text-gray-700">
                <Text className="font-semibold">Total Tasks:</Text>{" "}
                {selectedSprint?.totalTask ?? 0}
              </Text>
              <Text className="text-sm text-gray-700">
                <Text className="font-semibold">Completed Tasks:</Text>{" "}
                <Text className="text-green-600">
                  {selectedSprint?.completedTask ?? 0}
                </Text>
              </Text>
              <Text className="text-sm text-gray-700">
                <Text className="font-semibold">Carried Forward:</Text>{" "}
                <Text className="text-red-500">
                  {selectedSprint?.carriedForwardTask ?? 0}
                </Text>
              </Text>
            </View>

            <TouchableOpacity
              className="mt-6 bg-blue-600 rounded-xl py-3"
              onPress={() => setSelectedSprint(null)}
            >
              <Text className="text-center text-white font-semibold text-base">
                Close
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default HistoryPage;
