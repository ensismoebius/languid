import React, { createContext, useState, useEffect } from 'react';
import * as Keychain from 'react-native-keychain';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) =>
{
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = async (username, password) =>
    {
        // Call your backend login API here
        const token = 'example-token-from-api';
        await Keychain.setGenericPassword('user', token);
        setUserToken(token);
    };

    const logout = async () =>
    {
        await Keychain.resetGenericPassword();
        setUserToken(null);
    };

    const checkLoginStatus = async () =>
    {
        try
        {
            const creds = await Keychain.getGenericPassword();
            if (creds) setUserToken(creds.password);
        } catch (e)
        {
            console.log('No token found');
        }
        setIsLoading(false);
    };

    useEffect(() =>
    {
        checkLoginStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ login, logout, userToken, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
