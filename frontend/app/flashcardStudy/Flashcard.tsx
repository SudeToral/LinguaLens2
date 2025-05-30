import React, { useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

type FlashCardProps = {
  frontText: string;
  frontImageUri: string;
  backText: string;
  backImageUri?: string;
};

const FlashCard = ({ frontText, frontImageUri, backText, backImageUri }: FlashCardProps) => {
  const [flipped, setFlipped] = useState(false);

  return (
    !flipped ? (
    <Pressable onPress={() => setFlipped(!flipped)} className="w-11/12 h-4/6 rounded-xl bg-gray-800 p-4">
        <View className="items-center flex-1">
            {/* <Image source={{ uri: frontImageUri }} className="w-full h-3/4 rounded-lg mb-4" resizeMode="contain" /> */}
            <View className="w-5/6 aspect-square bg-gray-600 rounded-lg mb-24" />
            <Text className="text-white text-center text-4xl font-bold">{frontText}</Text>
        </View>
    </Pressable>
    ) : (
    <>
    <View className="w-11/12 h-4/6 rounded-xl bg-gray-800 p-4">
        <View className="items-center flex-1">
            {/* backImageUri && (
            <Image source={{ uri: backImageUri }} className="w-full h-3/4 rounded-lg mb-4" resizeMode="contain" />
            ) */}
            <Text className="text-white text-center mt-10 text-4xl font-bold mb-5">{backText}</Text>
            <Text className="text-white text-center mt-4 text-xl font-semibold">Example Sentences</Text>
            <Text className="text-white text-center mt-4 text-lg leading-loose">Lorem ipsum dolor sit amet, consectetur adipiscing elit. {"\n"}
            Donec sollicitudin vel lorem in dignissim.{"\n"}
            Etiam lectus arcu, semper sit amet porttitor id, luctus quis sapien.
            </Text>
        </View>
    </View>
    <View className="flex mt-5 items-center flex-row">
        <TouchableOpacity className="px-14 py-8 bg-red-700 m-6"> 
            <Text className="text-white text-center text-2xl font-bold">Again</Text>
        </TouchableOpacity>
        <TouchableOpacity className="px-14 py-8 bg-green-700 m-6"> 
            <Text className="text-white text-center text-2xl font-bold">Good</Text>
        </TouchableOpacity>
    </View>
    </>
    )
    
  );
};

export default FlashCard;