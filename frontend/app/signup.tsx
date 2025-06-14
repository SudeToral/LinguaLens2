import { useAuth } from '@/context/AuthContext';
import { Redirect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import AnimatedSnackbar from "./Components/AnimatedSnackbar"; // 🔔 Snackbar bileşeni



const SignUp: React.FC = () => {
  const { isAuthenticated, register } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');

  const showSnackbar = (msg: string) => {
    setSnackMsg(msg);
    setSnackVisible(true);
  };

  const validateEmail = (email: string) =>
    /^\S+@\S+\.\S+$/.test(email);

  const handleSubmit = async () => {
    if (!username || !email || !password) {
      return showSnackbar('All fields are required.');
    }
  
    if (!validateEmail(email)) {
      return showSnackbar('Please enter a valid email address.');
    }
  
    if (password.length < 8) {
      return showSnackbar('Password must be at least 8 characters.');
    }
  
    try {
      await register(email, password, username);
  
      // ✅ Kayıt başarılı → yönlendir
      router.push("/interests?source=signup");

    } catch (error: any) {
      console.log('Registration failed:', error);
      showSnackbar(error?.message ?? 'Registration failed. Please try again.');
    }
  };
  

  if (isAuthenticated) return <Redirect href="/" />;

  return (
    <View className="flex-1 justify-center px-6 bg-primary">
      <View className="w-full">
        <Text className="text-center text-3xl font-bold italic text-black mb-10">
          Sign Up
        </Text>

        <Text className="text-base text-gray-800">Username:</Text>
        <TextInput
          placeholder="Choose a username."
          className="border border-gray-400 rounded-lg px-4 py-2 mt-2 mb-4 text-black"
          value={username}
          onChangeText={setUsername}
        />

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
          placeholder="Create a password."
          className="border border-gray-400 rounded-lg px-4 py-2 mt-2 mb-4 text-black"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          className="bg-tertiary py-3 rounded-lg items-center mt-2"
          onPress={handleSubmit}
        >
          <Text className="text-black text-lg font-semibold">Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace('/signin')}
          className="mt-6 items-center"
        >
          <Text className="text-sm text-gray-600">
            Already have an account?{' '}
            <Text className="font-bold text-gray-900 underline ">Sign In</Text>
          </Text>
          
        </TouchableOpacity>
      </View>

      {/* 🔔 Animated Snackbar */}
      <AnimatedSnackbar
        message={snackMsg}
        visible={snackVisible}
        onClose={() => setSnackVisible(false)}
      />
    </View>
  );
};

export default SignUp;