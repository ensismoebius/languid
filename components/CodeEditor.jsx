import React from 'react';
import { Button, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import MonacoEditorView from './MonacoEditorView';

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

    if (Platform.OS === 'web')
    {
        return (
            <MonacoEditorView
                style={[styles.inputCode, styles.scrollView]}
                onCodeChange={setCode}
                initialCode={code}
            />
        );
    } else
    {
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
}