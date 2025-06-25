import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, Alert, Platform } from 'react-native';
import { Gift } from 'lucide-react-native';

interface RewardedAdComponentProps {
  onRewardEarned?: () => void;
  buttonText?: string;
  style?: any;
  disabled?: boolean;
}

const RewardedAdComponent: React.FC<RewardedAdComponentProps> = ({
  onRewardEarned,
  buttonText = "Tonton Iklan untuk Reward",
  style,
  disabled = false
}) => {
  const [rewardedAd, setRewardedAd] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [AdMobComponents, setAdMobComponents] = useState<any>(null);
  const [adMobAvailable, setAdMobAvailable] = useState(false);

  // Menggunakan Test ID yang diberikan untuk demo
  const adUnitId = 'ca-app-pub-3940256099942544/5224354917';

  useEffect(() => {
    const loadAdMobComponents = async () => {
      try {
        if (Platform.OS === 'android' || Platform.OS === 'ios') {
          const { RewardedAd, RewardedAdEventType, TestIds } = await import('react-native-google-mobile-ads');
          setAdMobComponents({ RewardedAd, RewardedAdEventType, TestIds });
          setAdMobAvailable(true);
        }
      } catch (error) {
        console.error('Failed to load AdMob components:', error);
        setAdMobAvailable(false);
      }
    };

    loadAdMobComponents();
  }, []);

  useEffect(() => {
    if (adMobAvailable && AdMobComponents) {
      loadRewardedAd();
    }
    return () => {
      if (rewardedAd) {
        try {
          rewardedAd.removeAllListeners();
        } catch (error) {
          console.error('Error removing ad listeners:', error);
        }
      }
    };
  }, [adMobAvailable, AdMobComponents]);

  const loadRewardedAd = () => {
    if (!AdMobComponents || !adMobAvailable) {
      return;
    }

    try {
      setIsLoading(true);
      const { RewardedAd, RewardedAdEventType } = AdMobComponents;

      const rewarded = RewardedAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
      });

      const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
        console.log('Rewarded ad loaded successfully');
        setIsLoaded(true);
        setIsLoading(false);
      });

      const unsubscribeEarned = rewarded.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        (reward: any) => {
          console.log('User earned reward:', reward);
          if (onRewardEarned) {
            onRewardEarned();
          }
          // Reload ad for next use
          setTimeout(() => {
            loadRewardedAd();
          }, 1000);
        }
      );

      const unsubscribeClosed = rewarded.addAdEventListener(RewardedAdEventType.CLOSED, () => {
        console.log('Rewarded ad closed');
        // Reload ad for next use
        setTimeout(() => {
          loadRewardedAd();
        }, 1000);
      });

      const unsubscribeError = rewarded.addAdEventListener(RewardedAdEventType.ERROR, (error: any) => {
        console.error('Rewarded ad error:', error);
        setIsLoading(false);
        Alert.alert('Error', 'Gagal memuat iklan. Silakan coba lagi.');
        // Retry loading after error
        setTimeout(() => {
          loadRewardedAd();
        }, 3000);
      });

      setRewardedAd(rewarded);
      rewarded.load();
    } catch (error) {
      console.error('Error creating rewarded ad:', error);
      setIsLoading(false);
    }
  };

  const showRewardedAd = () => {
    if (!adMobAvailable) {
      Alert.alert('Info', 'Iklan tidak tersedia di platform ini.');
      return;
    }

    if (rewardedAd && isLoaded) {
      try {
        setIsLoaded(false);
        rewardedAd.show();
      } catch (error) {
        console.error('Error showing rewarded ad:', error);
        Alert.alert('Error', 'Gagal menampilkan iklan.');
      }
    } else {
      Alert.alert('Info', 'Iklan sedang dimuat. Silakan tunggu sebentar.');
      if (!isLoading && adMobAvailable) {
        loadRewardedAd();
      }
    }
  };

  // Don't render on web or if AdMob is not available
  if (Platform.OS === 'web' || !adMobAvailable) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: isLoaded && !disabled && adMobAvailable ? '#CD5656' : '#999',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: 10,
        },
        style
      ]}
      onPress={showRewardedAd}
      disabled={!isLoaded || disabled || isLoading || !adMobAvailable}
    >
      <Gift size={20} color="#EAEBD0" style={{ marginRight: 8 }} />
      <Text style={{ color: '#EAEBD0', fontSize: 16, fontWeight: '500' }}>
        {isLoading ? 'Memuat...' : buttonText}
      </Text>
    </TouchableOpacity>
  );
};

export default RewardedAdComponent;
