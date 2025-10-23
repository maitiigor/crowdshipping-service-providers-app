import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useNavigation } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, SearchIcon } from '../../components/ui/icon';
import { changeAppLanguage, LANGUAGE_STORAGE_KEY } from '../../lib/i18n';

interface Language {
    code: string;
    name: string;
    flag: string;
}

const languages: Language[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
];

export default function LanguageSelectionScreen() {
    const [selectedLanguage, setSelectedLanguage] = useState<string>();
    const [searchQuery, setSearchQuery] = useState('');

    const navigation = useNavigation();

    const { t, i18n } = useTranslation();


    const selectedLabel = useMemo(() => {
        const currentCode = selectedLanguage || i18n.language;
        const found = languages.find((l) => l.code === currentCode);
        return found?.name ?? "English";
    }, [selectedLanguage, i18n.language]);

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    useEffect(() => {
        // preload persisted language to reflect selection
        AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
            .then((saved) => {
                if (saved) {
                    setSelectedLanguage(saved);
                } else {
                    setSelectedLanguage(i18n.language);
                }
            })
            .catch(() => {
                setSelectedLanguage(i18n.language);
            });
    }, [i18n.language]);


    const filteredLanguages = languages.filter(language =>
        language.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleLanguageSelect = async (languageCode: string) => {
        setSelectedLanguage(languageCode);
        await changeAppLanguage(languageCode);
    };

    const handleContinue = () => {
        // Navigate to onboarding flow after language selection
        router.replace('/screens/onboarding');
    };

    const selectedLanguageName = languages.find(lang => lang.code === selectedLanguage)?.name || '';

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <View className="px-4 py-4 pt-8">
                {/* Title */}
                <Text className="text-3xl font-bold text-gray-900 mb-4">
                    Choose the language
                </Text>

                {/* Subtitle */}
                <Text className="text-gray-600 text-lg mb-2">
                    Select your preferred language below
                </Text>
                <Text className="text-gray-600 text-lg mb-8">
                    This helps us serve you better.
                </Text>

                {/* You Selected Section */}
                <Text className="text-xl font-semibold text-gray-900 mb-4">
                    You Selected
                </Text>

                {/* Selected Language Display */}
                <View className="bg-gray-50 rounded-lg p-4 mb-8">
                    <Text className="text-gray-600 text-lg">
                        {selectedLanguageName || 'None selected'}
                    </Text>
                </View>

                {/* All Languages Section */}
                <Text className="text-xl font-semibold text-gray-900 mb-4">
                    All Languages
                </Text>

                {/* Search Bar */}
                <View className="relative mb-6">
                    <View className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <Icon as={SearchIcon} size="md" className="text-gray-400" />
                    </View>
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="English"
                        placeholderTextColor="#9CA3AF"
                        className="bg-gray-50 rounded-lg pl-12 pr-4 py-4 text-gray-900 text-lg"
                    />
                </View>
            </View>

            {/* Language List */}
            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                {filteredLanguages.map((language) => (
                    <TouchableOpacity
                        key={language.code}
                        onPress={async () => {
                            setSelectedLanguage(language.code);
                            await changeAppLanguage(language.code);
                        }}
                        className={`flex-row items-center p-4 rounded-lg mb-3 ${selectedLanguage === language.code
                            ? 'bg-[#E75B3B]/10 border border-[#E75B3B]'
                            : 'bg-gray-50'
                            }`}
                    >
                        {/* Flag */}
                        <Text className="text-2xl mr-4">
                            {language.flag}
                        </Text>

                        {/* Language Name */}
                        <Text className={`text-lg font-medium ${selectedLanguage === language.code
                            ? 'text-[#E75B3B]'
                            : 'text-gray-900'
                            }`}>
                            {language.name}
                        </Text>

                        {/* Selection Indicator */}
                        {selectedLanguage === language.code && (
                            <View className="ml-auto">
                                <View className="w-6 h-6 bg-[#E75B3B] rounded-full items-center justify-center">
                                    <Text className="text-white text-sm">✓</Text>
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Continue Button - Show only when a language is selected */}
            {selectedLanguage && (
                <View className="px-4 pb-8 pt-4">
                    <TouchableOpacity
                        className="bg-[#E75B3B] py-4 rounded-xl"
                        onPress={handleContinue}
                    >
                        <Text className="text-white text-center font-semibold text-base">
                            Continue
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}