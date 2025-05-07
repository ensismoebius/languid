import { useRef, useState } from 'react';
import { Animated, TextInput, TouchableOpacity, View } from 'react-native';

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
                <TextInput
                    style={styles.instructions}
                    multiline
                    value={instruction}
                    editable={false}
                    autoCapitalize="none"
                    autoCorrect={false}
                    spellCheck={false}
                    accessibilityLabel="Instruções do exercício"
                    accessibilityRole="text"
                    accessibilityLiveRegion="polite"
                />
            </Animated.View>
        </View >
    );
}