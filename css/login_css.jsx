import { Platform } from "react-native";

export function createStyles()
{
    return {
        passIcon:
            Platform.select({
                ios: {
                    right: 10,
                    top: 0,
                    height: 48,
                    justifyContent: 'center',
                },
                android: {
                    position: 'absolute',
                    right: 10,
                    top: 0,
                    height: 48,
                    justifyContent: 'center',
                },
                web: {
                    position: 'absolute',
                    right: 30,
                    top: -2,
                    height: 48,
                    justifyContent: 'center',
                },
            }),

        box: {
            flex: 0,
            width: 'wrap-content',
            minHeight: 250,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: 'orange',
            borderRadius: 20,
            backgroundColor: '#fff',
            padding: 20,
            margin: 10,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.5,
            shadowRadius: 3.84,
            elevation: 5,
        },
        container: {
            right: 10,
            top: 12,
            height: 24,
            justifyContent: 'flex-start',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f0f0f0',
        },
        input: {
            width: '80%',
            minWidth: 200,
            padding: 10,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: 'orange',
            borderRadius: 5,
            backgroundColor: '#fff',
            color: '#000',
            fontSize: 16,
            fontFamily: 'Arial',
            textAlign: 'left',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 5,
        },

        passwordContainer:
            Platform.select({
                ios: {
                },
                android: {
                },
                web: {
                    position: 'relative',
                    left: 15,
                },
            }),

        passwordEye: Platform.select({
            ios: {
            },
            android: {
            },
            web: {
                position: 'relative',
                left: -25,
            },
        }),

        password: {
            width: '80%',
            minWidth: 200,
            padding: 10,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: 'orange',
            borderRadius: 5,
            backgroundColor: '#fff',
            color: '#000',
            fontSize: 16,
            fontFamily: 'Arial',
            textAlign: 'left',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 5,
        },
        button: {
            backgroundColor: '#007BFF',
            padding: 10,
            borderRadius: 5,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
        },
    };
}
