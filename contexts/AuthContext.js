import React, { createContext, useState, useEffect } from 'react';
import * as Keychain from 'react-native-keychain';
import { API_URL, API_KEY } from '../constants/API_constants';
import md5 from 'md5';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) =>
{
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = async (username, password) =>
    {
        try
        {
            const hashedPassword = md5(password);
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": API_KEY,
                },
                body: JSON.stringify({
                    username: username,
                    password: hashedPassword
                }),
            });

            if (!response.ok)
            {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const jsonData = await response.json();

            if (jsonData.token)
            {
                await Keychain.setGenericPassword('user', jsonData.token);
                setUserToken(jsonData.token);
            }
        } catch (error)
        {
            console.error('Error during login:', error);
        } finally
        {
            setIsLoading(false);
        }
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
