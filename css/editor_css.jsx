import { Platform, StyleSheet } from "react-native";

export function createStyles()
{
    return StyleSheet.create({
        wrapper: {
            backgroundColor: '#1e1e1e',
            flex: 1,  // Changed from height: '60%'
            borderRadius: 5,
        },
        container: {
            flex: 1,  // This will now fill the wrapper completely
            justifyContent: 'center',
            padding: 12,
            minHeight: 400,
            flexDirection: 'column',
        },
        // ... rest of your styles remain the same
        button: {
            backgroundColor: '#007BFF',
            padding: 10,
            borderRadius: 5,
            maxHeight: 50,
            width: '50%',
        },
        listView: {
            flex: 1,
            backgroundColor: 'orange',
            marginLeft: 3,
            marginBottom: 3,
            marginRight: 3,
            borderRadius: 5,
            padding: 5,
            width: '50%',
            maxHeight: 50,
        },
        instructions: {
            height: '40%',
        },
        inputCode: {
            color: 'white',
            fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
            padding: 10,
            minHeight: 400,
            textAlignVertical: 'top',
            marginTop: 3,
        },
    });
}