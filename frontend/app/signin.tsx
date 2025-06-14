import { useAuth } from '@/context/AuthContext';
import { Redirect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import AnimatedSnackbar from "./Components/AnimatedSnackbar"; // ✅ import et

const SignIn: React.FC = () => {
  const { session, signin } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');

  const showSnackbar = (msg: string) => {
    setSnackMsg(msg);
    setSnackVisible(true);
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      showSnackbar('Please enter both email and password.');
      return;
    }

    try {
      await signin({ email, password });
    } catch (error: any) {
      console.log('Login failed:', error);
      showSnackbar(error?.message ?? 'Login failed. Please try again.');
    }
  };

  if (session) return <Redirect href="/" />;

  return (
    <View className="flex-1 justify-center px-6 bg-primary">
      <View className="w-full">
        <Text className="text-center text-3xl font-bold italic text-black mb-10">
          Sign In
        </Text>

        <Text className="text-base text-gray-800">Email:</Text>
        <TextInput
          placeholder="Enter your email."
          className="border border-gray-400 rounded-lg px-4 py-2 mt-2 mb-4 text-black"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text className="text-base text-gray-800">Password:</Text>
        <TextInput
          placeholder="Enter your password."
          className="border border-gray-400 rounded-lg px-4 py-2 mt-2 mb-4 text-black"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          className="bg-tertiary py-3 rounded-lg items-center mt-2"
          onPress={handleSubmit}
        >
          <Text className="text-black text-lg font-semibold">Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace('/signup')}
          className="mt-6 items-center"
        >
          <Text className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Text className="font-bold text-gray-900 underline">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Snackbar uyarı bileşeni */}
      <AnimatedSnackbar
        message={snackMsg}
        visible={snackVisible}
        onClose={() => setSnackVisible(false)}
      />
    </View>
  );
};

export default SignIn;