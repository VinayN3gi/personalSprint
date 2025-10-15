import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { account } from "@/lib/appwrite";

export default function OtpScreen() {
  const { email, userId } = useLocalSearchParams<{ email: string; userId: string }>();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async () => {
    if (!otp) return;
    setLoading(true);
    try {
      await account.createSession({
        userId: userId!, 
        secret: otp,
      });
      router.replace("/(tabs)");
    } catch (err) {
      console.error("Invalid OTP:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold text-center mb-2 text-gray-900">
        Verify Code
      </Text>
      <Text className="text-gray-600 text-center mb-8">
        Enter the one-time code we sent to {email}
      </Text>

      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-6 text-center tracking-widest text-2xl text-gray-900"
        placeholder="123456"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={6}
      />

      <TouchableOpacity
        disabled={!otp || loading}
        className={`rounded-lg py-3 mb-4 flex-row items-center justify-center ${
          !otp || loading ? "bg-blue-300" : "bg-blue-600"
        }`}
        onPress={handleVerify}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-semibold">Verify</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
