import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const SprintLoadingState = () => {
  return (
   <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="mt-3 text-gray-600">Loading your sprint...</Text>
    </SafeAreaView>
  )
}

export default SprintLoadingState