import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChatInput from '../components/ChatInput';
import SummaryCard from '../components/SummaryCard';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useChat } from 'hooks/useChat';
import { Message } from '../types';

const aiIcon = require('../assets/onboard_icon.png');

const OnboardingHeader = () => (
  <View className="items-center px-6 text-center">
    <View className="h-24 w-24 items-center justify-center rounded-2xl bg-blue-100">
      <Image source={aiIcon} style={{ width: 80, height: 80 }} />
    </View>
    <Text className="mt-6 text-center text-3xl font-bold text-gray-900">
      Wstępna Analiza Objawów
    </Text>
    <Text className="mt-4 text-center text-base text-gray-700">
      Opisz swój problem lub objawy, a ja zadam Ci kilka pytań, aby lepiej zrozumieć sytuację.
    </Text>
  </View>
);

const TypingIndicator = () => (
  <View className="mb-6 flex-row items-end self-start px-4">
    <View className="mr-2 h-12 w-12 items-center justify-center rounded-full bg-blue-100">
      <Image source={aiIcon} style={{ width: 32, height: 32, tintColor: '#2563eb' }} />
    </View>
    <View className="max-w-[75%] rounded-xl rounded-bl-none bg-gray-200 p-3">
      <Text className="text-base font-medium italic text-gray-500">Asystent pisze...</Text>
    </View>
  </View>
);

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const ChatScreen = ({ navigation }: Props) => {
  const {
    messages,
    isTyping,
    conversationStarted,
    inputText,
    setInputText,
    isLimitReached,
    flatListRef,
    handleSend,
    scrollToBottom,
  } = useChat();

  const renderMessage = ({ item }: { item: Message }) => {
    if (item.sender === 'ai' && item.content.type === 'summary') {
      return <SummaryCard summary={item.content.data} messageId={item.id} listRef={flatListRef} />;
    }

    const textToShow = item.content.type === 'text' ? item.content.text : '[Podsumowanie]';

    if (item.sender === 'ai') {
      return (
        <View className="mb-6 flex-row items-end self-start px-4">
          <View className="mr-2 h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Image source={aiIcon} style={{ width: 32, height: 32, tintColor: '#2563eb' }} />
          </View>

          <View className="max-w-[75%] rounded-2xl rounded-bl-none bg-slate-100 p-3">
            <Text className="text-base text-slate-800">{textToShow}</Text>
          </View>
        </View>
      );
    }

    return (
      <View className="mb-6 max-w-[75%] self-end rounded-2xl rounded-br-none bg-blue-600 p-3 px-4">
        <Text className="text-base text-white">{textToShow}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="bg-brand-background flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={0}>
        {conversationStarted ? (
          <>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              className="flex-1 bg-white px-2 pt-4"
              onContentSizeChange={scrollToBottom}
              ListFooterComponent={isTyping ? <TypingIndicator /> : null}
            />

            <ChatInput
              variant="chat"
              inputText={inputText}
              setInputText={setInputText}
              onSend={handleSend}
              disabled={isLimitReached}
            />
          </>
        ) : (
          <View className="flex-1 justify-start p-6 pt-24">
            <OnboardingHeader />
            <ChatInput
              variant="onboarding"
              inputText={inputText}
              setInputText={setInputText}
              onSend={handleSend}
              disabled={false}
            />

            <Text className="mt-6 px-4 text-center text-sm text-gray-600">
              Pamiętaj, AI to tylko wstępna sugestia. Ostateczną diagnozę może postawić wyłącznie
              lekarz.
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
