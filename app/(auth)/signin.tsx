import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { account, ID } from "@/lib/appwrite";
import { useRouter } from "expo-router";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    try {
        await account.createEmailToken({
        userId: ID.unique(),
        email: email,
      });
      router.push({ pathname: "/(auth)/otp", params: { email } });
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-2xl font-bold text-center mb-6">Create Account</Text>
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
        onPress={handleSignup}
      >
        <Text className="text-white text-center font-semibold">Send OTP</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
        <Text className="text-center text-blue-600">Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}
