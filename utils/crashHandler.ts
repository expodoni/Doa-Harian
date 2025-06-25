import { Platform } from 'react-native';

// Global error handler untuk menangkap crash
export const setupGlobalErrorHandler = () => {
  // Handle JavaScript errors
  const originalHandler = ErrorUtils.getGlobalHandler();
  
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.error('Global Error Handler:', error);
    
    // Log error details
    if (__DEV__) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        isFatal,
        platform: Platform.OS,
      });
    }
    
    // Call original handler
    if (originalHandler) {
      originalHandler(error, isFatal);
    }
  });

  // Handle unhandled promise rejections
  const originalRejectionHandler = require('react-native/Libraries/Core/ExceptionsManager').unstable_setGlobalHandler;
  
  if (originalRejectionHandler) {
    originalRejectionHandler((error: any, isFatal: boolean) => {
      console.error('Unhandled Promise Rejection:', error);
      
      if (__DEV__) {
        console.error('Rejection details:', {
          error,
          isFatal,
          platform: Platform.OS,
        });
      }
    });
  }
};

// Safe AdMob initialization
export const safeAdMobInit = async () => {
  try {
    if (Platform.OS === 'web') {
      console.log('AdMob not supported on web platform');
      return false;
    }

    const mobileAds = require('react-native-google-mobile-ads').default;
    await mobileAds().initialize();
    console.log('AdMob initialized successfully');
    return true;
  } catch (error) {
    console.error('AdMob initialization failed:', error);
    return false;
  }
};

// Check if AdMob is available
export const isAdMobAvailable = () => {
  try {
    if (Platform.OS === 'web') {
      return false;
    }
    
    require('react-native-google-mobile-ads');
    return true;
  } catch (error) {
    console.error('AdMob not available:', error);
    return false;
  }
};
