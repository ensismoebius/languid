import { Dimensions, Platform, StyleSheet } from "react-native";

export function createStyles(headerHeight)
{
    return StyleSheet.create({
        editorContainer: {
            position: 'relative',
            top: 0,
            minHeight: Dimensions.get('window').height * 0.7 - 100,
            marginBottom: 1,
            borderWidth: 0,
        },
        container: {
            flex: 1,
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
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.7,
            shadowRadius: 5,
            elevation: 5,
            width: '30%',
        },
        buttonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
        },
        exerciseItem: {
            padding: 5,
            marginLeft: 6,
            backgroundColor: '#eee',
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.7,
            shadowRadius: 5,
            elevation: 5,
        },
        selectedExercise: {
            backgroundColor: '#4CAF50',
        },
        exerciseText: {
            color: '#333',
            fontWeight: 'bold',
            fontSize: 15
        },
        exerciseCounter: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 15,
            marginLeft: 10,
        },
        flatListContent: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingRight: 1,
            marginLeft: 3,
            marginBottom: 3,
            marginRight: 3,
            borderRadius: 5,
        },
        scrollView: {
            flex: 1,
            marginTop: headerHeight,
        },
        scrollContent: {
            paddingBottom: 20,
        },
        inputCode: {
            fontSize: 16,
            lineHeight: 24,
            borderRadius: 10,
            color: 'white',
            borderColor: '#ffffff30',
            textAlignVertical: 'top',
            backgroundColor: '#1e1e1e',
            minHeight: Dimensions.get('window').height * 0.5 - 100,
            fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
        },
        instructions: {
            width: '100%',
            padding: 15,
            elevation: 5,
            marginTop: 0,
            lineHeight: 24,
            shadowRadius: 5,
            borderRadius: 10,
            shadowOpacity: 0.7,
            shadowColor: '#000',
            backgroundColor: 'white',
            shadowOffset: { width: 0, height: 2 },
            minHeight: Dimensions.get('window').height * 0.3 - 100,
        },
        instructionsText: {
            fontSize: 20,
            color: '#333',
        },
        handle: {
            width: 150,
            height: 5,
            borderRadius: 3,
            backgroundColor: '#aaa',
            margin: 0,
        },
        horizontalHandleDimentions:
            Platform.select({
                ios: {
                    width: '100%',
                    alignItems: 'center',
                    margin: 0,
                    height: 15,
                },
                android: {
                    width: '100%',
                    alignItems: 'center',
                    margin: 0,
                    height: 15
                },
                web: {
                    width: '100%',
                    alignItems: 'center',
                    margin: 0,
                },
            }),
        consoleContainer: {
            backgroundColor: '#1e1e1e',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#ffffff30',
            marginBottom: 0,
        },
        consoleHeader: {
            backgroundColor: '#333',
            padding: 10,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
        },
        consoleTitle: {
            color: '#fff',
            fontWeight: 'bold',
        },
        consoleOutput: {
            maxHeight: 150,
            padding: 10,
        },
        consoleContent: {
            flexGrow: 1,
        },
        consoleText: {
            color: '#fff',
            fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
            fontSize: 14,
        },
    });
}