import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { account, ID } from "@/lib/appwrite";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSendOTP = async () => {
    try {
      await account.createEmailToken({
      userId: ID.unique(),
      email: email,
    });
      router.push({ pathname: "./(auth)/otp", params: { email } });
    } catch (err) {
      console.error("Error sending OTP:", err);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-2xl font-bold text-center mb-6">🏁 Personal Sprint</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TouchableOpacity
        className="bg-blue-600 rounded-lg py-3 mb-3"
        onPress={handleSendOTP}
      >
        <Text className="text-white text-center font-semibold">Send OTP</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(auth)/signin")}>
        <Text className="text-center text-blue-600">Don’t have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}
