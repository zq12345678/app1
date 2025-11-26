import React, { createContext, useState, useContext, useCallback } from 'react';
import { Audio } from 'expo-av';
import { Alert, Platform } from 'react-native';
import { GOOGLE_API_KEY, GOOGLE_SPEECH_API_URL } from '../config/api';

const RecordingContext = createContext();

export const useRecording = () => useContext(RecordingContext);

// 辅助函数：读取音频文件并转换为 base64
async function readAudioFileAsBase64(uri) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
            const reader = new FileReader();
            reader.onloadend = function() {
                // 移除 data URL 前缀，只保留 base64 数据
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = reject;
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });
}

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
            // 使用 LINEAR16 (PCM) 格式，Google Speech API 支持此格式
            const recordingOptions = {
                android: {
                    extension: '.wav',
                    outputFormat: Audio.AndroidOutputFormat.DEFAULT,
                    audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
                    sampleRate: 16000,
                    numberOfChannels: 1,
                    bitRate: 128000,
                },
                ios: {
                    extension: '.wav',
                    outputFormat: Audio.IOSOutputFormat.LINEARPCM,
                    audioQuality: Audio.IOSAudioQuality.HIGH,
                    sampleRate: 16000,
                    numberOfChannels: 1,
                    bitRate: 128000,
                    linearPCMBitDepth: 16,
                    linearPCMIsBigEndian: false,
                    linearPCMIsFloat: false,
                },
            };

            const { recording } = await Audio.Recording.createAsync(recordingOptions);
            setRecording(recording);
            setIsRecording(true);
            console.log('Context: Recording started with LINEAR16 format');
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

            // 使用 Google Speech-to-Text API 进行真实语音识别
            setIsProcessing(true);
            if (transcriptionHandler) {
                console.log('Context: Calling Google Speech-to-Text API');
                try {
                    // 读取音频文件并转换为 base64
                    const base64Audio = await readAudioFileAsBase64(uri);
                    console.log('Context: Base64 audio length:', base64Audio.length);

                    // 调用 Google Speech-to-Text API
                    const response = await fetch(`${GOOGLE_SPEECH_API_URL}?key=${GOOGLE_API_KEY}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            config: {
                                encoding: 'LINEAR16',  // 明确指定 LINEAR16 编码
                                sampleRateHertz: 16000,
                                languageCode: 'zh-CN',
                                alternativeLanguageCodes: ['en-US', 'zh-TW'],
                                enableAutomaticPunctuation: true,
                            },
                            audio: {
                                content: base64Audio,
                            },
                        }),
                    });

                    const result = await response.json();
                    console.log('Context: API response:', JSON.stringify(result, null, 2));

                    // 检查 API 错误
                    if (result.error) {
                        console.error('Context: API error:', result.error);
                        Alert.alert(
                            'API 错误',
                            `错误代码: ${result.error.code || 'N/A'}\n\n` +
                            `错误信息: ${result.error.message || '未知错误'}\n\n` +
                            `状态: ${result.error.status || 'N/A'}`
                        );
                        setIsProcessing(false);
                        return;
                    }

                    // 处理识别结果
                    if (result.results && result.results.length > 0) {
                        const transcript = result.results[0].alternatives[0].transcript;
                        console.log('Context: Recognized text:', transcript);

                        // 创建多语言文本对象（实际应用中可以调用翻译 API）
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
                        Alert.alert(
                            '提示',
                            '无法识别语音内容，请重试\n\n' +
                            '可能原因：\n' +
                            '- 录音时间太短\n' +
                            '- 环境噪音太大\n' +
                            '- 说话不够清晰'
                        );
                    }
                    setIsProcessing(false);
                } catch (error) {
                    console.error('Context: API error:', error);
                    Alert.alert('错误', '语音识别失败: ' + error.message);
                    setIsProcessing(false);
                }
            } else {
                console.log('Context: No handler registered');
                Alert.alert('提示', '录音已保存，但没有活动的笔记页面接收文本');
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
