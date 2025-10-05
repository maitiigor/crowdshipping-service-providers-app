// src/screens/Onboarding.tsx
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

type Slide = {
  id: string;
  title: string;
  description: string;
  image: any; // require() for local images or URL
};

const slides: Slide[] = [
  {
    id: "1",
    title: "Drive. Deliver. Earn.",
    description:
      "Join trusted drivers. Accept deliveries, follow routes, and get paid instantly.",
    image: require("../../../assets/images/delivery1.png"), // 👈 put your illustration here
  },
  {
    id: "2",
    title: "Your Journey, Your Earnings",
    description:
      "Turn your vehicle into a money making machine. Pick up packages, deliver with ease, every trip.",
    image: require("../../../assets/images/delivery2.png"),
  },
  {
    id: "3",
    title: "Deliver Across Land, Air & Water",
    description:
      "From city streets to river crossings, every trip is an adventure. Deliver packages.",
    image: require("../../../assets/images/delivery3.png"),
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isTermsAccepted, setIsTermsAccepted] = useState<boolean>(false);
  const flatListRef = useRef<FlatList<Slide>>(null);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(index);
  };

  const renderItem: ListRenderItem<Slide> = ({ item }) => (
    <View
      className="flex-1 items-center justify-center px-6"
      style={{ width }}
    >
      <Image
        source={item.image}
        className="flex-1 items-baseline h-full w-full max-w-sm"
        resizeMode="contain"
      />
    </View>
  );

  return (
    <SafeAreaView className="flex h-100 bg-white">
      {/* TOP (slides) */}
      <View className="h-1/2">
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
        />
      </View>

      {/* BOTTOM (content + buttons + terms) */}
      <View className="h-1/2 px-6 pb-2 ">
        {/* Title and Description */}
        <View className="items-center pt-4">
          <Text className="text-[26px] font-poppins-light text-center mb-4">
            {slides[currentSlide].title}
          </Text>
          <Text className="text-base text-gray-600 text-center px-2 leading-6 mb-6">
            {slides[currentSlide].description}
          </Text>

          {/* Dot indicators */}
          <View className="flex-row justify-center mt-6 gap-1 mb-6 space-x-2">
            {slides.map((_, index) => (
              <View
                key={index}
                className={`h-3 w-3 rounded-full ${index === currentSlide ? 'bg-[#E75B3B]' : 'bg-gray-300'
                  }`}
              />
            ))}
          </View>
        </View>

        {/* Bottom Section */}
        <View>
          {/* Buttons */}
          <View className="space-y-4 gap-3 mb-4">
            <TouchableOpacity
              className="bg-[#E75B3B] py-4 rounded-xl"
              onPress={() => router.push("/screens/onboarding/login")}
            >
              <Text className="text-white text-center font-semibold text-base">
                Login
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white border border-[#E75B3B] py-4 rounded-xl"
              onPress={() => router.push("/screens/onboarding/welcome")}
            >
              <Text className="text-[#E75B3B] text-center font-semibold text-base">
                Get Started
              </Text>
            </TouchableOpacity>
          </View>

          {/* Terms with checkbox */}
          <View className="flex-row items-start px-2">
            <TouchableOpacity
              onPress={() => setIsTermsAccepted(!isTermsAccepted)}
              className="w-4 h-4 border border-gray-400 rounded mr-3 mt-0.5 items-center justify-center"
              style={{
                backgroundColor: isTermsAccepted ? '#E75B3B' : 'transparent',
                borderColor: isTermsAccepted ? '#E75B3B' : '#9CA3AF',
              }}
            >
              {isTermsAccepted && (
                <Text className="text-white text-xs font-bold">✓</Text>
              )}
            </TouchableOpacity>
            <Text className="text-xs text-gray-500 flex-1 leading-4">
              By signing up, you consent to our{" "}
              <Text
                className="text-gray-700 underline"
                onPress={() => router.push("/screens/onboarding/terms-conditions")}
              >
                Terms
              </Text> and how we use
              your data in our{" "}
              <Text
                className="text-gray-700 underline"
                onPress={() => router.push("/screens/onboarding/privacy-policy")}
              >
                Privacy Policy
              </Text>.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}