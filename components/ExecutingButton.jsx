import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

export default function ExecutingButton({ styles, handleRunCode, executing })
{
    return (
        <TouchableOpacity
            style={styles.button}
            onPress={handleRunCode}
            disabled={executing}
            accessibilityLabel="Executar código"
        >
            {executing ? (
                <ActivityIndicator size="small" color="#fff" />
            ) : (
                <Text style={styles.buttonText}>Executar</Text>
            )}
        </TouchableOpacity>
    );
}