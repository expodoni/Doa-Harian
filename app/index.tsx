import React from "react";
import { View, Text, SafeAreaView, StatusBar } from "react-native";
import PrayerList from "../components/PrayerList";

export default function DashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#EAEBD0]">
      <StatusBar barStyle="dark-content" backgroundColor="#EAEBD0" />
      <View className="flex-1 pt-4">
        {/* Header */}
        <View className="mb-4 px-4">
          <Text className="text-3xl font-bold text-black text-center">
            Doa Harian
          </Text>
        </View>

        {/* Prayer List */}
        <PrayerList />
      </View>
    </SafeAreaView>
  );
}
