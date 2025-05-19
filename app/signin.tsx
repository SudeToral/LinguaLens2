import { useAuth } from '@/context/AuthContext';
import { Redirect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SignIn: React.FC = () => {
  const { session, signin } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async () => {
    try {
      await signin({ email, password });
    } catch (error) {
      console.log("Login failed:", error);
    }
  };

  if (session) return <Redirect href="/" />;

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.headline}>SignIn</Text>

        <Text>Email:</Text>
        <TextInput
          placeholder="Enter your email..."
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <Text>Password:</Text>
        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <TouchableOpacity onPress={() => router.replace('/signup')} style={styles.signupLink}>
          <Text style={styles.signupText}>
            Don't have an account? <Text style={styles.signupTextBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignIn;

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
  signupLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#4B5563',
  },
  signupTextBold: {
    fontWeight: 'bold',
    color: '#111827',
  },
});
