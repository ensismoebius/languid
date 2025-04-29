import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';
import logoutButtonStyles from '../css/logout_button_css';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LogoutButton = () =>
{
    const { logout } = useContext(AuthContext);
    const router = useRouter();

    const handleLogout = async () =>
    {
        await logout();
        router.replace('/'); // Redirect to login/index
    };

    return (
        <TouchableOpacity style={logoutButtonStyles.button} onPress={handleLogout} accessibilityLabel="Sair">
            <MaterialCommunityIcons name="door-open" size={24} color="#fff" />
        </TouchableOpacity>
    );
};

export default LogoutButton;
