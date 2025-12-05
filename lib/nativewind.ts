import { cssInterop } from 'nativewind';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

// Enable className support for core React Native components
cssInterop(View, { className: 'style' });
cssInterop(Text, { className: 'style' });
cssInterop(Image, { className: 'style' });
cssInterop(ScrollView, { 
  className: 'style',
  contentContainerClassName: 'contentContainerStyle'
});
cssInterop(Pressable, { className: 'style' });
cssInterop(TextInput, { className: 'style' });
