import { StyleSheet } from 'react-native';


export function logoutButtonStyles(themeState)
{
    switch (themeState)
    {
        case 'dark':
            return logoutButtonStylesDark();
            break;
        case 'light':
            return logoutButtonStylesLight();
            break;
        case 'high-contrast':
            return logoutButtonStylesHighContrast();
            break;

        default:
            return logoutButtonStylesDark();
            break;
    }

}

function logoutButtonStylesLight()
{
    return StyleSheet.create(
        {
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
        }
    );
}

function logoutButtonStylesDark()
{
    return StyleSheet.create(
        {
            button: {
                backgroundColor: '#1a1a1a',
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
                color: '#f2f2f2',
                fontWeight: 'bold',
                fontSize: 16,
            },
        }
    );
}

function logoutButtonStylesHighContrast()
{
    return StyleSheet.create(
        {
            button: {
                backgroundColor: '#000000', // preto absoluto
                paddingVertical: 8,
                paddingHorizontal: 5,
                borderRadius: 5,
                alignSelf: 'flex-end',
                marginLeft: 20,
                marginRight: 30,
                marginTop: 10,
                marginBottom: 10,
                borderWidth: 2,
                borderColor: '#FFFF00', // amarelo vivo para alto contraste
            },
            text: {
                color: '#FFFF00', // texto em amarelo vivo
                fontWeight: 'bold',
                fontSize: 18, // ligeiramente maior
            },
        }
    );
}
