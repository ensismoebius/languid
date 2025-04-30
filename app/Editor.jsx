import React, { useState, useRef, useEffect, useContext } from 'react';
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
import { AuthContext } from '../contexts/AuthContext';
import { useRouter, useRootNavigationState } from 'expo-router';
import { apiRequest } from '../utils/api';

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
    const { userToken } = useContext(AuthContext); // Get token from AuthContext
    const router = useRouter();
    const navigationState = useRootNavigationState();

    // Helper to update exercise status
    const updateExerciseStatus = (done) =>
    {
        setExercises(prev =>
        {
            const updated = [...prev];
            if (updated[currentExercise]) updated[currentExercise].done = done;
            return updated;
        });
    };

    // Helper to handle unauthorized
    const handleUnauthorized = (response) =>
    {
        if (response.status === 401)
        {
            router.replace('/');
            return true;
        }
        return false;
    };

    const handleRunCode = async () =>
    {
        // Update code in current exercise
        setExercises(prev =>
        {
            const updated = [...prev];
            if (updated[currentExercise]) updated[currentExercise].code = code;
            return updated;
        });

        if (executing) return;
        setExecuting(true);
        setShowConsole(true);
        setConsoleOutput("Executando...");
        Keyboard.dismiss();
        try
        {
            const jsonData = await apiRequest({
                method: "POST",
                body: {
                    code,
                    exerciseId: exercises[currentExercise]?.id,
                    exercise: exercises[currentExercise]?.testFileName,
                },
                userToken
            });
            if (jsonData.status !== 'success')
            {
                setConsoleOutput(`Error: ${jsonData.message}`);
                updateExerciseStatus(false);
                return;
            }
            const testsData = JSON.parse(jsonData.message);
            const failures = parseInt(testsData.failures || "0");
            if (failures === 0)
            {
                setConsoleOutput("Execução feita com sucesso: Vá para o próximo exercício");
                updateExerciseStatus(true);
            } else
            {
                const failureDetails = testsData.testsuites
                    .flatMap(suite => suite.testsuite)
                    .flatMap(test => test.failures)
                    .map(failure => failure.failure)
                    .join('\n\n');
                setConsoleOutput(`Falhas: ${failures}:\n${failureDetails}`);
                updateExerciseStatus(false);
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
                const jsonData = await apiRequest({
                    method: 'GET',
                    userToken
                });
                if (jsonData.status === 'success' && Array.isArray(jsonData.exercises))
                {
                    setExercises(jsonData.exercises.map(ex => ({
                        id: ex.id,
                        title: ex.title,
                        instruction: ex.instructions || ex.instruction || '',
                        done: Boolean(ex.done == 1),
                        testFileName: ex.testFileName || '',
                        code: ex.code || ''
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
    }, [userToken]);

    useEffect(() =>
    {
        // Redirect to login if not authenticated, but only after navigation is ready
        if (navigationState?.key && !userToken)
        {
            router.replace('/');
        }
    }, [userToken, navigationState]);

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
                setCurrentExercise={setCurrentExercise}
                currentExercise={currentExercise}
                setShowConsole={setShowConsole}
                setCode={setCode}
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