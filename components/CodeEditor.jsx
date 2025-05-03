import React from 'react';
import Editor from "@monaco-editor/react";
import { Platform, ScrollView, TextInput, View } from 'react-native';

export default function CodeEditor({ styles, code, setCode, selection, setSelection })
{
    const handleEditorDidMount = (editor, monaco) =>
    {
        // Revela a primeira linha após a montagem do editor
        editor.revealLine(1);
    };

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
            <View style={[styles.scrollView]}>
                <Editor
                    defaultLanguage="cpp"
                    value={code}
                    onChange={setCode}
                    theme="vs-dark"
                    options={{
                        fontSize: 20,
                        wordWrap: 'on',
                        minimap: { enabled: true },
                        automaticLayout: true,
                    }}
                />
            </View>
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