import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../context/authContext';

const SignIn: React.FC = () => {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email.trim(), password);
      // On successful login, navigate into the tabs layout (index)
      router.replace('/');
    } catch (err) {
      console.error('Login failed:', err);
      Alert.alert('Error', 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title={loading ? 'Signing In...' : 'Sign In'} onPress={handleLogin} disabled={loading} />
      <Text onPress={() => router.push('/signup')} style={styles.link}>
        Don't have an account? Sign up
      </Text>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  input: { borderBottomWidth: 1, marginBottom: 20, padding: 8 },
  link: { marginTop: 20, color: 'blue', textAlign: 'center' },
});
