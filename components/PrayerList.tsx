import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import PrayerItem from "./PrayerItem";
import { router } from "expo-router";
import { Search, Bookmark } from "lucide-react-native";

const BASEROW_TOKEN = "E9JWNrxQYtMdmAYbpTgyanV6sYdDzzfO";
const TABLE_ID = "581962";

type Prayer = {
  id: number;
  "Nama Doa": string;
  "Lafadz Doa": string;
  isFavorite?: boolean;
};

type PrayerListProps = {
  prayers?: Prayer[];
};

const PrayerList = ({ prayers }: PrayerListProps) => {
  const [prayersList, setPrayersList] = useState<Prayer[]>([]);
  const [filteredPrayers, setFilteredPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    if (prayers) {
      setPrayersList(prayers);
      setFilteredPrayers(prayers);
      setLoading(false);
    } else {
      fetchPrayers();
    }
  }, [prayers]);

  const fetchPrayers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.baserow.io/api/database/rows/table/${TABLE_ID}/?user_field_names=true`,
        {
          headers: {
            Authorization: `Token ${BASEROW_TOKEN}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch prayers");
      }

      const data = await response.json();
      const prayersWithFavorites = (data.results || []).map(
        (prayer: Prayer) => ({
          ...prayer,
          isFavorite: false,
        }),
      );
      setPrayersList(prayersWithFavorites);
      setFilteredPrayers(prayersWithFavorites);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id: string) => {
    const updatedPrayers = prayersList.map((prayer) =>
      prayer.id.toString() === id
        ? { ...prayer, isFavorite: !prayer.isFavorite }
        : prayer,
    );
    setPrayersList(updatedPrayers);
    filterPrayers(updatedPrayers, searchQuery, showFavoritesOnly);
  };

  const filterPrayers = (
    prayers: Prayer[],
    query: string,
    favoritesOnly: boolean,
  ) => {
    let filtered = prayers;

    if (query.trim()) {
      filtered = filtered.filter((prayer) =>
        prayer["Nama Doa"].toLowerCase().includes(query.toLowerCase()),
      );
    }

    if (favoritesOnly) {
      filtered = filtered.filter((prayer) => prayer.isFavorite);
    }

    setFilteredPrayers(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterPrayers(prayersList, query, showFavoritesOnly);
  };

  const toggleFavoritesFilter = () => {
    const newShowFavoritesOnly = !showFavoritesOnly;
    setShowFavoritesOnly(newShowFavoritesOnly);
    filterPrayers(prayersList, searchQuery, newShowFavoritesOnly);
  };

  const handlePrayerPress = (id: string) => {
    router.push(`/prayer/${id}`);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#EAEBD0] justify-center items-center">
        <ActivityIndicator size="large" color="#CD5656" />
        <Text className="text-lg text-black mt-4">Memuat daftar doa...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-[#EAEBD0] justify-center items-center px-4">
        <Text className="text-lg text-red-600 text-center mb-4">
          Error: {error}
        </Text>
        <Text
          className="text-[#CD5656] font-medium text-base"
          onPress={fetchPrayers}
        >
          Coba Lagi
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#EAEBD0] w-full">
      {/* Search Bar */}
      <View className="px-4 mb-4">
        <View className="flex-row items-center bg-white rounded-lg px-3 py-2 shadow-sm">
          <Search size={20} color="#666" />
          <TextInput
            className="flex-1 ml-2 text-base text-black"
            placeholder="Cari doa..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {/* Favorites Filter */}
      <View className="px-4 mb-4">
        <TouchableOpacity
          onPress={toggleFavoritesFilter}
          className={`flex-row items-center justify-center py-3 px-4 rounded-lg border-2 ${
            showFavoritesOnly
              ? "bg-[#CD5656] border-[#CD5656]"
              : "bg-white border-[#CD5656]"
          }`}
        >
          <Bookmark
            size={20}
            color={showFavoritesOnly ? "#EAEBD0" : "#CD5656"}
            fill={showFavoritesOnly ? "#EAEBD0" : "transparent"}
          />
          <Text
            className={`ml-2 font-medium ${
              showFavoritesOnly ? "text-[#EAEBD0]" : "text-[#CD5656]"
            }`}
          >
            {showFavoritesOnly ? "Semua Doa" : "Favorit"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Prayer List */}
      {filteredPrayers.length > 0 ? (
        <FlatList
          data={filteredPrayers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PrayerItem
              id={item.id.toString()}
              name={item["Nama Doa"]}
              isFavorite={item.isFavorite || false}
              onToggleFavorite={() => toggleFavorite(item.id.toString())}
            />
          )}
          contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-gray-600">
            {showFavoritesOnly
              ? "Belum ada doa favorit"
              : searchQuery
                ? "Tidak ada doa yang cocok"
                : "Tidak ada doa ditemukan"}
          </Text>
        </View>
      )}
    </View>
  );
};

export default PrayerList;
