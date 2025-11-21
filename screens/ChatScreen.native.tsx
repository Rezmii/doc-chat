import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import ChatInput from '../components/ChatInput';
import SummaryCard from '../components/SummaryCard';
import FeedbackModal from '../components/FeedbackModal';
import { Message } from '../types';
import { useChat } from '../hooks/useChat';

// UI Components
import { Text } from '../components/ui/text';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';

const aiIconSource = require('../assets/onboard_icon.png');

// === HEADER (Minimalistyczny & Spójny z Web) ===
const MobileHeader = ({ onFeedbackPress }: { onFeedbackPress: () => void }) => (
  <View className="flex-row items-center justify-between border-b border-border bg-background px-4 py-3">
    <View className="flex-row items-center gap-3">
      {/* Ikona zgodna z brandingiem (Primary tło + biała ikona) - tak jak w Web Sidebar */}
      <View className="h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
        <Feather name="activity" size={16} color="white" />
      </View>
      <Text className="text-lg font-bold tracking-tight text-foreground">DocChat</Text>
    </View>

    <View className="flex-row items-center gap-4">
      {/* Subtelniejszy Badge */}
      <View className="rounded-full bg-secondary px-2 py-0.5">
        <Text className="text-[10px] font-bold text-muted-foreground">BETA</Text>
      </View>

      {/* Czysta ikona bez obramowania (Ghost Button style) */}
      <TouchableOpacity
        onPress={onFeedbackPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        className="opacity-70 active:opacity-100">
        <Feather name="flag" size={16} color="#64748b" />
      </TouchableOpacity>
    </View>
  </View>
);
// === TYPING INDICATOR (Zgodny z Web) ===
const TypingIndicator = () => (
  <View className="flex-row items-center gap-3 px-6 py-4">
    <View className="h-8 w-8 items-center justify-center rounded-lg bg-primary/5">
      <Feather name="loader" size={14} className="animate-spin text-primary" color="#2563eb" />
    </View>
    <Text className="text-sm text-muted-foreground">Analizuję...</Text>
  </View>
);

// === ONBOARDING CONTENT (Zgodny z Web) ===
const OnboardingView = ({
  inputText,
  setInputText,
  handleSend,
  isLimitReached,
}: {
  inputText: string;
  setInputText: (t: string) => void;
  handleSend: () => void;
  isLimitReached: boolean;
}) => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
      keyboardShouldPersistTaps="handled">
      <View className="mx-auto w-full max-w-xl space-y-8">
        <View>
          <Text className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Nowa konsultacja
          </Text>
          <Text className="mb-4 text-4xl font-bold tracking-tight text-foreground">
            Dzień dobry.
          </Text>
          <Text className="text-xl leading-relaxed text-muted-foreground">
            Opisz swoje dolegliwości. Przeanalizuję je i przygotuję wstępną ocenę dla lekarza.
          </Text>
        </View>

        <ChatInput
          variant="onboarding"
          inputText={inputText}
          setInputText={setInputText}
          onSend={handleSend}
          disabled={isLimitReached}
        />

        <View className="flex-row gap-6 pt-4 opacity-60">
          <View className="flex-row items-center gap-2">
            <Feather name="lock" size={14} color="#64748b" />
            <Text className="text-xs font-medium text-muted-foreground">Szyfrowane połączenie</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

// --- GŁÓWNY KOMPONENT ---

const ChatScreen = () => {
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);

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

  // --- Renderowanie Wiadomości ---
  const renderMessage = ({ item }: { item: Message }) => {
    // 1. Podsumowanie (Summary Card)
    if (item.sender === 'ai' && item.content.type === 'summary') {
      return (
        <View className="p-4">
          <SummaryCard summary={item.content.data} messageId={item.id} listRef={flatListRef} />
        </View>
      );
    }

    const textToShow = item.content.type === 'text' ? item.content.text : '...';

    // 2. Wiadomość AI - Styl "Dokument" (bez dymka, z awatarem)
    if (item.sender === 'ai') {
      return (
        <View className="w-full px-4 py-6">
          <View className="flex-row gap-4">
            <Avatar
              alt="AI"
              className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-blue-50 shadow-sm">
              <Feather name="activity" size={18} color="#2563eb" />
            </Avatar>
            <View className="flex-1 space-y-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-sm font-bold text-foreground">Asystent Medyczny</Text>
                <Text className="text-[10px] uppercase text-muted-foreground">AI</Text>
              </View>
              <Text className="text-base font-normal leading-7 text-foreground/90">
                {textToShow}
              </Text>
            </View>
          </View>
        </View>
      );
    }

    // 3. Wiadomość Użytkownika - Dymek po prawej
    return (
      <View className="w-full flex-row justify-end px-4 py-4">
        <View className="max-w-[85%] rounded-2xl rounded-tr-sm bg-secondary/80 px-5 py-3">
          <Text className="text-base font-medium leading-6 text-foreground">{textToShow}</Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="dark" />

      {/* Top Safe Area */}
      <SafeAreaView edges={['top']} className="z-10 bg-background" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        {/* Header */}
        <MobileHeader onFeedbackPress={() => setIsFeedbackModalVisible(true)} />

        {conversationStarted ? (
          <View className="flex-1 bg-background">
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              className="flex-1"
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
              ListFooterComponent={isTyping ? <TypingIndicator /> : null}
              onContentSizeChange={scrollToBottom}
            />

            {/* Input Container */}
            <View className="border-t border-border bg-background pb-2 pt-1">
              <ChatInput
                variant="chat"
                inputText={inputText}
                setInputText={setInputText}
                onSend={handleSend}
                disabled={isLimitReached}
              />
            </View>
          </View>
        ) : (
          <OnboardingView
            inputText={inputText}
            setInputText={setInputText}
            handleSend={handleSend}
            isLimitReached={isLimitReached}
          />
        )}
      </KeyboardAvoidingView>

      {/* Bottom Safe Area */}
      <SafeAreaView edges={['bottom']} className="bg-background" />

      {/* Feedback Modal */}
      <FeedbackModal
        visible={isFeedbackModalVisible}
        onClose={() => setIsFeedbackModalVisible(false)}
      />
    </View>
  );
};

export default ChatScreen;
