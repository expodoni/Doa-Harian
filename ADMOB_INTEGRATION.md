# AdMob Integration Documentation

## Overview
Aplikasi Doa Harian telah diintegrasikan dengan Google AdMob menggunakan iklan demo yang sesuai dengan kebijakan AdMob.

## Implementasi

### 1. Dependencies
- `react-native-google-mobile-ads` versi 15.4.0 sudah terinstall
- Plugin sudah dikonfigurasi di `app.json`

### 2. Jenis Iklan yang Diimplementasikan

#### Banner Ads
- **Lokasi**: Bagian bawah halaman utama
- **Unit ID**: Test ID dari AdMob (TestIds.BANNER)
- **Komponen**: `components/BannerAd.tsx`

#### Rewarded Ads
- **Lokasi**: Halaman detail doa
- **Unit ID**: `ca-app-pub-3940256099942544/5224354917` (Demo ID yang Anda berikan)
- **Reward**: Akses ke terjemahan doa
- **Komponen**: `components/RewardedAd.tsx`

### 3. Fitur Keamanan & Kebijakan

#### Compliance dengan Kebijakan AdMob:
- ✅ Menggunakan Test IDs untuk development
- ✅ `requestNonPersonalizedAdsOnly: true` untuk GDPR compliance
- ✅ Proper error handling
- ✅ User-initiated rewarded ads
- ✅ Clear value proposition untuk rewarded ads

#### Error Handling:
- Automatic retry pada gagal load
- User-friendly error messages
- Graceful fallback jika ads tidak tersedia

### 4. User Experience

#### Banner Ads:
- Tidak mengganggu navigasi utama
- Positioned di bottom dengan background putih
- Auto-load dan refresh

#### Rewarded Ads:
- User harus aktif memilih untuk menonton
- Clear benefit (terjemahan doa)
- Feedback visual saat loading
- Reward langsung diberikan setelah menonton

## Testing

### Untuk Development:
1. Jalankan `npx expo start`
2. Test di device/emulator
3. Banner ads akan muncul di halaman utama
4. Rewarded ads dapat diakses di halaman detail doa

### Untuk Production:
1. Ganti Test IDs dengan real Ad Unit IDs dari AdMob console
2. Update `googleMobileAdsAppId` di app.json dengan ID aplikasi real
3. Submit untuk review AdMob

## Build Instructions

### Development Build:
```bash
npx expo start
```

### Production Build:
```bash
# Android
npx expo build:android

# iOS  
npx expo build:ios
```

## Important Notes

1. **Test Ads**: Saat ini menggunakan test ads yang aman untuk development
2. **Production**: Sebelum publish, ganti dengan real ad unit IDs
3. **Compliance**: Implementasi sudah mengikuti kebijakan AdMob
4. **Performance**: Ads di-load secara asynchronous untuk tidak mengganggu UX

## Next Steps

1. Test aplikasi di device
2. Verifikasi ads loading dengan baik
3. Siap untuk build production
4. Untuk production: daftar di AdMob console dan dapatkan real ad unit IDs
