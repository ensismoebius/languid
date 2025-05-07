import { Dimensions, Platform, StyleSheet } from "react-native";

export function createStyles(headerHeight, themeState)
{
    switch (themeState)
    {
        case 'dark':
            return createStylesDark(headerHeight);
            break;
        case 'light':
            return createStylesLight(headerHeight);
            break;
        case 'high-contrast':
            return createStylesHighContrast(headerHeight);
            break;

        default:
            return createStylesDark(headerHeight);
            break;
    }

}

function createStylesLight(headerHeight)
{
    return StyleSheet.create(
        {
            editorContainer: {
                position: 'relative',
                top: 0,
                minHeight: Dimensions.get('window').height * 0.6 - 100,
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
                minHeight: Dimensions.get('window').height * 0.4 - 100,
            },
            instructionsText: {
                fontSize: 20,
                color: '#333',
            },
            handle: {
                width: 200,
                height: 5,
                borderRadius: 3,
                backgroundColor: '#000',
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
                        margin: 3,
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
        }
    );
}

function createStylesDark(headerHeight)
{
    return StyleSheet.create({
        editorContainer: {
            position: 'relative',
            top: 0,
            minHeight: Dimensions.get('window').height * 0.6 - 100,
            marginBottom: 1,
            borderWidth: 0,
        },
        container: {
            flex: 1,
            padding: 5,
            backgroundColor: '#121212',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 10,
            backgroundColor: '#1f1f1f',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
        },
        button: {
            padding: 10,
            backgroundColor: '#bb86fc',
            borderRadius: 5,
            maxHeight: 50,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 5,
            width: '30%',
        },
        buttonText: {
            color: '#121212',
            fontSize: 16,
            fontWeight: 'bold',
        },
        exerciseItem: {
            padding: 5,
            marginLeft: 6,
            backgroundColor: '#2c2c2c',
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 5,
        },
        selectedExercise: {
            backgroundColor: '#000',
        },
        exerciseText: {
            color: '#e0e0e0',
            fontWeight: 'bold',
            fontSize: 15,
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
            color: '#ffffff',
            borderColor: '#ffffff30',
            textAlignVertical: 'top',
            backgroundColor: '#1e1e1e',
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
            shadowOpacity: 0.5,
            shadowColor: '#000',
            backgroundColor: '#2b2b2b',
            shadowOffset: { width: 0, height: 2 },
            minHeight: Dimensions.get('window').height * 0.4 - 100,
        },
        instructionsText: {
            fontSize: 20,
            color: '#ddd',
        },
        handle: {
            width: 200,
            height: 5,
            borderRadius: 3,
            backgroundColor: '#fff',
            margin: 0,
        },
        horizontalHandleDimentions: Platform.select({
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
                height: 15,
            },
            web: {
                width: '100%',
                alignItems: 'center',
                margin: 3,
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
            backgroundColor: '#2c2c2c',
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
            color: '#e0e0e0',
            fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
            fontSize: 14,
        },
    });
}

function createStylesHighContrast(headerHeight)
{
    return StyleSheet.create(
        {
            editorContainer: {
                position: 'relative',
                top: 0,
                minHeight: Dimensions.get('window').height * 0.6 - 100,
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
                backgroundColor: '#000', // fundo preto
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1,
            },
            button: {
                padding: 10,
                backgroundColor: '#FFD700', // amarelo forte
                borderRadius: 5,
                maxHeight: 50,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 5,
                elevation: 5,
                width: '30%',
            },
            buttonText: {
                color: '#000', // texto preto sobre amarelo
                fontSize: 16,
                fontWeight: 'bold',
            },
            exerciseItem: {
                padding: 5,
                marginLeft: 6,
                backgroundColor: '#000',
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#fff',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 5,
                elevation: 5,
            },
            selectedExercise: {
                backgroundColor: '#000', // realce
                borderWidth: 5,
                borderColor: '#FFD700',
            },
            exerciseText: {
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 15
            },
            exerciseCounter: {
                color: '#FFD700',
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
                fontSize: 22,
                lineHeight: 24,
                borderRadius: 10,
                color: '#FFFF00',
                borderColor: '#FFFF00',
                textAlignVertical: 'top',
                backgroundColor: '#000',
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
                shadowOpacity: 0.8,
                shadowColor: '#000',
                backgroundColor: '#fff',
                shadowOffset: { width: 0, height: 2 },
                minHeight: Dimensions.get('window').height * 0.4 - 100,
            },
            instructionsText: {
                fontWeight: 'bold',
                fontSize: 20,
                color: '#000',
            },
            handle: {
                width: 200,
                height: 5,
                borderRadius: 3,
                backgroundColor: '#FFD700',
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
                        margin: 3,
                    },
                }),
            consoleContainer: {
                backgroundColor: '#000',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#FFD700',
                marginBottom: 0,
            },
            consoleHeader: {
                backgroundColor: '#FFD700',
                padding: 10,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
            },
            consoleTitle: {
                color: '#000',
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
                color: '#FFD700',
                fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
                fontSize: 14,
            },
        }
    );
}
