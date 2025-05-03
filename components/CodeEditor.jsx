import React from 'react';
import { ScrollView, TextInput } from 'react-native';

export default function CodeEditor({ styles, code, setCode, selection, setSelection })
{
    const handleKeyPress = ({ nativeEvent }) =>
    {
        if (nativeEvent.key === 'Tab')
        {
            nativeEvent.preventDefault?.();
            const before = code.slice(0, selection.start);
            const after = code.slice(selection.end);
            const newText = before + '    ' + after;
            const newCursorPos = selection.start + 4;

            setCode(newText);
            setSelection({ start: newCursorPos, end: newCursorPos });
        }
    };

    return (
        <TextInput
            style={[styles.inputCode, styles.scrollView]}
            placeholderTextColor="#ffffffaa"
            multiline
            value={code}
            onChangeText={setCode}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            onSelectionChange={({ nativeEvent }) => setSelection(nativeEvent.selection)}
            onKeyPress={handleKeyPress}
            selection={selection}
            accessibilityLabel="Editor de código. Digite seu código aqui."
            accessibilityRole="text"
            accessible
        />
    );
}