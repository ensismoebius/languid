import { StyleSheet } from 'react-native';

const logoutButtonStyles = StyleSheet.create({
    button: {
        backgroundColor: '#000',
        paddingVertical: 8,
        paddingHorizontal: 5,
        borderRadius: 5,
        alignSelf: 'flex-end',
        marginLeft: 20,
        marginRight: 30,
        marginTop: 10,
        marginBottom: 10,
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default logoutButtonStyles;
