import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getDoctorById } from '../services/api';
import { DoctorFromAPI, Message } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'PrivateChat'>;

const PrivateChatScreen = ({ route, navigation }: Props) => {
  const { doctorId } = route.params;

  const [doctor, setDoctor] = useState<DoctorFromAPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const fetchedDoctor = await getDoctorById(doctorId);
        setDoctor(fetchedDoctor);
        setMessages([
          {
            id: 'welcome-1',
            sender: 'doctor',
            text: `Dzień dobry, jestem ${fetchedDoctor.user.name}. Proszę opisać swój problem, a ja postaram się pomóc.`,
            isRecommendation: false,
          },
        ]);
      } catch (e) {
        setError('Nie udało się załadować danych lekarza.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorData();
  }, [doctorId]);

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text: string) => {
    if (text.trim().length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const doctorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Dziękuję za wiadomość. Analizuję informacje...',
        sender: 'doctor',
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, doctorResponse]);
    }, 2000);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return isUser ? (
      <View className="mb-6 max-w-[75%] self-end rounded-2xl rounded-br-none bg-blue-600 p-3 px-4">
        <Text className="text-base text-white">{item.text}</Text>
      </View>
    ) : (
      <View className="mb-6 flex-row items-end self-start px-4">
        {doctor && (
          <Image
            source={{ uri: `https://avatar.iran.liara.run/public/boy?username=${doctor.id}` }}
            className="mr-2 h-8 w-8 rounded-full"
          />
        )}
        <View className="max-w-[75%] rounded-2xl rounded-bl-none bg-gray-200 p-3">
          <Text className="text-base text-gray-800">{item.text}</Text>
        </View>
      </View>
    );
  };

  const TypingIndicator = () => (
    <View className="mb-6 flex-row items-end self-start px-4">
      <View className="mr-2 h-8 w-8 items-center justify-center rounded-full bg-slate-200">
        {doctor && (
          <Image
            source={{ uri: `https://avatar.iran.liara.run/public/boy?username=${doctor.id}` }}
            className="mr-2 h-8 w-8 rounded-full"
          />
        )}
      </View>
      <View className="max-w-[75%] rounded-2xl rounded-bl-none bg-gray-200 p-3">
        <Text className="text-base font-medium italic text-gray-500">Lekarz pisze...</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (error || !doctor) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center p-4">
        <Text className="text-red-500">{error || 'Nie można załadować czatu.'}</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-4 rounded-lg bg-gray-200 px-4 py-2">
          <Text>Wróć</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -100}>
        <View className="flex-row items-center border-b border-gray-200 p-3">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Feather name="chevron-left" size={28} color="#334155" />
          </TouchableOpacity>
          <Image
            source={{ uri: `https://avatar.iran.liara.run/public/boy?username=${doctor.id}` }}
            className="h-10 w-10 rounded-full"
          />
          <View className="ml-3 flex-1">
            <Text className="text-base font-bold text-gray-800">{doctor.user.name}</Text>
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
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        />
        <ChatInput onSend={handleSend} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const ChatInput = ({ onSend }: { onSend: (text: string) => void }) => {
  const [inputText, setInputText] = useState('');
  const handlePress = () => {
    if (inputText.trim().length > 0) {
      onSend(inputText);
      setInputText('');
      Keyboard.dismiss();
    }
  };
  return (
    <View className="flex-row items-center space-x-2 border-t border-gray-200 bg-white p-2">
      <TextInput
        value={inputText}
        onChangeText={setInputText}
        onSubmitEditing={handlePress}
        className="mr-2 h-11 flex-1 rounded-full border border-gray-300 bg-gray-100 px-4 text-base"
        placeholder="Napisz wiadomość do lekarza..."
      />
      <TouchableOpacity
        onPress={handlePress}
        className="h-11 w-11 items-center justify-center rounded-full bg-blue-600 active:bg-blue-700">
        <Feather name="send" size={22} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default PrivateChatScreen;
