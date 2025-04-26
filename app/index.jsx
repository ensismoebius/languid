import React, { useContext, useState } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator, TouchableOpacity } from 'react-native';

import { createStyles } from '@/css/login_css';
import { useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Feather';

export default function LoginScreen()
{
  const router = useRouter();
  const styles = createStyles();

  const [username, setUser] = useState('');
  const [password, setPass] = useState('');
  const [hidden, setHidden] = useState(true);
  const [loading, setLoading] = useState(false);

  async function checkLogin()
  {
    setLoading(true);

    // Erase when implemented
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(500); // 2-second delay

    if (username === "" && password === "")
    {
      router.push('/Editor');
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
        />

        <View style={{ position: 'relative' }}>
          <TextInput
            placeholder="senha"
            secureTextEntry={hidden}
            onChangeText={setPass}
            style={styles.password}
          />
          <TouchableOpacity
            onPress={() => setHidden(!hidden)}
            style={styles.passIcon}
          >
            <Icon name={hidden ? "eye-off" : "eye"} size={20} />
          </TouchableOpacity>
        </View>


        {
          loading ?
            (<ActivityIndicator></ActivityIndicator>) :
            (<Button title="Entrar" onPress={checkLogin} />)
        }
      </View>
    </ View >
  );
}

