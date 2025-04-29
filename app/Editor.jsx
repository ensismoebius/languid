import React, { useState, useRef, useEffect } from 'react';
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
import { API_URL, API_KEY } from '../constants/API_constants';

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

    const [exercises, setExercises] = useState([]);

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

                const testsData = JSON.parse(jsonData.message);

                // Check for failures and update the exercise status
                const failures = parseInt(testsData.failures || "0");

                if (failures == 0)
                {
                    setExercises(prevExercises =>
                    {
                        const updatedExercises = [...prevExercises];
                        updatedExercises[currentExercise].done = true;
                        return updatedExercises;
                    });
                } else
                {
                    setExercises(prevExercises =>
                    {
                        const updatedExercises = [...prevExercises];
                        updatedExercises[currentExercise].done = false;
                        return updatedExercises;
                    });
                }
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

    useEffect(() =>
    {
        const fetchExercises = async () =>
        {
            try
            {
                const response = await fetch(API_URL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-KEY': API_KEY,
                    },
                });
                if (!response.ok)
                {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const jsonData = await response.json();
                if (jsonData.status === 'success' && Array.isArray(jsonData.exercises))
                {
                    setExercises(jsonData.exercises.map(ex => ({
                        id: ex.id,
                        title: ex.title,
                        instruction: ex.instructions || ex.instruction || '',
                        done: false
                    })));
                } else
                {
                    setExercises([]);
                }
            } catch (error)
            {
                setExercises([]);
            }
        };
        fetchExercises();
    }, []);

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
                instruction={exercises.length > 0 && exercises[currentExercise] ? exercises[currentExercise].instruction : ''}
            />
        </LinearGradient>
    );
}