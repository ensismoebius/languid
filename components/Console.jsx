import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function Console({ styles, consoleOutput, showConsole })
{
    const consoleScrollViewRef = useRef(null);

    useEffect(() =>
    {
        if (showConsole)
        {
            setTimeout(() =>
            {
                consoleScrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [consoleOutput, showConsole]);

    if (!showConsole) return null;

    return (
        <View style={styles.consoleContainer} accessible accessibilityRole="text" accessibilityLiveRegion="polite" accessibilityLabel="Saída do console">
            <View style={styles.consoleHeader}>
                <Text style={styles.consoleTitle}>Console Output</Text>
            </View>
            <ScrollView
                ref={consoleScrollViewRef}
                style={styles.consoleOutput}
                contentContainerStyle={styles.consoleContent}
            >
                <Text style={styles.consoleText}>{consoleOutput}</Text>
            </ScrollView>
        </View>
    );
}