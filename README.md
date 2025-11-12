# Otter Notes App

A React Native mobile application inspired by Otter.ai, featuring note-taking, lecture transcription, and multi-language translation capabilities.

## Features

- **Folder Organization**: Organize lectures into folders with a clean grid layout
- **Lecture Management**: View and manage lecture recordings with timestamps
- **Note Detail View**: Display lecture transcripts with timestamps
- **Multi-Language Translation**: Support for 7 languages (English, Simplified Chinese, Traditional Chinese, Italian, Spanish, Japanese, Korean)
- **Auto Translate**: Toggle translation display for lecture content
- **Summary View**: View lecture summaries with main topics and key formulas
- **Style Guide**: Built-in design system reference
- **AI Chat**: Placeholder for AI chat functionality

## Tech Stack

- **React Native**: Mobile app framework
- **Expo**: Development platform and tooling
- **React Navigation**: Navigation library (Stack Navigator + Bottom Tab Navigator)
- **@expo/vector-icons**: Icon library (MaterialCommunityIcons)
- **React Native Paper**: UI component library

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (iOS or Android)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/zq12345678/app1.git
cd app1
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Scan the QR code with Expo Go app to run on your device

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser

## Project Structure

```
.
├── App.js                          # Main app component with navigation setup
├── index.js                        # Entry point
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
└── components/
    ├── HomeScreen.js               # Home screen with folder grid
    ├── FolderDetailScreen.js       # Lecture list for a folder
    ├── NoteDetailScreen.js         # Lecture transcript and summary view
    ├── LanguageSelectionScreen.js  # Language selection interface
    ├── StyleGuideScreen.js         # Design system reference
    └── AIChatScreen.js             # AI chat placeholder
```

## Features in Detail

### Language Support

The app supports translation into 7 languages:
- English
- 简体中文 (Simplified Chinese)
- Italiano (Italian)
- 繁體中文 (Traditional Chinese)
- español (Spanish)
- 日本語 (Japanese)
- 한국인 (Korean)

### Summary View

Each lecture includes:
- **Main Topic**: Overview of the lecture content in English and selected language
- **Key Formulas**: 3 key points or formulas from the lecture

### Navigation Structure

- **Bottom Tab Navigator**:
  - Home Tab (Stack Navigator)
  - Record Tab (Floating microphone button)
  - AI Chat Tab

- **Home Stack**:
  - HomeScreen → FolderDetailScreen → NoteDetailScreen → LanguageSelectionScreen
  - StyleGuideScreen (accessible from HomeScreen)

## Demo Data

The app includes hardcoded demo data for 5 lectures across 3 folders:
- **CIS 515**: Database Management Systems
- **CIS 520**: Machine Learning
- **CIS 573**: Software Engineering

Each lecture contains:
- Timestamped transcript entries
- Translations in all 7 supported languages
- Summary with main topic and key formulas

## Contributing

Feel free to fork this project and submit pull requests for any improvements.

## License

This project is licensed under the 0BSD License.

## Acknowledgments

- Inspired by Otter.ai
- Built with Expo and React Native
- Icons from MaterialCommunityIcons
