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
import ParallaxScrollView from "../../../components/ParallaxScrollView";
import { ThemedView } from "../../../components/ThemedView";
import { ThemedText } from "../../../components/ThemedText";

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
    <ThemedView
      className="flex-1 items-center justify-center px-6"
      style={{ width }}
    >
      <Image
        source={item.image}
        className="flex-1 items-baseline h-full w-full max-w-sm"
        resizeMode="contain"
      />
    </ThemedView>
  );

  return (
    <ParallaxScrollView headerBackgroundColor={{ light: "white", dark: "#353636" }}>
      {/* TOP (slides) */}
      <ThemedView className="h-1/2">
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
      </ThemedView>

      {/* BOTTOM (content + buttons + terms) */}
      <ThemedView className="h-1/2 px-6 pb-2 ">
        {/* Title and Description */}
        <ThemedView className="items-center pt-4">
          <ThemedText className="text-[26px] font-poppins-light text-center mb-4">
            {slides[currentSlide].title}
          </ThemedText>
          <ThemedText className="text-base text-gray-600 text-center px-2 leading-6 mb-6">
            {slides[currentSlide].description}
          </ThemedText>

          {/* Dot indicators */}
          <ThemedView className="flex-row justify-center mt-6 gap-1 mb-6 space-x-2">
            {slides.map((_, index) => (
              <View
                key={index}
                className={`h-3 w-3 rounded-full ${index === currentSlide ? 'bg-[#E75B3B]' : 'bg-gray-300'
                  }`}
              />
            ))}
          </ThemedView>
        </ThemedView>

        {/* Bottom Section */}
        <ThemedView>
          {/* Buttons */}
          <ThemedView className="space-y-4 gap-3 mb-4">
            <TouchableOpacity
              className="bg-[#E75B3B] py-4 rounded-xl"
              onPress={() => router.push("/screens/onboarding/login")}
            >
              <ThemedText className="text-white text-center font-semibold text-base">
                Login
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white border border-[#E75B3B] py-4 rounded-xl"
              onPress={() => router.push("/screens/onboarding/welcome")}
            >
              <ThemedText className="text-[#E75B3B] text-center font-semibold text-base">
                Get Started
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* Terms with checkbox */}
          <ThemedView className="flex-row items-start px-2">
            <TouchableOpacity
              onPress={() => setIsTermsAccepted(!isTermsAccepted)}
              className="w-4 h-4 border border-gray-400 rounded mr-3 mt-0.5 items-center justify-center"
              style={{
                backgroundColor: isTermsAccepted ? '#E75B3B' : 'transparent',
                borderColor: isTermsAccepted ? '#E75B3B' : '#9CA3AF',
              }}
            >
              {isTermsAccepted && (
                <ThemedText className="text-white text-xs font-bold">✓</ThemedText>
              )}
            </TouchableOpacity>
            <ThemedText className="text-xs text-gray-500 flex-1 leading-4">
              By signing up, you consent to our{" "}
              <ThemedText
                className="text-gray-700 underline"
                onPress={() => router.push("/screens/onboarding/terms-conditions")}
              >
                Terms
            </ThemedText> and how we use
            your data in our{" "}
            <ThemedText
              className="text-gray-700 underline"
              onPress={() => router.push("/screens/onboarding/privacy-policy")}
            >
              Privacy Policy
            </ThemedText>.
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
    </ParallaxScrollView >
  );
}