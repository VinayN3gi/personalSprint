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
import { SafeAreaView } from "react-native-safe-area-context";
import { account, ID, DB_ID, SPRINTS_ID, TASKS_ID, tables } from "@/lib/appwrite";
import { useRouter } from "expo-router";
import { Query } from "appwrite";
import { AlertModal } from "@/components/AlertModal";
import { useRefresh } from "@/hooks/RefreshContext";

export default function CreateSprintScreen() {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState<number>(7);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    visible: false,
    title: "",
    message: "",
  });
  const { triggerRefresh } = useRefresh();

  const router = useRouter();
  const options = [7, 14];

  const showAlert = (title: string, message: string) => {
    setAlert({ visible: true, title, message });
  };

  const handleCreateSprint = async () => {
    if (!title.trim()) {
      showAlert("Missing Info", "Please enter a sprint title.");
      return;
    }

    setLoading(true);

    try {
      const user = await account.get();

      // 🟡 Step 1: Check if there's already an active sprint
      const existing = await tables.listRows({
        databaseId: DB_ID,
        tableId: SPRINTS_ID,
        queries: [Query.equal("userId", user.$id), Query.equal("status", "ACTIVE")],
      });

      if (existing.rows.length > 0) {
        setLoading(false);
        showAlert(
          "Active Sprint Exists",
          "You already have an active sprint. Please complete or close it before starting a new one."
        );
        setTitle("");
        return;
      }

      // 🟡 Step 2: Create new sprint
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + duration);

      const newSprintId = ID.unique(); // ✅ generate unique ID for the new sprint

      await tables.createRow({
        databaseId: DB_ID,
        tableId: SPRINTS_ID,
        rowId: newSprintId,
        data: {
          userId: user.$id,
          title,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          duration,
          status: "ACTIVE",
        },
      });

      // 🟢 Step 3: Fetch user's old tasks that are not DONE
      const taskRes = await tables.listRows({
        databaseId: DB_ID,
        tableId: TASKS_ID,
        queries: [Query.equal("userId", user.$id)],
      });

      const allTasks = taskRes.rows || [];
      const carryOverTasks = allTasks.filter((t) => t.status !== "DONE");

      // 🟢 Step 4: Update each carried-over task to belong to new sprint
      if (carryOverTasks.length > 0) {
        await Promise.all(
          carryOverTasks.map((task) =>
            tables.updateRow({
              databaseId: DB_ID,
              tableId: TASKS_ID,
              rowId: task.$id,
              data: { sprintId: newSprintId },
            })
          )
        );
      }

      // 🟢 Step 5: Finish up
      setLoading(false);
      triggerRefresh();
      setTimeout(() => router.replace("/(tabs)/sprint"));
    } catch (err: any) {
      console.error("Error creating sprint:", err);
      let message = "Something went wrong. Please try again.";

      if (err.message?.includes("network"))
        message = "Network error. Please check your internet connection.";
      else if (err.message?.includes("Unauthorized"))
        message = "Session expired. Please log in again.";
      else if (err.message) message = err.message;

      showAlert("Error", message);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-6">
      <View className="mt-10 mb-6">
        <Text className="text-3xl font-bold text-center text-gray-900">
          Create New Sprint
        </Text>
        <Text className="text-gray-500 text-center mt-2">
          Organize your tasks into a focused sprint
        </Text>
      </View>

      <View className="bg-white rounded-2xl shadow-md p-6">
        {/* Sprint Title */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-800 mb-2">
            Sprint Title
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-gray-50"
            placeholder="e.g. React Native MVP"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Sprint Duration */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-800 mb-2">
            Sprint Duration
          </Text>
          <TouchableOpacity
            className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 flex-row justify-between items-center"
            onPress={() => setDropdownVisible(true)}
          >
            <Text className="text-base text-gray-700">{duration} Days</Text>
            <Text className="text-gray-400">▼</Text>
          </TouchableOpacity>
        </View>

        {/* Create Button */}
        <TouchableOpacity
          disabled={loading}
          className={`rounded-lg py-4 mt-6 ${
            loading ? "bg-blue-400" : "bg-blue-600"
          } shadow-md`}
          onPress={handleCreateSprint}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center text-lg font-semibold">
              Start Sprint
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Duration Picker Modal */}
      <Modal
        transparent
        visible={dropdownVisible}
        animationType="slide"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/30 justify-end"
          onPress={() => setDropdownVisible(false)}
        >
          <View className="bg-white rounded-t-2xl p-6">
            <Text className="text-lg font-bold mb-4 text-gray-800">
              Select Duration
            </Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="p-4 mb-2 rounded-lg bg-gray-100 active:bg-gray-200"
                  onPress={() => {
                    setDuration(item);
                    setDropdownVisible(false);
                  }}
                >
                  <Text className="text-base text-gray-800">{item} Days</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>

      {/* Alert */}
      <AlertModal
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert({ ...alert, visible: false })}
      />
    </SafeAreaView>
  );
}
