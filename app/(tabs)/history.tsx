import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { account, tables, DB_ID, HISTORY_ID } from "@/lib/appwrite";
import { Query } from "appwrite";
import HistoryCard from "@/components/HistoryCard";
import HistoryModal from "@/components/HistoryModal";
import { useRefresh } from "@/hooks/RefreshContext";

const HistoryPage = () => {
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSprint, setSelectedSprint] = useState<any | null>(null);
  const { refreshToken } = useRefresh();

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
  }, [refreshToken]);

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
          renderItem={({ item }) => (
            <HistoryCard item={item} onPress={() => setSelectedSprint(item)} />
          )}
          keyExtractor={(item) => item.$id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
      
      <HistoryModal
        visible={!!selectedSprint}
        sprint={selectedSprint}
        onClose={() => setSelectedSprint(null)}
      />
    </SafeAreaView>
  );
};

export default HistoryPage;
