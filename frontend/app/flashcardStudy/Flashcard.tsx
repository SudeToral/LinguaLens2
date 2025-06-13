import React, { useEffect, useState } from "react";
import { Pressable, Text, TouchableOpacity, View, Image } from "react-native";
import { ScreenStackHeaderLeftView } from "react-native-screens";

type FlashCardProps = {
  frontText: string;
  frontImageUri: string;
  backText: string;
  backSentences: string;
  goodFunction: () => void;
  retryFunction: () => void;
};

const FlashCard = ({ frontText, frontImageUri, backText, backSentences, goodFunction, retryFunction }: FlashCardProps) => {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
    }, [frontText, frontImageUri, backText, backSentences]);
  return (
    !flipped ? (
    <Pressable onPress={() => setFlipped(!flipped)} className="w-11/12 h-4/6 rounded-3xl bg-support p-4">
        <View className="items-center flex-1">
            <Image source={{ uri: frontImageUri }} className="w-full h-3/4 rounded-lg mb-4" resizeMode="contain" />
            <Text className="text-black text-center text-4xl font-bold">{frontText}</Text>
        </View>
    </Pressable>
    ) : (
    <>
    <View className="w-11/12 h-4/6 rounded-3xl bg-support p-4">
        <View className="items-center flex-1">
            {/* backImageUri && (
            <Image source={{ uri: backImageUri }} className="w-full h-3/4 rounded-lg mb-4" resizeMode="contain" />
            ) */}
            <Text className="text-black text-center mt-10 text-4xl font-bold mb-5">{backText}</Text>
            <Text className="text-black text-center mt-4 text-xl font-semibold">Example Sentences</Text>
            <Text className="text-black text-center mt-4 text-lg leading-loose">{backSentences || "No sentences available."}
            </Text>
        </View>
    </View>
    <View className="flex mt-5 items-center flex-row">
        <TouchableOpacity className="px-14 py-8 bg-secondary m-6 rounded-3xl" onPress={retryFunction}> 
            <Text className="text-black text-center text-2xl font-bold">Again</Text>
        </TouchableOpacity>
        <TouchableOpacity className="px-14 py-8 bg-tertiary m-6 rounded-3xl" onPress={goodFunction}> 
            <Text className="text-black text-center text-2xl font-bold">Good</Text>
        </TouchableOpacity>
    </View>
    </>
    )
    
  );
};

export default FlashCard;