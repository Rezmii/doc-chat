// src/screens/ChatScreen.tsx

import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef, useState, useLayoutEffect } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  isRecommendation?: boolean;
}

const initialMessages: Message[] = [];

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const ChatScreen = ({ navigation }: Props) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  useLayoutEffect(() => {
    setTimeout(() => {
      setMessages([
        {
          id: 'start-1',
          text: 'Witaj! Jestem Twoim wirtualnym asystentem medycznym. Opisz proszę swoje objawy.',
          sender: 'ai',
        },
      ]);
    }, 500);
  }, []);

  const handleSend = () => {
    if (inputText.trim().length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse: Message;
      const userMessageCount = newMessages.filter((m) => m.sender === 'user').length;

      if (userMessageCount === 1) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          text: 'Dziękuję. Od jak dawna odczuwasz te dolegliwości i czy występują ciągle?',
          sender: 'ai',
        };
      } else if (userMessageCount === 2) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          text: 'Rozumiem. Na podstawie podanych informacji, objawy mogą wskazywać na potrzebę konsultacji neurologicznej.',
          sender: 'ai',
          isRecommendation: true,
        };
      } else {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          text: 'Nie jestem w stanie dalej analizować objawów. Proszę skonsultuj się z lekarzem.',
          sender: 'ai',
        };
      }

      setIsTyping(false);
      setMessages((prev) => [...prev, aiResponse]);
    }, 1500);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';

    if (!isUser) {
      return (
        <View className="mb-6 flex-row items-end self-start px-4">
          <View className="mr-2 h-8 w-8 items-center justify-center rounded-full bg-slate-200">
            <Text className="text-lg">🤖</Text>
          </View>
          <View className="max-w-[75%] rounded-2xl rounded-bl-none bg-gray-200 p-3">
            <Text className="text-base text-gray-800">{item.text}</Text>
            {item.isRecommendation && (
              <View className="mt-3 border-t border-gray-300 pt-3">
                <TouchableOpacity
                  onPress={() => navigation.navigate('DoctorList', { specialty: 'Neurologia' })}
                  className="mb-2 h-11 items-center justify-center rounded-lg bg-blue-600 active:bg-blue-700">
                  <Text className="font-semibold text-white">✅ Tak, pokaż specjalistów</Text>
                </TouchableOpacity>
                <TouchableOpacity className="h-11 items-center justify-center rounded-lg bg-gray-300 active:bg-gray-400">
                  <Text className="font-semibold text-gray-700">❌ Nie, dziękuję</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      );
    }

    return (
      <View className="mb-6 max-w-[75%] self-end rounded-2xl rounded-br-none bg-blue-600 p-3 px-4">
        <Text className="text-base text-white">{item.text}</Text>
      </View>
    );
  };

  const TypingIndicator = () => (
    <View className="mb-6 flex-row items-end self-start px-4">
      <View className="mr-2 h-8 w-8 items-center justify-center rounded-full bg-slate-200">
        <Text className="text-lg">🤖</Text>
      </View>
      <View className="max-w-[75%] rounded-2xl rounded-bl-none bg-gray-200 p-3">
        <Text className="text-base font-medium italic text-gray-500">Asystent pisze...</Text>
      </View>
    </View>
  );

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
          <Text className="mr-10 flex-1 text-center text-xl font-bold text-gray-800">
            Asystent AI
          </Text>
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

        <View className="flex-row items-center space-x-2 border-t border-gray-200 bg-white p-2">
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            className="h-11 flex-1 rounded-full border border-gray-300 bg-gray-100 px-4 text-base"
            placeholder="Napisz wiadomość..."
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

export default ChatScreen;
