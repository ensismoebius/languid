import { useRef, useState } from 'react';
import { Animated, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ExerciseInstructions({ styles, instruction })
{
    const [isVisible, setIsVisible] = useState(true);

    const heightAnim = useRef(new Animated.Value(styles.instructions.minHeight)).current;

    function toggleInput()
    {
        Animated.timing(heightAnim, {
            toValue: isVisible ? 0 : styles.instructions.minHeight,
            duration: 100,
            useNativeDriver: false,
        }).start();

        setIsVisible(!isVisible);
    };

    return (
        <View>
            <TouchableOpacity onPress={toggleInput} style={styles.horizontalHandleDimentions}>
                <View style={styles.handle} />
            </TouchableOpacity>
            <Animated.View style={{ overflow: 'hidden', height: heightAnim }}>
                <ScrollView
                    style={styles.instructions}
                    contentContainerStyle={{ padding: 8, paddingBottom: 20 }}
                    showsVerticalScrollIndicator={true}
                    scrollEnabled={true}
                >
                    <Text
                        selectable
                        accessibilityLabel="Instruções do exercício"
                        accessibilityRole="text"
                        accessibilityLiveRegion="polite"
                    >
                        {instruction}
                    </Text>
                </ScrollView>
            </Animated.View>
        </View >
    );
}