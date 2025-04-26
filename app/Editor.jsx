import React, { useState } from 'react';
import
{
    View,
    TouchableOpacity,
    Text,
    FlatList,
    ScrollView,
    TextInput,
    Keyboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createStyles } from '../css/editor_css';

export default function Editor()
{
    const exercises = [
        { id: 1, title: 'Exe 01', instruction: 'Crie a função principal e a faça retornar 0' },
        { id: 2, title: 'Exe 02', instruction: 'Implemente uma função que soma dois números' }
    ];

    const headerHeight = 80;
    const styles = createStyles(headerHeight);

    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const [code, setCode] = useState('// Digite seu código abaixo');
    const [currentExercise, setCurrentExercise] = useState(0);

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

    const handleExerciseSelect = (index) =>
    {
        setCurrentExercise(index);
        setCode('// Digite seu código abaixo');
        Keyboard.dismiss();
    };

    const handleRunCode = () =>
    {
        // Here you would implement your code execution logic
        console.log('Executing code:', code);
        // For demo purposes, we'll just show an alert
        alert('Código executado! Verifique o console para detalhes.');
    };

    return (
        <LinearGradient
            colors={['#FF6B6B', '#FF8E53', '#FFAF40']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            {/* Header Section */}
            <View style={[styles.header, { height: headerHeight }]}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleRunCode}
                >
                    <Text style={styles.buttonText}>Executar</Text>
                </TouchableOpacity>

                <FlatList
                    data={exercises}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            style={[
                                styles.exerciseItem,
                                currentExercise === index && styles.selectedExercise
                            ]}
                            onPress={() => handleExerciseSelect(index)}
                        >
                            <Text style={styles.exerciseText}>{item.title}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.flatListContent}
                />

                <Text style={styles.exerciseCounter}>
                    {currentExercise + 1}/{exercises.length}
                </Text>
            </View>

            {/* Editor and Instructions Section */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <TextInput
                    style={styles.inputCode}
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
                />

                <TextInput
                    style={styles.instructions}
                    multiline
                    value={exercises[currentExercise].instruction}
                    editable={false}
                    autoCapitalize="none"
                    autoCorrect={false}
                    spellCheck={false}
                />
            </ScrollView>
        </LinearGradient>
    );
};