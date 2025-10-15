import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { account, tables, DB_ID, HISTORY_ID } from "@/lib/appwrite";
import { Query } from "appwrite";

const SettingsPage = () => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [stats, setStats] = useState({
    totalSprints: 0,
    totalTasks: 0,
    completedTasks: 0,
    averageCompletion: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch productivity stats from HISTORY table
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userAcc = await account.get();
        const res = await tables.listRows({
          databaseId: DB_ID,
          tableId: HISTORY_ID,
          queries: [Query.equal("userId", userAcc.$id)],
        });

        const rows = res.rows;
        const totalSprints = rows.length;
        const totalTasks = rows.reduce((sum, s) => sum + (s.totalTask || 0), 0);
        const completedTasks = rows.reduce(
          (sum, s) => sum + (s.completedTask || 0),
          0
        );

        const averageCompletion =
          totalSprints > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        setStats({ totalSprints, totalTasks, completedTasks, averageCompletion });
      } catch (err) {
        console.error("Error fetching productivity stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await logout();
      router.replace("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-3 text-gray-600">Loading account...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="px-5 mt-6">
          <Text className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Settings
          </Text>

          {/* User Info Card */}
          <View className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-100 w-14 h-14 rounded-full justify-center items-center">
                <Text className="text-blue-700 text-xl font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </Text>
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-lg font-semibold text-gray-900">
                  {user?.name || "Unnamed User"}
                </Text>
                <Text className="text-gray-600 text-sm">
                  {user?.email || "No email linked"}
                </Text>
              </View>
            </View>
          </View>

          {/* Productivity Summary */}
          <View className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 mt-5">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Productivity Summary
            </Text>

            {statsLoading ? (
              <View className="py-4 items-center">
                <ActivityIndicator color="#2563eb" />
                <Text className="text-gray-600 mt-2 text-sm">
                  Loading stats...
                </Text>
              </View>
            ) : (
              <View className="space-y-4">
                <View className="flex-row justify-between">
                  <Text className="text-gray-700 font-medium">
                    Total Sprints Completed
                  </Text>
                  <Text className="text-gray-900 font-semibold">
                    {stats.totalSprints}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-gray-700 font-medium">
                    Total Tasks Created
                  </Text>
                  <Text className="text-gray-900 font-semibold">
                    {stats.totalTasks}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-gray-700 font-medium">
                    Completed Tasks
                  </Text>
                  <Text className="text-green-600 font-semibold">
                    {stats.completedTasks}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-gray-700 font-medium">
                    Avg. Completion Rate
                  </Text>
                  <Text className="text-blue-600 font-semibold">
                    {stats.averageCompletion}%
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Spacer */}
        <View className="flex-1" />

        {/* Logout Button */}
        <View className="px-5 mb-8 mt-8">
          <TouchableOpacity
            onPress={handleLogout}
            disabled={logoutLoading}
            className={`py-4 rounded-xl flex-row justify-center items-center shadow-md ${
              logoutLoading ? "bg-red-400" : "bg-red-600 active:bg-red-700"
            }`}
          >
            {logoutLoading ? (
              <>
                <ActivityIndicator color="#fff" />
                <Text className="text-white font-semibold text-base ml-2">
                  Logging out...
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="log-out-outline" size={20} color="white" />
                <Text className="text-white font-semibold text-base ml-2">
                  Logout
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsPage;
