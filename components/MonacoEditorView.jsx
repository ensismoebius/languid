import React, { useEffect, useRef } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { MONACO_URL } from '../constants/API_constants';

export default function MonacoEditorView(
    { style, code = '', setCode }
)
{
    const iframeRef = useRef(null);

    // SEND CODE TO iframe WHEN MOUNTED OR CODE CHANGES
    useEffect(() =>
    {
        if (Platform.OS !== 'web') return;

        const iframe = iframeRef.current;
        if (!iframe || !iframe.contentWindow) return;

        // Send initial code after iframe is ready
        function sendCode()
        {
            iframe.contentWindow.postMessage(
                JSON.stringify(
                    {
                        type: 'setCode',
                        code: code
                    }
                ),
                '*'
            );
        };

        // Wait briefly to ensure iframe is loaded
        const timeout = setTimeout(sendCode, 250);
        return () => clearTimeout(timeout);
    }, [code]);

    // RECEIVE CODE CHANGES FROM iframe
    useEffect(() =>
    {
        if (Platform.OS !== 'web') return;

        function handleMessage(event)
        {
            try
            {
                const msg = JSON.parse(event.data);

                if (msg.type === 'codeChange' && typeof msg.code === 'string')
                {
                    setCode?.(msg.code);
                }
            } catch { }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [setCode]);

    if (Platform.OS !== 'web') return null;

    return (
        <View style={style}>
            <iframe
                ref={iframeRef}
                src={MONACO_URL}
                style={styles.webFrame}
                title="Monaco Editor"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    webFrame: {
        border: 'none',
        width: '100%',
        height: '100%',
    },
});
