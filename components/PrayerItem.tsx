import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Star } from "lucide-react-native";

interface PrayerItemProps {
  id: string;
  name: string;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const PrayerItem = ({
  id = "1",
  name = "Doa Sebelum Makan",
  isFavorite = false,
  onToggleFavorite = () => {},
}: PrayerItemProps) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/prayer/${id}`);
  };

  const handleFavoritePress = () => {
    onToggleFavorite(id);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="flex-row items-center justify-between p-4 mb-2 rounded-lg bg-[#EAEBD0]"
      style={{ height: 70 }}
    >
      <Text className="text-base font-medium text-black flex-1">{name}</Text>
      <TouchableOpacity
        onPress={handleFavoritePress}
        className="ml-2"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Star
          size={24}
          color="#CD5656"
          fill={isFavorite ? "#CD5656" : "transparent"}
          strokeWidth={1.5}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default PrayerItem;
