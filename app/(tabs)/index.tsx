import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateSprintScreen() {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState<number>(7);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const options = [7, 14];

  const handleCreateSprint = () => {
    console.log("Sprint Created:", { title, duration });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-6">
      {/* Header */}
      <View className="mt-10 mb-6">
        <Text className="text-3xl font-bold text-center text-gray-900">
          Create New Sprint
        </Text>
        <Text className="text-gray-500 text-center mt-2">
          Organize your tasks into a focused sprint
        </Text>
      </View>

      {/* Card Container */}
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

        {/* Action Button */}
        <TouchableOpacity
          className="bg-blue-600 rounded-lg py-4 shadow-md"
          onPress={handleCreateSprint}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Start Sprint
          </Text>
        </TouchableOpacity>
      </View>

      {/* Dropdown Modal */}
      <Modal
        transparent={true}
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
    </SafeAreaView>
  );
}
