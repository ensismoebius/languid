import React, { useState, useRef } from 'react';
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

const API_URL = "http://192.168.0.5/languid/api.php";
// Consider using environment variables for sensitive data
// const API_KEY = process.env.API_KEY || "re98wr6ew8r6rew76r89e6rwer6w98r6ywe9r6r6w87e9wr6ew06r7";
const API_KEY = "re98wr6ew8r6rew76r89e6rwer6w98r6ywe9r6r6w87e9wr6ew06r7";

const exercises = [
    { id: 1, title: 'Exe 01', instruction: 'Crie a função principal e a faça retornar 0' },
    { id: 2, title: 'Exe 02', instruction: 'Implemente uma função que soma dois números' }
];

export default function Editor()
{
    const headerHeight = 80;
    const styles = createStyles(headerHeight);
    const consoleScrollViewRef = useRef(null);

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
        setShowConsole(false);
        Keyboard.dismiss();
    };

    const handleRunCode = async () =>
    {
        if (executing) return;

        setExecuting(true);
        setShowConsole(true);

        try
        {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": API_KEY,
                },
                body: JSON.stringify({
                    code: code,
                    exercise: exercises[currentExercise].id
                }),
            });

            if (!response.ok)
            {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const jsonData = await response.json();

            if (jsonData.status === 'error' || jsonData.status === 'fail')
            {
                setConsoleOutput(`Error: ${jsonData.message}`);
            } else
            {
                setConsoleOutput(jsonData.message);
            }
        } catch (error)
        {
            setConsoleOutput(`Error: ${error.message}`);
        } finally
        {
            setExecuting(false);
            setTimeout(() =>
            {
                consoleScrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
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
                    disabled={executing}
                >
                    {executing ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Executar</Text>
                    )}
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
                            ref={consoleScrollViewRef}
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
}