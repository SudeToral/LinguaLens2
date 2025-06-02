import React, { useEffect, useRef } from "react";
import { Animated, Text } from "react-native";

const AnimatedSnackbar = ({
  message,
  visible,
  onClose,
}: {
  message: string;
  visible: boolean;
  onClose: () => void;
}) => {
  const slideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timeout = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onClose();
        });
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      className="absolute bottom-40 self-center bg-blue-400 px-6 py-3 rounded-lg shadow-lg z-100 max-w-[90%]"
      style={{
        transform: [{ translateY: slideAnim }], // ✅ doğru kullanım bu
      }}
    >
      <Text className="text-black font-semibold text-center">{message}</Text>
    </Animated.View>
  );
};

export default AnimatedSnackbar;
