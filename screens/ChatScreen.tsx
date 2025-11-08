import { Feather } from '@expo/vector-icons';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChatInput from '../components/ChatInput';
import SummaryCard from '../components/SummaryCard';
import { postChatMessage } from '../services/api';
import { AISummary, ApiChatMessage, Message, AIResponse } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';

const aiIcon = require('../assets/onboard_icon.png');

// ZMIANA: Zaktualizowany komponent OnboardingHeader
const OnboardingHeader = () => (
  <View className="items-center px-6 text-center">
    {/* 3. ZMIANA: Używamy nowej ikony */}
    <View className="h-24 w-24 items-center justify-center rounded-2xl bg-blue-100">
      <Image source={aiIcon} className="h-20 w-20" />
    </View>
    <Text className="mt-6 text-center text-3xl font-bold text-gray-900">
      Wstępna Analiza Objawów
    </Text>
    <Text className="mt-4 text-center text-base text-gray-700">
      Opisz swój problem lub objawy, a ja zadam Ci kilka pytań, aby lepiej zrozumieć sytuację.
    </Text>
  </View>
);

const MOCK_SUMMARY_DATA: AISummary = {
  summary:
    'Użytkownik zgłasza silny, pulsujący ból głowy w okolicy skroni, trwający od 2 dni. Objawom towarzyszą nudności i nadwrażliwość na światło.',
  possibleCauses: [
    'Migrena z aurą',
    'Napięciowy ból głowy',
    'Problemy z ciśnieniem (nadciśnienie)',
  ],
  recommendedSpecialist: 'Neurolog lub Lekarz rodzinny',
  questionsForDoctor: [
    'Czy to może być migrena?',
    'Jakie badania diagnostyczne powinienem wykonać?',
    'Jakie leki przeciwbólowe mogę bezpiecznie stosować?',
    'Czy mój styl życia (stres, dieta) może na to wpływać?',
  ],
};

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const ChatScreen = ({ navigation }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLimitReached, setIsLimitReached] = useState(false);
  const flatListRef = useRef<FlatList<any> | null>(null);

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const handleSend = async () => {
    const textToSend = inputText.trim();
    if (textToSend.length === 0 || isLimitReached) return;

    if (!conversationStarted) {
      setConversationStarted(true);
    }
    setInputText('');
    Keyboard.dismiss();

    if (textToSend === '/testsummary') {
      const summaryMessage: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        content: {
          type: 'summary',
          data: MOCK_SUMMARY_DATA,
        },
      };
      setMessages((prev) => [...prev, summaryMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: { type: 'text', text: textToSend },
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsTyping(true);

    const newHistory: ApiChatMessage[] = [...messages, userMessage].map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content.type === 'text' ? msg.content.text : JSON.stringify(msg.content.data),
    }));

    try {
      if (isLimitReached) setIsLimitReached(false);

      const data: AIResponse = await postChatMessage(newHistory);

      const aiMessage: Message = {
        id: Date.now().toString() + '-ai',
        sender: 'ai',
        content:
          data.type === 'summary'
            ? { type: 'summary', data: data.content }
            : { type: 'text', text: data.content },
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Błąd w handleSend:', error);
      const errorMessageText =
        error instanceof Error ? error.message : 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.';

      if (errorMessageText.includes('Przekroczono limit')) {
        setIsLimitReached(true);
      } else {
        const errorMessage: Message = {
          id: Date.now().toString() + '-error',
          sender: 'ai',
          content: { type: 'text', text: errorMessageText },
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    if (item.sender === 'ai' && item.content.type === 'summary') {
      return <SummaryCard summary={item.content.data} messageId={item.id} listRef={flatListRef} />;
    }

    const textToShow = item.content.type === 'text' ? item.content.text : '[Podsumowanie]';

    if (item.sender === 'ai') {
      return (
        <View className="mb-6 flex-row items-end self-start px-4">
          {/* ZMIANA: Nowy avatar AI */}
          <View className="mr-2 h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Image source={aiIcon} className="h-8 w-8" style={{ tintColor: '#2563eb' }} />
          </View>
          {/* ZMIANA: Nowy styl dymka AI */}
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

  const TypingIndicator = () => (
    <View className="mb-6 flex-row items-end self-start px-4">
      {/* ZMIANA: Awatar AI */}
      <View className="mr-2 h-12 w-12 items-center justify-center rounded-full bg-blue-100">
        <Image source={aiIcon} className="h-8 w-8" style={{ tintColor: '#2563eb' }} />
      </View>
      {/* ZMIANA: rounded-2xl -> rounded-xl */}
      <View className="max-w-[75%] rounded-xl rounded-bl-none bg-gray-200 p-3">
        <Text className="text-base font-medium italic text-gray-500">Asystent pisze...</Text>
      </View>
    </View>
  );

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
              className="flex-1 bg-white px-2 pt-4" // Tło wraca na białe dla czystości
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
          // ZMIANA: justify-center -> justify-start, pt-24, p-4 -> p-6
          <View className="flex-1 justify-start p-6 pt-24">
            <OnboardingHeader />
            <ChatInput
              variant="onboarding"
              inputText={inputText}
              setInputText={setInputText}
              onSend={handleSend}
              disabled={false}
            />
            {/* ZMIANA: Lepsza czytelność i marginesy dla disclaimera */}
            <Text className="mt-6 px-4 text-center text-sm text-gray-600">
              Pamiętaj, AI to tylko wstępna sugestia. Ostateczną diagnozę może postawić wyłącznie
              lekarz.
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>
      {/* Przycisk Feedbacku zostaje usunięty, ponieważ jest teraz częścią SummaryCard,
        która jest znacznie lepszym miejscem na kontekstową opinię.
      */}
      {/* <FeedbackButton /> */}
    </SafeAreaView>
  );
};

export default ChatScreen;
