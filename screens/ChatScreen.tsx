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
import { Message, ApiChatMessage } from 'types';
import { postChatMessage } from 'services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const ChatScreen = ({ navigation }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  useLayoutEffect(() => {
    if (process.env.EXPO_PUBLIC_SKIP_AI_CHAT === 'true') {
      console.log('--- TRYB DEWELOPERSKI: Pomijanie czatu AI ---');
      setMessages([
        {
          id: 'dev-mode-1',
          text: 'Tryb deweloperski jest włączony. Oto przykładowa rekomendacja, aby przejść dalej.',
          sender: 'ai',
          isRecommendation: true,
        },
      ]);
      setIsTyping(false);
    } else {
      setTimeout(() => {
        setMessages([
          {
            id: 'start-1',
            text: 'Witaj! Jestem Twoim wirtualnym asystentem medycznym. Opisz proszę swoje objawy.',
            sender: 'ai',
          },
        ]);
        setIsTyping(false);
      }, 1000);
    }
  }, []);

  const handleSend = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsTyping(true);

    const apiHistory: ApiChatMessage[] = updatedMessages.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    }));

    try {
      const data = await postChatMessage(apiHistory);

      const aiMessage: Message = {
        id: Date.now().toString() + '-ai',
        text: data.reply,
        sender: 'ai',
        isRecommendation: data.recommendationReady,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Błąd komunikacji z API:', error);
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        text: 'Przepraszam, mam problem z połączeniem. Spróbuj ponownie później.',
        sender: 'ai',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  const handleDeclineRecommendation = () => {
    setMessages((prevMessages) =>
      prevMessages.map((msg, index) =>
        index === prevMessages.length - 1 ? { ...msg, isRecommendation: false } : msg
      )
    );
    setIsTyping(true);

    setTimeout(() => {
      const followUpMessage: Message = {
        id: Date.now().toString(),
        text: 'Oczywiście. Czy jest coś jeszcze, w czym mogę Ci pomóc? Możesz opisać inne objawy lub zadać dodatkowe pytanie.',
        sender: 'ai',
      };
      setMessages((prev) => [...prev, followUpMessage]);
      setIsTyping(false);
    }, 1000);
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
                <TouchableOpacity
                  onPress={handleDeclineRecommendation}
                  className="h-11 items-center justify-center rounded-lg bg-gray-300 active:bg-gray-400">
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
    }
  };

  return (
    <View className="flex-row items-center space-x-2 border-t border-gray-200 bg-white p-2">
      <TextInput
        value={inputText}
        onChangeText={setInputText}
        onSubmitEditing={handlePress}
        className="h-11 flex-1 rounded-full border border-gray-300 bg-gray-100 px-4 text-base"
        placeholder="Napisz wiadomość..."
      />
      <TouchableOpacity
        onPress={handlePress}
        className="h-11 w-11 items-center justify-center rounded-full bg-blue-600 active:bg-blue-700">
        <Feather name="send" size={22} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default ChatScreen;
