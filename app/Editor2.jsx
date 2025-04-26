import React, { useState } from 'react';
import
{
    View,
    TouchableOpacity,
    Text,
    FlatList,
    ScrollView,
    TextInput,
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const App = () =>
{
    const exercises = ['Exe 01', 'Exe 02'];
    const screenHeight = Dimensions.get('window').height;
    const headerHeight = 80;

    const [selection, setSelection] = useState({ start: 0, end: 0 });

    const [code, setCode] = useState('//Digite seu código abaixo');
    const [currentExercise, setCurrentExercise] = useState(0);
    const [instructions, setInstructions] = useState('Crie a função principal e a faça retornar 0');


    const handleKeyPress = ({ nativeEvent }) =>
    {
        if (nativeEvent.key === 'Tab')
        {
            nativeEvent.preventDefault?.(); // no-op on RN but safe
            const before = code.slice(0, selection.start);
            const after = code.slice(selection.end);
            const newText = before + '    ' + after;
            const newCursorPos = selection.start + 4;

            setCode(newText);
            setSelection({ start: newCursorPos, end: newCursorPos });
        }
    };

    return (
        <LinearGradient
            colors={['#FF6B6B', '#FF8E53', '#FFAF40']} // Orange gradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            {/* Header Section */}
            <View style={[styles.header, { height: headerHeight }]}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Executar</Text>
                </TouchableOpacity>
                <FlatList
                    data={exercises}
                    horizontal
                    renderItem={({ item }) => (
                        <View style={styles.exerciseItem}>
                            <Text>{item}</Text>
                        </View>
                    )}
                    keyExtractor={(item) => item}
                    contentContainerStyle={styles.flatListContent}
                />
                <Text>{currentExercise}/{exercises.length}</Text>
            </View>

            {/* TextInputs Section */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={{ height: screenHeight * 2 }}
            >
                <TextInput
                    style={[styles.inputCode, { height: screenHeight * 0.7 }]}
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
            </ScrollView>
            <TextInput
                style={[styles.instructions, { height: screenHeight * 0.3 }]}
                multiline
                value={instructions}
                editable={false}
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
            />
        </LinearGradient>
    );
};

// Updated styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'orange',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    button: {
        padding: 10,
        backgroundColor: '#f00',
        borderRadius: 5,
        maxHeight: 50,
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.7,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    exerciseItem: {
        padding: 10,
        marginLeft: 10,
        backgroundColor: '#eee',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.7,
        shadowRadius: 5,
        elevation: 5,
    },
    flatListContent: {
        paddingRight: 15,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        maxHeight: 50,
        marginLeft: 3,
        marginBottom: 3,
        marginRight: 3,
        borderRadius: 5,
        padding: 5,
        width: '50%',
        maxHeight: 50,
    },
    scrollView: {
        flex: 1,
        marginTop: 80, // Should match headerHeight
    },
    inputCode: {
        color: 'white',
        fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
        padding: 5,
        minHeight: 400,
        textAlignVertical: 'top',
        marginTop: 0,
        backgroundColor: '#1e1e1e',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    instructions: {
        width: '100%',
        padding: 5,
        borderWidth: 0,
        color: '#000',
        shadowColor: '#000',
        borderRadius: 10,
        backgroundColor: 'white',
        marginTop: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.7,
        shadowRadius: 5,
        elevation: 5,
    },
});

export default App;