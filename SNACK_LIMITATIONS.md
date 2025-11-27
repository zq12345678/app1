# Snack Environment Limitations

## ⚠️ Important Notice

This app **CANNOT run properly in Expo Snack** (https://snack.expo.dev) because it uses **SQLite database** which requires native modules.

### Why it doesn't work in Snack:

1. **SQLite Not Supported**: Expo Snack runs in a web environment that doesn't support `expo-sqlite`
2. **Native Modules Required**: The database functionality requires native code that can only run on actual devices or emulators
3. **AsyncStorage Limitations**: While AsyncStorage works in Snack, the database operations will fail

### Error You'll See:

```
Unable to fetch module snackager-1/@react-navigation/native@7.1.22 for ios
```

or

```
SQLite is not supported in web/Snack environment
```

## ✅ How to Run This App Properly

### Option 1: Use Expo Go on Your Phone (Recommended)

1. **Install Expo Go** on your phone:
   - iOS: Download from App Store
   - Android: Download from Google Play Store

2. **Clone the repository** to your local machine:
   ```bash
   git clone https://github.com/zq12345678/app1.git
   cd app1
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npx expo start
   ```

5. **Scan the QR code** with:
   - iOS: Camera app
   - Android: Expo Go app

### Option 2: Use iOS Simulator (Mac only)

1. Install Xcode from Mac App Store
2. Install dependencies: `npm install`
3. Start Expo: `npx expo start`
4. Press `i` to open in iOS Simulator

### Option 3: Use Android Emulator

1. Install Android Studio
2. Set up an Android Virtual Device (AVD)
3. Install dependencies: `npm install`
4. Start Expo: `npx expo start`
5. Press `a` to open in Android Emulator

## 📱 Features That Work Locally

When running on a real device or emulator, you'll have access to:

- ✅ User Registration & Login
- ✅ SQLite Database Storage
- ✅ Create/Read/Update/Delete Courses
- ✅ Create/Read/Update/Delete Lectures
- ✅ Create/Read/Update/Delete Transcripts
- ✅ User-specific data isolation
- ✅ Persistent data storage

## 🔧 Testing the App

Follow the instructions in `TESTING_GUIDE.md` for a complete testing workflow.

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo SQLite Documentation](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [React Navigation Documentation](https://reactnavigation.org/)

## 🐛 Troubleshooting

If you encounter issues:

1. **Clear cache**: `npx expo start -c`
2. **Reinstall dependencies**: `rm -rf node_modules && npm install`
3. **Check Expo Go version**: Make sure you're using the latest version
4. **Check logs**: Look at the terminal output for error messages

## 💡 Note

This is a local-first application designed to work on mobile devices with persistent storage. It is not designed to work in web-based environments like Expo Snack.

