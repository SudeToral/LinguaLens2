import { useAuth } from '@/context/AuthContext';
import { Redirect, useRouter } from 'expo-router'; // ✅ router import edildi
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SignUp: React.FC = () => {
  const { isAuthenticated, register } = useAuth();
  const router = useRouter(); // ✅ yönlendirme için router kullanımı

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  const handleSubmit = async () => {
    try {
      await register(email, password, username);
    } catch (error) {
      console.log("Registration failed:", error);
    }
  };

  if (isAuthenticated) return <Redirect href="/" />;

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.headline}>SignUp</Text>

        <Text>Username:</Text>
        <TextInput
          placeholder="Choose a username..."
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />

        <Text>Email:</Text>
        <TextInput
          placeholder="Enter your email..."
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <Text>Password:</Text>
        <TextInput
          placeholder="Create a password..."
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        {/* 👇 Sign In yönlendirmesi */}
        <TouchableOpacity onPress={() => router.replace('/signin')} style={styles.signinLink}>
          <Text style={styles.signinText}>
            Already have an account? <Text style={styles.signinTextBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  headline: {
    textAlign: 'center',
    marginTop: -100,
    marginBottom: 50,
    fontWeight: '700',
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    borderColor: 'grey',
  },
  button: {
    backgroundColor: 'black',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  signinLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  signinText: {
    fontSize: 14,
    color: '#4B5563',
  },
  signinTextBold: {
    fontWeight: 'bold',
    color: '#111827',
  },
});
