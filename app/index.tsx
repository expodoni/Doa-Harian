import React from "react";
import { View, Text, SafeAreaView, StatusBar } from "react-native";
import PrayerList from "../components/PrayerList";
import BannerAd from "../components/BannerAd";

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
        <View className="flex-1">
          <PrayerList />
        </View>

        {/* Banner Ad at bottom */}
        <View className="bg-white">
          <BannerAd />
        </View>
      </View>
    </SafeAreaView>
  );
}
