import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  return (
    <SafeAreaView className="bg-primary flex-1 px-10">
      <View className="flex justify-center items-center flex-1 flex-col gap-5">
        <Text className="text-gray-500 text-base">Profile</Text>
      </View>
    </SafeAreaView>
  );
};

export default Profile;