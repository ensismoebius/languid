import React, {
    useRef,
    useState,
    useEffect,
    useContext
} from 'react';

import
{
    View,
    Text,
    Modal,
    Keyboard,
    TouchableOpacity,
} from 'react-native';

import
{
    Redirect,
    useRouter,
} from 'expo-router';

import { LinearGradient } from 'expo-linear-gradient';
import { useNavigationState } from '@react-navigation/native';

import Header from '../components/Header';
import Console from '../components/Console';
import CodeEditor from '../components/CodeEditor';
import ExerciseInstructions from '../components/ExerciseInstructions';

import { apiRequest } from '../utils/api';
import { createStyles } from '../css/editor_css';
import { AuthContext } from '../contexts/AuthContext';

export default function Editor()
{
    const headerHeight = 80;
    const styles = createStyles(headerHeight);
    const consoleScrollViewRef = useRef(null);

    // State variables
    const [code, setCode] = useState('// Digite seu código abaixo');
    const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [currentExercise, setCurrentExercise] = useState(0);
    const [pendingAction, setPendingAction] = useState(null);
    const [consoleOutput, setConsoleOutput] = useState('');
    const [showConsole, setShowConsole] = useState(false);
    const [executing, setExecuting] = useState(false);
    const [modalError, setModalError] = useState('');
    const [exercises, setExercises] = useState([]);
    const [theme, setTheme] = useState('default');

    const router = useRouter();
    const routeName = useNavigationState(state => state.routes[state.index]?.name);

    const { userToken } = useContext(AuthContext);
    const { logout } = useContext(AuthContext);

    useEffect(() =>
    {
        async function fetchExercises()
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
                        code: ex.code || '',
                        done: Boolean(ex.done == 1),
                        testFileName: ex.testFileName || '',
                        instruction: ex.instructions || ex.instruction || '',
                    })));
                } else
                {
                    setExercises([]);
                    setConsoleOutput(`Erro ao carregar exercícios: ${jsonData.message || 'Resposta inesperada do servidor.'}`);
                    setShowConsole(true);
                }
            } catch (error)
            {
                if (error.message && error.message.toLowerCase().includes('network'))
                {
                    setConsoleOutput('Erro de rede: Não foi possível carregar os exercícios. Verifique sua conexão com a internet.');
                } else
                {
                    setConsoleOutput(`Erro inesperado ao carregar exercícios: ${error.message || error}`);
                }
                setShowConsole(true);
                setExercises([]);
            }
        };
        fetchExercises();
    }, [userToken]);

    useEffect(() =>
    {
        // When currentExercise changes, update code editor with the code for the selected exercise
        if (exercises.length > 0 && exercises[currentExercise])
        {
            setCode(exercises[currentExercise].code || '');
        }
    }, [currentExercise, exercises]);

    if (!userToken) return <Redirect href="/" />;

    // Helper to update exercise status
    function updateExerciseStatus(done)
    {
        setExercises(prev =>
        {
            const updated = [...prev];
            if (updated[currentExercise]) updated[currentExercise].done = done;
            return updated;
        });
    };

    // Helper to handle unauthorized
    function handleUnauthorized(response)
    {
        if (response.status === 401)
        {
            router.replace('/');
            return true;
        }
        return false;
    };

    async function handleRunCode()
    {
        if (!code || code.trim() === '')
        {
            setShowConsole(true);
            setConsoleOutput('Por favor, escreva algum código antes de executar.');
            return;
        }

        setExercises(prev =>
        {
            const updated = [...prev];
            if (updated[currentExercise]) updated[currentExercise].code = code;
            return updated;
        });

        if (executing) return;

        Keyboard.dismiss();
        setExecuting(true);
        setShowConsole(true);
        setConsoleOutput("Executando...");

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
                setConsoleOutput(`Erro do servidor: ${jsonData.message || 'Resposta inesperada do servidor.'}`);
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
            if (error.message && error.message.toLowerCase().includes('network'))
            {
                setConsoleOutput('Erro de rede: Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
            } else
            {
                setConsoleOutput(`Erro inesperado: ${error.message || error}`);
            }
        } finally
        {
            setExecuting(false);
            setTimeout(() =>
            {
                consoleScrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    };

    // Helper to check for unsaved changes
    function hasUnsavedChanges()
    {
        return exercises.length > 0 && exercises[currentExercise] && code !== exercises[currentExercise].code;
    };

    // Intercept exercise switch
    function requestExerciseSwitch(index)
    {
        if (index === currentExercise) return;
        if (hasUnsavedChanges())
        {
            // TODO - Not working properly so, deactivates for now
            // setPendingAction({ type: 'switch', value: index });
            // setShowUnsavedModal(true);
        } else
        {
            setCurrentExercise(index);
            setShowConsole(false);
            setCode(exercises[index].code);
            Keyboard.dismiss();
        }
    };

    // Intercept logout
    function requestLogout()
    {
        if (hasUnsavedChanges())
        {
            setPendingAction({ type: 'logout' });

            // TODO - Not working properly so, deactivates for now
            // setShowUnsavedModal(true);
        } else
        {
            doLogout();
        }
    };

    // Handle logout
    async function doLogout()
    {
        await logout();
        router.replace('/');
    };

    // Handle modal actions
    async function handleModalAction(action)
    {
        setModalError('');
        // TODO - Not working properly so, deactivates for now
        // setShowUnsavedModal(false);
        if (action === 'save')
        {
            try
            {
                setExercises(prev =>
                {
                    const updated = [...prev];
                    if (updated[currentExercise]) updated[currentExercise].code = code;
                    return updated;
                });
                if (pendingAction?.type === 'switch')
                {
                    setCurrentExercise(pendingAction.value);
                    setShowConsole(false);
                    setCode(exercises[pendingAction.value].code);
                    Keyboard.dismiss();
                } else if (pendingAction?.type === 'logout')
                {
                    await doLogout();
                }
                setPendingAction(null);
            } catch (err)
            {
                setModalError('Erro ao salvar alterações. Tente novamente ou descarte as alterações.');
                setShowUnsavedModal(true);
            }
        } else if (action === 'discard')
        {
            if (pendingAction?.type === 'switch')
            {
                setCurrentExercise(pendingAction.value);
                setShowConsole(false);
                setCode(exercises[pendingAction.value].code);
                Keyboard.dismiss();
            } else if (pendingAction?.type === 'logout')
            {
                await doLogout();
            }
            setPendingAction(null);
        } else
        {
            setPendingAction(null);
        }
    };

    // Theme styles
    function getThemeColors()
    {
        if (theme === 'high-contrast')
        {
            return ['#000', '#fff', '#ff0']; // black bg, white fg, yellow accent
        } else if (theme === 'light')
        {
            return ['#fff', '#eee', '#2196F3'];
        } else if (theme === 'dark')
        {
            return ['#222', '#333', '#FF8E53'];
        }
        return ['#FF6B6B', '#FF8E53', '#FFAF40']; // default
    };

    const themeColors = getThemeColors();

    return (
        <LinearGradient
            colors={themeColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <Header
                styles={styles}
                executing={executing}
                exercises={exercises}
                headerHeight={headerHeight}
                currentExercise={currentExercise}
                setCode={setCode}
                handleRunCode={handleRunCode}
                requestLogout={requestLogout}
                setShowConsole={setShowConsole}
                setCurrentExercise={requestExerciseSwitch}
                onOpenAccessibility={() => setShowAccessibilityModal(true)}
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
                showConsole={showConsole}
                consoleOutput={consoleOutput}
            />

            <ExerciseInstructions
                styles={styles}
                instruction={exercises.length > 0 && exercises[currentExercise] ? exercises[currentExercise].instruction : ''}
            />
            {exercises.length === 0 && (
                <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text style={{ color: '#ddd', fontSize: 18, textAlign: 'center' }}>
                        Nenhum exercício disponível no momento. Tente novamente mais tarde ou contate o suporte.
                    </Text>
                </View>
            )}

            <Modal
                visible={showUnsavedModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowUnsavedModal(false)}
                accessible accessibilityViewIsModal accessibilityLabel="Alerta de alterações não salvas"
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ backgroundColor: '#fff', padding: 24, borderRadius: 10, width: 300 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }} accessibilityRole="header">Você tem alterações não salvas.</Text>
                        <Text style={{ marginBottom: 20 }}>Deseja salvar antes de continuar?</Text>
                        {modalError ? (
                            <Text style={{ color: '#f44336', marginBottom: 10 }}>{modalError}</Text>
                        ) : null}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => handleModalAction('save')} style={{ padding: 10 }} accessibilityLabel="Salvar e continuar" accessibilityRole="button">
                                <Text style={{ color: '#2196F3', fontWeight: 'bold' }}>Salvar e continuar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleModalAction('discard')} style={{ padding: 10 }} accessibilityLabel="Descartar alterações" accessibilityRole="button">
                                <Text style={{ color: '#f44336', fontWeight: 'bold' }}>Descartar alterações</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleModalAction('cancel')} style={{ padding: 10 }} accessibilityLabel="Cancelar" accessibilityRole="button">
                                <Text style={{ color: '#333', fontWeight: 'bold' }}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showAccessibilityModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowAccessibilityModal(false)}
                accessible accessibilityViewIsModal accessibilityLabel="Opções de acessibilidade"
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ backgroundColor: '#fff', padding: 24, borderRadius: 10, width: 300 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Acessibilidade</Text>
                        <TouchableOpacity onPress={() => { setTheme('high-contrast'); setShowAccessibilityModal(false); }} accessibilityLabel="Ativar alto contraste" accessibilityRole="button" style={{ padding: 10 }}>
                            <Text style={{ color: '#000', fontWeight: 'bold' }}>Alto contraste</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setTheme('light'); setShowAccessibilityModal(false); }} accessibilityLabel="Ativar modo claro" accessibilityRole="button" style={{ padding: 10 }}>
                            <Text style={{ color: '#2196F3', fontWeight: 'bold' }}>Modo claro</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setTheme('dark'); setShowAccessibilityModal(false); }} accessibilityLabel="Ativar modo escuro" accessibilityRole="button" style={{ padding: 10 }}>
                            <Text style={{ color: '#333', fontWeight: 'bold' }}>Modo escuro</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setTheme('default'); setShowAccessibilityModal(false); }} accessibilityLabel="Restaurar tema padrão" accessibilityRole="button" style={{ padding: 10 }}>
                            <Text style={{ color: '#FF6B6B', fontWeight: 'bold' }}>Tema padrão</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowAccessibilityModal(false)} accessibilityLabel="Fechar opções de acessibilidade" accessibilityRole="button" style={{ padding: 10, marginTop: 10 }}>
                            <Text style={{ color: '#f44336', fontWeight: 'bold' }}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
}