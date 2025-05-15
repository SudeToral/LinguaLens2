import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Settings = () => {
  return (
    <SafeAreaView className="bg-primary flex-1 px-10">
      <View className="flex justify-center items-center flex-1 flex-col gap-5">
        <Text className="text-gray-500 text-base">Settings</Text>
      </View>
    </SafeAreaView>
  );
};

export default Settings;