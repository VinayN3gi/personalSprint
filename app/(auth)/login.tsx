import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { account, ID } from "@/lib/appwrite";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOTP = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const token=await account.createEmailToken({
        userId: ID.unique(),
        email: email,
      });
      router.push({ pathname: "/(auth)/otp", params: { email, userId: token.userId } });
    } catch (err) {
      console.error("Error sending OTP:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      {/* Welcome message */}
      <Text className="text-3xl font-bold text-center mb-2 text-gray-900">
        Welcome Back
      </Text>
      <Text className="text-center text-gray-600 mb-8">
        Log in with your email to access your sprint board. 
        We’ll send you a one-time code to continue.
      </Text>

      {/* Email input */}
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-3 text-gray-900"
        placeholder="Enter your email"
        placeholderTextColor="#9CA3AF"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text className="text-sm text-gray-500 mb-6">
        We’ll send a one-time password (OTP) to this email.
      </Text>

      {/* CTA with loading */}
      <TouchableOpacity
        disabled={!email || loading}
        className={`rounded-lg py-3 mb-4 flex-row items-center justify-center ${
          !loading ? "bg-blue-700" : "bg-blue-400"
        }`}
        onPress={handleSendOTP}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-semibold">Send OTP</Text>
        )}
      </TouchableOpacity>

      {/* Signup redirect */}
      <TouchableOpacity onPress={() => router.push("/(auth)/signin")}>
        <Text className="text-center text-blue-600">
          Don’t have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
}
