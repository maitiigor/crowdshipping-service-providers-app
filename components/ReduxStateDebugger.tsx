import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useAppSelector } from '../store';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

export default function ReduxStateDebugger() {
  const [isVisible, setIsVisible] = useState(false);
  const auth = useAppSelector((state) => state.auth);
  const state = { auth }; // Only show relevant parts

  if (!__DEV__) {
    return null; // Only show in development
  }

  return (
    <ThemedView className="absolute bottom-4 right-4 z-50">
      <TouchableOpacity
        className="bg-blue-500 w-12 h-12 rounded-full items-center justify-center shadow-lg"
        onPress={() => setIsVisible(!isVisible)}
      >
        <AntDesign name="setting" size={20} color="white" />
      </TouchableOpacity>

      {isVisible && (
        <ThemedView className="absolute bottom-16 right-0 w-80 max-h-96 bg-white border border-gray-300 rounded-lg shadow-lg">
          <ThemedView className="bg-blue-500 px-4 py-2 rounded-t-lg">
            <ThemedText className="text-white font-semibold">Redux State</ThemedText>
          </ThemedView>

          <ScrollView className="p-4 max-h-80">
            <ThemedText className="text-xs font-mono text-gray-800">
              {JSON.stringify(state, null, 2)}
            </ThemedText>
          </ScrollView>

          <TouchableOpacity
            className="bg-gray-100 px-4 py-2 rounded-b-lg"
            onPress={() => setIsVisible(false)}
          >
            <ThemedText className="text-center text-gray-600">Close</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
    </ThemedView>
  );
}