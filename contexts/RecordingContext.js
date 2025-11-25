import React, { createContext, useState, useContext, useEffect } from 'react';
import { Audio } from 'expo-av';
import { Alert } from 'react-native';

const RecordingContext = createContext();

export const useRecording = () => useContext(RecordingContext);

export const RecordingProvider = ({ children }) => {
    const [recording, setRecording] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const [transcriptionHandler, setTranscriptionHandler] = useState(null);

    // Register a handler to receive the transcribed text
    const registerHandler = (handler) => {
        setTranscriptionHandler(() => handler);
    };

    const unregisterHandler = () => {
        setTranscriptionHandler(null);
    };

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
        setRecording(undefined);

        try {
            await recording.stopAndUnloadAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
            });
            const uri = recording.getURI();
            console.log('Context: Recording stopped and stored at', uri);

            // Simulate Speech-to-Text
            if (transcriptionHandler) {
                console.log('Context: Sending simulated text to handler');
                // Simulate processing delay
                setTimeout(() => {
                    const simulatedText = {
                        english: 'This is a simulated transcription from the global recording button.',
                        simplifiedChinese: '这是来自全局录音按钮的模拟转录。',
                        traditionalChinese: '這是來自全局錄音按鈕的模擬轉錄。',
                        italian: 'Questa è una trascrizione simulata.',
                        spanish: 'Esta es una transcripción simulada.',
                        japanese: 'これはシミュレーションされた転写です。',
                        korean: '이것은 시뮬레이션 된 전사입니다.'
                    };
                    transcriptionHandler(simulatedText);
                }, 1500);
            } else {
                console.log('Context: No handler registered, text ignored');
                Alert.alert('Note', 'Recording saved, but no active note screen to receive text.');
            }
        } catch (error) {
            console.error('Failed to stop recording', error);
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
            toggleRecording,
            registerHandler,
            unregisterHandler
        }}>
            {children}
        </RecordingContext.Provider>
    );
};
