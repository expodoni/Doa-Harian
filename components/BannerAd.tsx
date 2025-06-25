import React, { useState, useEffect } from 'react';
import { View, Platform } from 'react-native';

interface BannerAdComponentProps {
  size?: any;
  style?: any;
}

const BannerAdComponent: React.FC<BannerAdComponentProps> = ({
  size,
  style
}) => {
  const [AdMobComponents, setAdMobComponents] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadAdMobComponents = async () => {
      try {
        if (Platform.OS === 'android' || Platform.OS === 'ios') {
          const { BannerAd, BannerAdSize, TestIds } = await import('react-native-google-mobile-ads');
          setAdMobComponents({ BannerAd, BannerAdSize, TestIds });
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load AdMob components:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    loadAdMobComponents();
  }, []);

  // Don't render anything if loading, has error, or not on mobile
  if (isLoading || hasError || Platform.OS === 'web') {
    return null;
  }

  if (!AdMobComponents) {
    return null;
  }

  const { BannerAd, BannerAdSize, TestIds } = AdMobComponents;

  // Menggunakan Test ID untuk demo - sesuai kebijakan AdMob
  const adUnitId = Platform.select({
    ios: TestIds.BANNER,
    android: TestIds.BANNER,
    default: TestIds.BANNER,
  });

  const bannerSize = size || BannerAdSize.BANNER;

  return (
    <View style={[{ alignItems: 'center', marginVertical: 10 }, style]}>
      <BannerAd
        unitId={adUnitId}
        size={bannerSize}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          console.log('Banner ad loaded successfully');
        }}
        onAdFailedToLoad={(error) => {
          console.error('Banner ad failed to load:', error);
        }}
      />
    </View>
  );
};

export default BannerAdComponent;
