import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { account } from "@/lib/appwrite";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function OtpScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState("");
  const router = useRouter();
    
    const handleVerify = async () => {
    try {
        await account.createSession({
        userId: email!,    // email from params
        secret: otp,       // OTP code entered
        });
        router.replace("/(tabs)");
    } catch (err) {
        console.error("Invalid OTP:", err);
    }
    };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-2xl font-bold text-center mb-2">Verify OTP</Text>
      <Text className="text-gray-600 text-center mb-6">We sent a code to {email}</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-center tracking-widest text-xl"
        placeholder="123456"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
      />
      <TouchableOpacity
        className="bg-green-600 rounded-lg py-3"
        onPress={handleVerify}
      >
        <Text className="text-white text-center font-semibold">Verify</Text>
      </TouchableOpacity>
    </View>
  );
}
