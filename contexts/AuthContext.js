import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { API_URL, API_KEY } from '../constants/API_constants';
import md5 from 'md5';
import { Platform } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) =>
{
    const [userToken, setUserToken] = useState('');
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
                if (Platform.OS !== 'web')
                {
                    await SecureStore.setItemAsync('userToken', jsonData.token);
                } else
                {
                    localStorage.setItem('userToken', jsonData.token);
                }
                setUserToken(jsonData.token);
            }
        } catch (error)
        {
            console.error('Error during login:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        } finally
        {
            setIsLoading(false);
        }
    };

    const logout = async () =>
    {
        if (Platform.OS !== 'web')
        {
            await SecureStore.deleteItemAsync('userToken');
        } else
        {
            localStorage.removeItem('userToken');
        }
        setUserToken(null);
    };

    const checkLoginStatus = async () =>
    {
        try
        {
            if (Platform.OS !== 'web')
            {
                const token = await SecureStore.getItemAsync('userToken');
                if (token) setUserToken(token);
            } else
            {
                const token = localStorage.getItem('userToken');
                if (token) setUserToken(token);
            }
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
