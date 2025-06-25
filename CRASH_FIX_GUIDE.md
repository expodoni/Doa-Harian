# 🚨 Panduan Perbaikan Crash Aplikasi

## Masalah yang Ditemukan
Aplikasi crash setelah rilis di Google Play Console, kemungkinan disebabkan oleh:

1. **AdMob Configuration Issues** - Test App IDs di production
2. **Missing Error Handling** - AdMob initialization tanpa proper error handling
3. **Platform Compatibility** - AdMob tidak tersedia di semua platform
4. **Race Conditions** - Inisialisasi AdMob bersamaan dengan splash screen

## ✅ Perbaikan yang Telah Dilakukan

### 1. Konfigurasi AdMob yang Aman
- ❌ **Sebelum**: Test App IDs langsung di app.json
- ✅ **Sesudah**: Plugin configuration dengan proper App IDs

### 2. Error Handling yang Robust
- ❌ **Sebelum**: AdMob crash bisa menghentikan seluruh aplikasi
- ✅ **Sesudah**: Try-catch blocks dan graceful fallbacks

### 3. Dynamic Loading
- ❌ **Sebelum**: Import AdMob langsung di top level
- ✅ **Sesudah**: Dynamic import dengan platform checks

### 4. Global Error Handler
- ✅ **Baru**: Crash handler untuk menangkap dan log errors
- ✅ **Baru**: Safe AdMob initialization utility

## 🔧 Perubahan Kode Utama

### app.json
```json
{
  "plugins": [
    [
      "react-native-google-mobile-ads",
      {
        "androidAppId": "ca-app-pub-3940256099942544~3347511713",
        "iosAppId": "ca-app-pub-3940256099942544~1458002511"
      }
    ]
  ]
}
```

### _layout.tsx
- Global error handler setup
- Safe AdMob initialization
- Platform-specific loading

### Components
- Dynamic AdMob component loading
- Platform checks sebelum render
- Error boundaries untuk ads

## 🧪 Testing Checklist

### Development Testing:
- [ ] App starts tanpa crash
- [ ] Banner ads load (atau gracefully fail)
- [ ] Rewarded ads berfungsi
- [ ] No console errors terkait AdMob

### Production Testing:
- [ ] Build dengan `eas build --platform android --profile production`
- [ ] Test di device fisik
- [ ] Upload ke Google Play Console (internal testing)
- [ ] Verify tidak ada crash reports

## 🚀 Langkah Deploy

### 1. Build Production
```bash
# Clean build
npx expo install --fix
eas build --platform android --profile production --clear-cache
```

### 2. Test Internal
- Upload ke Google Play Console
- Test di internal testing track
- Monitor crash reports

### 3. Monitoring
- Check Google Play Console > Quality > Crashes & ANRs
- Monitor AdMob dashboard untuk ad performance

## 🔍 Debugging Tips

### Jika Masih Crash:
1. **Check Logs**: Google Play Console > Quality > Crashes & ANRs
2. **Test Locally**: `npx expo run:android --variant release`
3. **Disable AdMob**: Comment out AdMob components untuk isolasi
4. **Check Dependencies**: Pastikan semua dependencies compatible

### Common Issues:
- **ProGuard/R8**: Bisa minify AdMob classes
- **Permissions**: AdMob butuh internet permission
- **Network**: Test dengan/tanpa internet connection

## 📱 Production Checklist

- ✅ Remove test App IDs (gunakan real AdMob App IDs)
- ✅ Test di release build
- ✅ Verify AdMob account setup
- ✅ Check app permissions
- ✅ Monitor crash reports

## 🆘 Emergency Rollback

Jika masih ada masalah:
1. Comment out semua AdMob imports
2. Remove AdMob plugin dari app.json
3. Build dan deploy versi tanpa ads
4. Fix issues secara bertahap

## 📞 Support

Jika masih mengalami crash:
1. Share crash logs dari Google Play Console
2. Test dengan `npx expo run:android --variant release`
3. Check AdMob account status
4. Verify app configuration di AdMob dashboard
