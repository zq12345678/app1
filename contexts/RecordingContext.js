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

            // Real Speech-to-Text using Google API
            setIsProcessing(true);
            if (transcriptionHandler) {
                console.log('Context: Calling Google Speech-to-Text API');
                try {
                    // Read audio file using fetch and convert to base64
                    const response = await fetch(uri);
                    const blob = await response.blob();

                    // Convert blob to base64
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);

                    reader.onloadend = async () => {
                        const base64Audio = reader.result.split(',')[1]; // Remove data:audio/...;base64, prefix

                        // Call Google Speech-to-Text API
                        const apiResponse = await fetch(`${GOOGLE_SPEECH_API_URL}?key=${GOOGLE_API_KEY}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                config: {
                                    encoding: 'AMR_WB',
                                    sampleRateHertz: 16000,
                                    languageCode: 'zh-CN',
                                    alternativeLanguageCodes: ['en-US'],
                                },
                                audio: {
                                    content: base64Audio,
                                },
                            }),
                        });

                        const result = await apiResponse.json();
                        console.log('Context: API response:', result);

                        if (result.results && result.results.length > 0) {
                            const transcript = result.results[0].alternatives[0].transcript;
                            console.log('Context: Recognized text:', transcript);

                            // Create text object with the recognized text
                            const recognizedText = {
                                english: transcript,
                                simplifiedChinese: transcript,
                                traditionalChinese: transcript,
                                italian: transcript,
                                spanish: transcript,
                                japanese: transcript,
                                korean: transcript
                            };

                            transcriptionHandler(recognizedText);
                        } else {
                            console.log('Context: No transcription results');
                            Alert.alert('提示', '无法识别语音内容，请重试');
                        }
                        setIsProcessing(false);
                    };

                    reader.onerror = (error) => {
                        console.error('Context: FileReader error:', error);
                        Alert.alert('错误', '读取录音文件失败');
                        setIsProcessing(false);
                    };
                } catch (error) {
                    console.error('Context: API error:', error);
                    Alert.alert('错误', '语音识别失败: ' + error.message);
                    setIsProcessing(false);
                }
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
