import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { mockDoctors } from '../data/mockData';
import { RootStackParamList } from '../navigation/AppNavigator';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'doctor';
}

type Props = NativeStackScreenProps<RootStackParamList, 'PrivateChat'>;

const PrivateChatScreen = ({ route, navigation }: Props) => {
  const { doctorId } = route.params;
  const doctor = mockDoctors.find((d) => d.id === doctorId);

  // Jeśli nie znaleziono lekarza, wyświetl błąd (zabezpieczenie)
  if (!doctor) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Nie można załadować czatu. Nie znaleziono lekarza.</Text>
      </SafeAreaView>
    );
  }

  // Stan czatu, zaczynający się od wiadomości powitalnej od lekarza
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'doctor',
      text: `Dzień dobry, jestem ${doctor.name}. Proszę opisać swój problem, a ja postaram się pomóc.`,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim().length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Symulacja odpowiedzi lekarza
    setTimeout(() => {
      const doctorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Dziękuję za wiadomość. Analizuję informacje...',
        sender: 'doctor',
      };
      setMessages((prev) => [...prev, doctorResponse]);
    }, 1500);
  };

  // Renderowanie dymków czatu jest bardzo podobne do ChatScreen
  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return isUser ? (
      <View className="mb-6 max-w-[75%] self-end rounded-2xl rounded-br-none bg-blue-600 p-3 px-4">
        <Text className="text-base text-white">{item.text}</Text>
      </View>
    ) : (
      <View className="mb-6 flex-row items-end self-start px-4">
        <Image source={{ uri: doctor.photoUrl }} className="mr-2 h-8 w-8 rounded-full" />
        <View className="max-w-[75%] rounded-2xl rounded-bl-none bg-gray-200 p-3">
          <Text className="text-base text-gray-800">{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -100}>
        {/* Nagłówek z danymi lekarza i przyciskiem powrotu */}
        <View className="flex-row items-center border-b border-gray-200 p-3">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Feather name="chevron-left" size={28} color="#334155" />
          </TouchableOpacity>
          <Image source={{ uri: doctor.photoUrl }} className="h-10 w-10 rounded-full" />
          <View className="ml-3 flex-1">
            <Text className="text-base font-bold text-gray-800">{doctor.name}</Text>
            <Text className="text-sm text-green-600">Online</Text>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          className="flex-1 px-2 pt-4"
          onContentSizeChange={scrollToBottom}
        />

        {/* Pole do wpisywania wiadomości */}
        <View className="flex-row items-center space-x-2 border-t border-gray-200 bg-white p-2">
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            className="h-11 flex-1 rounded-full border border-gray-300 bg-gray-100 px-4 text-base"
            placeholder="Napisz wiadomość do lekarza..."
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity
            onPress={handleSend}
            className="h-11 w-11 items-center justify-center rounded-full bg-blue-600 active:bg-blue-700"
            activeOpacity={0.8}>
            <Feather name="send" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PrivateChatScreen;
