import { createStyles } from '@/css/editor_css';
import { useState, useEffect } from 'react';
import
{
    View,
    TextInput,
    ScrollView,
    Button,
    FlatList,
    Text
} from 'react-native';

export default function CodeEditor()
{
    const [code, setCode] = useState('//Digite seu código abaixo');
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const styles = createStyles();
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
        <View style={styles.container}>

            <View style={{ flexDirection: 'row' }}>
                <Button
                    title="Rodar código"
                    style={styles.button}
                />
                <FlatList
                    data={["Exercício 1", "Exercício 2", "Exercício 3"]}
                    renderItem={({ item }) => <Text>{item}</Text>}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.listView}
                />
            </View>

            <View style={{ flexDirection: 'column' }}>
                <ScrollView style={styles.wrapper}>
                    <TextInput
                        style={styles.inputCode}
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
                    style={styles.instructions}
                    multiline
                    value={instructions}
                    editable={false}
                    autoCapitalize="none"
                    autoCorrect={false}
                    spellCheck={false}
                />
            </View>
        </View>
    );
}
