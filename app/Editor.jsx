import React, { useState } from 'react';
import
{
    View,
    TouchableOpacity,
    Text,
    FlatList,
    ScrollView,
    TextInput,
    Keyboard,
    ActivityIndicator
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
    const [showConsole, setShowConsole] = useState(false);
    const [executing, setExecuting] = useState(false);
    const [consoleOutput, setConsoleOutput] = useState('');

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

    async function handleRunCode()
    {

        setExecuting(true);

        // Erase when implemented
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        await delay(2000); // 2-second delay

        // Simple code execution simulation
        try
        {
            // This is just a simulation - in a real app you'd need a proper JS interpreter
            let output = '';

            // Check for common patterns in the code
            if (code.includes('return 0'))
            {
                output = 'Program executed successfully. Return value: 0';
            } else if (code.includes('console.log'))
            {
                output = 'Hello World!'; // Default console.log output
            } else
            {
                output = 'Code executed (simulated). No output generated.';
            }

            setConsoleOutput(output);
            setShowConsole(true);

            // Scroll to bottom to show console output
            setTimeout(() =>
            {
                if (this.consoleScrollView)
                {
                    this.consoleScrollView.scrollToEnd({ animated: true });
                }
            }, 100);

        } catch (error)
        {
            setConsoleOutput(`Error: ${error.message}`);
            setShowConsole(true);
        } finally
        {
            setExecuting(false);
        }
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
                    {executing ?
                        (<ActivityIndicator size="small" color="#fff" />) :
                        (<Text style={styles.buttonText}>Executar</Text>)
                    }
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

                {showConsole && (
                    <View style={styles.consoleContainer}>
                        <View style={styles.consoleHeader}>
                            <Text style={styles.consoleTitle}>Console Output</Text>
                        </View>
                        <ScrollView
                            ref={ref => this.consoleScrollView = ref}
                            style={styles.consoleOutput}
                            contentContainerStyle={styles.consoleContent}
                        >
                            <Text style={styles.consoleText}>{consoleOutput}</Text>
                        </ScrollView>
                    </View>
                )}

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