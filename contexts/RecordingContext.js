import React, { createContext, useState, useContext, useCallback } from 'react';
import { Audio } from 'expo-av';
import { Alert } from 'react-native';
import { GOOGLE_API_KEY, GOOGLE_SPEECH_API_URL } from '../config/api';

const RecordingContext = createContext();

export const useRecording = () => useContext(RecordingContext);

export const RecordingProvider = ({ children }) => {
    const [recording, setRecording] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const [transcriptionHandler, setTranscriptionHandler] = useState(null);

    // Register a handler to receive the transcribed text
    const registerHandler = useCallback((handler) => {
        console.log('Context: Registering handler');
        setTranscriptionHandler(() => handler);
    }, []);

    const unregisterHandler = useCallback(() => {
        console.log('Context: Unregistering handler');
        setTranscriptionHandler(null);
    }, []);

    async function startRecording() {
        try {
            console.log('Context: Requesting permissions..');
            if (!permissionResponse || permissionResponse.status !== 'granted') {
                const perm = await requestPermission();
                if (perm.status !== 'granted') {
                    Alert.alert('Permission needed', 'Please grant microphone permission to record audio.');
                    return;
                }
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log('Context: Starting recording..');
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
            setIsRecording(true);
            console.log('Context: Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
            Alert.alert('Error', 'Failed to start recording: ' + err.message);
        }
    }

    async function stopRecording() {
        if (!recording) return;

        console.log('Context: Stopping recording..');
        setIsRecording(false);

        try {
            await recording.stopAndUnloadAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
            });
            const uri = recording.getURI();
            console.log('Context: Recording stopped and stored at', uri);
            setRecording(undefined);

            // Simulated Speech-to-Text (Google API has audio format compatibility issues)
            setIsProcessing(true);
            if (transcriptionHandler) {
                console.log('Context: Using simulated transcription');
                setTimeout(() => {
                    const simulatedText = {
                        english: 'This is a simulated transcription. Google Speech-to-Text API requires specific audio formats that are difficult to match with React Native recordings.',
                        simplifiedChinese: '这是模拟转录。Google 语音识别 API 对音频格式要求严格，与 React Native 录音格式不兼容。',
                        traditionalChinese: '這是模擬轉錄。Google 語音識別 API 對音頻格式要求嚴格，與 React Native 錄音格式不兼容。',
                        italian: 'Questa è una trascrizione simulata.',
                        spanish: 'Esta es una transcripción simulada.',
                        japanese: 'これはシミュレーションされた転写です。',
                        korean: '이것은 시뮬레이션 된 전사입니다.'
                    };
                    transcriptionHandler(simulatedText);
                    setIsProcessing(false);
                }, 1500);
            } else {
                console.log('Context: No handler registered, text ignored');
                console.log('Context: transcriptionHandler is:', transcriptionHandler);
                Alert.alert('Note', 'Recording saved, but no active note screen to receive text.');
                setIsProcessing(false);
            }
        } catch (error) {
            console.error('Failed to stop recording', error);
            setIsProcessing(false);
        }
    }

    const toggleRecording = async () => {
        if (isRecording) {
            await stopRecording();
        } else {
            await startRecording();
        }
    };

    return (
        <RecordingContext.Provider value={{
            isRecording,
            isProcessing,
            toggleRecording,
            registerHandler,
            unregisterHandler
        }}>
            {children}
        </RecordingContext.Provider>
    );
};
