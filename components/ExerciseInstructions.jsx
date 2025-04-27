import React from 'react';
import { TextInput } from 'react-native';

export default function ExerciseInstructions({ styles, instruction })
{
    return (
        <TextInput
            style={styles.instructions}
            multiline
            value={instruction}
            editable={false}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
        />
    );
}