import React, { useState, useRef } from 'react';
import
{
    View,
    TouchableOpacity,
    Text,
    FlatList,
    ScrollView,
    Keyboard,
    TextInput,
    ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createStyles } from '../css/editor_css';
import Header from '../components/Header';
import Console from '../components/Console';
import CodeEditor from '../components/CodeEditor';
import ExerciseInstructions from '../components/ExerciseInstructions';

const API_URL = "http://192.168.0.5/languid/serverAPI/api.php";
// Consider using environment variables for sensitive data
// const API_KEY = process.env.API_KEY || "re98wr6ew8r6rew76r89e6rwer6w98r6ywe9r6r6w87e9wr6ew06r7";
const API_KEY = "re98wr6ew8r6rew76r89e6rwer6w98r6ywe9r6r6w87e9wr6ew06r7";

const exercises = [
    { id: 1, title: 'Exe 01', instruction: 'Crie a função principal e a faça retornar 0', done: false },
    { id: 2, title: 'Exe 02', instruction: 'Implemente uma função que soma dois números', done: false },
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

    const handleRunCode = async () =>
    {
        if (executing) return;

        setExecuting(true);
        setShowConsole(true);
        setConsoleOutput("Executando...");
        Keyboard.dismiss();

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
            <Header
                styles={styles}
                headerHeight={headerHeight}
                handleRunCode={handleRunCode}
                executing={executing}
                exercises={exercises}
                currentExercise={currentExercise}
                setCurrentExercise={setCurrentExercise}
                setCode={setCode}
                setShowConsole={setShowConsole}
            />

            <CodeEditor
                styles={styles}
                code={code}
                setCode={setCode}
                selection={selection}
                setSelection={setSelection}
            />

            <Console
                styles={styles}
                consoleOutput={consoleOutput}
                showConsole={showConsole}
            />

            <ExerciseInstructions
                styles={styles}
                instruction={exercises[currentExercise].instruction}
            />
        </LinearGradient>
    );
}