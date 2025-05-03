import React, { useContext, useState } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { AuthContext } from '@/contexts/AuthContext';
import { createStyles } from '@/css/login_css';
import { useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Feather';

export default function LoginScreen()
{
  const styles = createStyles();

  const { login, userToken } = useContext(AuthContext);
  const router = useRouter();

  React.useEffect(() =>
  {
    if (userToken)
    {
      router.replace('/Editor');
    }
  }, [userToken]);

  const [username, setUser] = useState('');
  const [password, setPass] = useState('');
  const [hidden, setHidden] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function checkLogin()
  {
    setLoading(true);
    setError(null);

    try
    {
      await login(username, password);
      // Navigation will be handled by useEffect when userToken updates
    } catch (err)
    {
      setError('Invalid login credentials');
    } finally
    {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Informe login e senha</Text>
        <TextInput
          placeholder="login"
          onChangeText={setUser}
          style={styles.input}
          accessibilityLabel="Campo de login"
          accessibilityRole="text"
          accessible
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="senha"
            secureTextEntry={hidden}
            onChangeText={setPass}
            style={styles.password}
            accessibilityLabel="Campo de senha"
            accessibilityRole="text"
            accessible
          />
          <TouchableOpacity
            onPress={() => setHidden(!hidden)}
            style={styles.passIcon}
            accessibilityLabel={hidden ? "Mostrar senha" : "Ocultar senha"}
            accessibilityRole="button"
            accessible
          >
            <Icon name={hidden ? "eye-off" : "eye"} size={20} style={styles.passwordEye} />
          </TouchableOpacity>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        {loading ? (
          <ActivityIndicator />
        ) : (
          <Button title="Entrar" onPress={checkLogin} />
        )}
      </View>
    </View>
  );
}

