import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useNavigation } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ScrollView,
    StatusBar,
    TextInput,
    TouchableOpacity
} from 'react-native';
import ParallaxScrollView from '../../components/Custom/ParallaxScrollView';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { Icon, SearchIcon } from '../../components/ui/icon';
import { LANGUAGE_STORAGE_KEY, changeAppLanguage } from '../../lib/i18n';

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
           <ParallaxScrollView headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}>

            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <ThemedView className="px-4 py-4 pt-8">
                {/* Title */}
                <ThemedText className="text-3xl font-bold text-gray-900 mb-4">
                    {t('onboarding.choose_language')}
                </ThemedText>

                {/* Subtitle */}
                <ThemedText className="text-gray-600 text-lg mb-2">
                    {t('onboarding.choose_language_hint')}
                </ThemedText>
                <ThemedText className="text-gray-600 text-lg mb-8">
                    {/* This helps us serve you better. */}
                </ThemedText>

                {/* You Selected Section */}
                <ThemedText className="text-xl font-semibold text-gray-900 mb-4">
                    {t('onboarding.you_selected')}
                </ThemedText>

                {/* Selected Language Display */}
                <ThemedView className="bg-gray-50 rounded-lg p-4 mb-8">
                    <ThemedText className="text-gray-600 text-lg">
                        {selectedLanguageName || 'None selected'}
                    </ThemedText>
                </ThemedView>

                {/* All Languages Section */}
                <ThemedText className="text-xl font-semibold text-gray-900 mb-4">
                    {t('onboarding.all_languages')}
                </ThemedText>

                {/* Search Bar */}
                <ThemedView className="relative mb-6">
                    <ThemedView className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <Icon as={SearchIcon} size="md" className="text-gray-400" />
                    </ThemedView>
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder={t('common.search')}
                        placeholderTextColor="#9CA3AF"
                        className="bg-gray-50 rounded-lg pl-12 pr-4 py-4 text-gray-900 text-lg"
                    />
                </ThemedView>
            </ThemedView>

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
                        <ThemedText className="text-2xl mr-4">
                            {language.flag}
                        </ThemedText>

                        {/* Language Name */}
                        <ThemedText className={`text-lg font-medium ${selectedLanguage === language.code
                            ? 'text-[#E75B3B]'
                            : 'text-gray-900'
                            }`}>
                            {language.name}
                        </ThemedText>

                        {/* Selection Indicator */}
                        {selectedLanguage === language.code && (
                            <ThemedView className="ml-auto">
                                <ThemedView className="w-6 h-6 bg-[#E75B3B] rounded-full items-center justify-center">
                                    <ThemedText className="text-white text-sm">✓</ThemedText>
                                </ThemedView>
                            </ThemedView>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Continue Button - Show only when a language is selected */}
            {selectedLanguage && (
                <ThemedView className="px-4 pb-8 pt-4">
                    <TouchableOpacity
                        className="bg-[#E75B3B] py-4 rounded-xl"
                        onPress={handleContinue}
                    >
                        <ThemedText className="text-white text-center font-semibold text-base">
                            {t('onboarding.continue')}
                        </ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            )}
        </ParallaxScrollView>
    );
}