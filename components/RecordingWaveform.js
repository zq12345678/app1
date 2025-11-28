import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function RecordingWaveform({ onStop }) {
    // Create multiple animated values for ripples
    const ripple1 = useRef(new Animated.Value(0)).current;
    const ripple2 = useRef(new Animated.Value(0)).current;
    const ripple3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const createAnimation = (value, delay) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.timing(value, {
                        toValue: 1,
                        duration: 2000,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                        delay: delay,
                    }),
                    Animated.timing(value, {
                        toValue: 0,
                        duration: 0,
                        useNativeDriver: true,
                    })
                ])
            );
        };

        const anim1 = createAnimation(ripple1, 0);
        const anim2 = createAnimation(ripple2, 600);
        const anim3 = createAnimation(ripple3, 1200);

        anim1.start();
        anim2.start();
        anim3.start();

        return () => {
            anim1.stop();
            anim2.stop();
            anim3.stop();
        };
    }, []);

    const renderRipple = (animValue) => {
        const scale = animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 4],
        });

        const opacity = animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.6, 0],
        });

        return (
            <Animated.View
                style={[
                    styles.ripple,
                    {
                        transform: [{ scale }],
                        opacity,
                    },
                ]}
            />
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.rippleContainer}>
                    {renderRipple(ripple1)}
                    {renderRipple(ripple2)}
                    {renderRipple(ripple3)}

                    <View style={styles.micCircle}>
                        <MaterialCommunityIcons name="microphone" size={40} color="white" />
                    </View>
                </View>

                <Text style={styles.statusText}>Listening...</Text>

                <TouchableOpacity style={styles.stopButton} onPress={onStop}>
                    <MaterialCommunityIcons name="stop" size={32} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    rippleContainer: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
    },
    ripple: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#3B6FE8',
    },
    micCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#3B6FE8',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        shadowColor: '#3B6FE8',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    statusText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        marginBottom: 60,
    },
    stopButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#E8504C',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
});
