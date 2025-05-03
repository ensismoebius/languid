import React from 'react';
import MonacoEditorView from './MonacoEditorView';
import { Platform, TextInput } from 'react-native';

export default function CodeEditor(
    {
        styles,
        code,
        setCode,
        selection,
        setSelection
    }
)
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
                style={
                    [styles.inputCode, styles.scrollView]
                }
                setCode={setCode}
                code={code}
            />
        );
    }
    else
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