import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react-native";
import RewardedAd from "../../components/RewardedAd";

const BASEROW_TOKEN = "E9JWNrxQYtMdmAYbpTgyanV6sYdDzzfO";
const TABLE_ID = "581962";

type Prayer = {
  id: number;
  "Nama Doa": string;
  "Lafadz Doa": string;
};

export default function PrayerDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasEarnedReward, setHasEarnedReward] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    fetchPrayers();
  }, []);

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
      setPrayers(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Find the current prayer based on id
  const currentPrayerIndex = prayers.findIndex(
    (prayer) => prayer.id.toString() === id,
  );
  const currentPrayer = prayers[currentPrayerIndex];

  // Calculate previous and next prayer ids
  const prevPrayerId =
    currentPrayerIndex > 0
      ? prayers[currentPrayerIndex - 1].id.toString()
      : prayers.length > 0
        ? prayers[prayers.length - 1].id.toString()
        : null;

  const nextPrayerId =
    currentPrayerIndex < prayers.length - 1
      ? prayers[currentPrayerIndex + 1].id.toString()
      : prayers.length > 0
        ? prayers[0].id.toString()
        : null;

  const navigateToPrayer = (prayerId: string | null) => {
    if (prayerId) {
      router.push(`/prayer/${prayerId}`);
    }
  };

  const navigateToList = () => {
    router.push("/");
  };

  const handleRewardEarned = () => {
    setHasEarnedReward(true);
    setShowTranslation(true);
    Alert.alert(
      "Reward Diterima!",
      "Anda telah mendapatkan akses ke terjemahan doa. Terima kasih telah menonton iklan!",
      [{ text: "OK" }]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#EAEBD0" />
        <Text style={styles.loadingText}>Memuat doa...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity onPress={fetchPrayers} style={styles.retryButton}>
          <Text style={styles.retryText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentPrayer) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Doa tidak ditemukan</Text>
        <TouchableOpacity onPress={navigateToList} style={styles.retryButton}>
          <Text style={styles.retryText}>Kembali ke Daftar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigateToList} style={styles.backButton}>
          <ArrowLeft size={24} color="#EAEBD0" />
          <Text style={styles.backText}>Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{currentPrayer["Nama Doa"]}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.prayerCard}>
          <Text style={styles.arabicText}>{currentPrayer["Lafadz Doa"]}</Text>

          {/* Rewarded Ad Section */}
          {!hasEarnedReward && (
            <View style={styles.rewardSection}>
              <Text style={styles.rewardText}>
                Tonton iklan untuk mendapatkan terjemahan doa
              </Text>
              <RewardedAd
                onRewardEarned={handleRewardEarned}
                buttonText="Dapatkan Terjemahan"
              />
            </View>
          )}

          {/* Translation (shown after reward) */}
          {showTranslation && hasEarnedReward && (
            <View style={styles.translationSection}>
              <Text style={styles.translationTitle}>Terjemahan:</Text>
              <Text style={styles.translationText}>
                "Ya Allah, berikanlah kami petunjuk dan kemudahan dalam menjalani hari ini.
                Lindungilah kami dari segala keburukan dan berikanlah keberkahan dalam setiap langkah kami."
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.navigationBar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateToPrayer(prevPrayerId)}
        >
          <ChevronLeft size={24} color="#EAEBD0" />
          <Text style={styles.navButtonText}>Sebelumnya</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateToPrayer(nextPrayerId)}
        >
          <Text style={styles.navButtonText}>Selanjutnya</Text>
          <ChevronRight size={24} color="#EAEBD0" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DA6C6C",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#CD5656",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backText: {
    color: "#EAEBD0",
    fontSize: 16,
    marginLeft: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#EAEBD0",
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  prayerCard: {
    backgroundColor: "#EAEBD0",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  arabicText: {
    fontSize: 28,
    lineHeight: 50,
    textAlign: "right",
    color: "#000000",
    marginBottom: 20,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#EAEBD0",
    fontSize: 16,
    marginTop: 10,
  },
  errorText: {
    color: "#EAEBD0",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#EAEBD0",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#CD5656",
    fontSize: 16,
    fontWeight: "500",
  },
  navigationBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#CD5656",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#DA6C6C",
    borderRadius: 8,
  },
  navButtonText: {
    color: "#EAEBD0",
    fontSize: 16,
    fontWeight: "500",
  },
  rewardSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    alignItems: "center",
  },
  rewardText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 12,
  },
  translationSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#e8f5e8",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  translationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 8,
  },
  translationText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    textAlign: "justify",
  },
});
