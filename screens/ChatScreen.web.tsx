import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Text, View, Image, ScrollView, Linking, TouchableOpacity } from 'react-native';
import ChatInput from '../components/ChatInput';
import SummaryCard from '../components/SummaryCard';
import WebFeedbackModal from '../components/WebFeedbackModal';
import { Message } from '../types';
import { useChat } from '../hooks/useChat';

// --- Komponenty współdzielone (wklejone dla prostoty, można je wydzielić) ---

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

const AppHeader = () => {
  return (
    // Stały nagłówek na górze, białe tło, lekki cień
    <View className="h-16 w-full flex-row items-center justify-center border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      {/* Kontener centrujący treść nagłówka */}
      <View className="w-full max-w-7xl flex-1 flex-row items-center">
        <Image source={aiIcon} style={{ width: 32, height: 32 }} />
        <Text className="ml-3 text-xl font-semibold text-gray-800">DocChat</Text>
        {/* W przyszłości można tu dodać przyciski "Zaloguj" / "Konto" */}
      </View>
    </View>
  );
};

const AppFooter = ({ onReportPress }: { onReportPress: () => void }) => {
  // Prosta stopka z linkami i informacją o becie
  return (
    <View className="h-auto w-full items-center bg-transparent px-4 pb-6 sm:px-6 lg:px-8">
      <View className="w-full max-w-7xl flex-col items-center">
        <Text className="text-center text-sm text-gray-500">
          Jesteś w programie Beta. Pomóż nam ulepszyć aplikację.
        </Text>
        <TouchableOpacity onPress={onReportPress}>
          <Text className="mt-1 text-sm font-semibold text-blue-600 active:text-blue-800">
            Zgłoś błąd lub podziel się opinią
          </Text>
        </TouchableOpacity>
        <View className="my-4 h-px w-full max-w-lg bg-slate-200" />
        <Text className="text-center text-xs text-gray-400">
          © 2025 Firma. Wszelkie prawa zastrzeżone.
        </Text>
        <View className="mt-2 flex-row gap-4">
          {/* Na razie linki prowadzą donikąd, ale wyglądają profesjonalnie */}
          <Text className="text-xs text-gray-500 hover:text-gray-800">Regulamin</Text>
          <Text className="text-xs text-gray-500 hover:text-gray-800">Polityka Prywatności</Text>
        </View>
      </View>
    </View>
  );
};

// --- Główny komponent Web ---

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
    <View className="min-h-screen w-full flex-1 flex-col bg-slate-100">
      {/* === SEKCJA 1: GŁÓWNY HEADER APLIKACJI === */}
      <AppHeader />

      {/* === SEKCJA 2: GŁÓWNY KONTENT (OKNO CZATU) === */}
      {/* Ten View centruje okno czatu i daje mu padding góra/dół */}
      <View className="w-full flex-1 items-center justify-start px-4 py-4 sm:py-8 lg:py-12">
        {/* GŁÓWNE OKNO CZATU */}
        <View className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white shadow-xl lg:max-w-4xl">
          {conversationStarted ? (
            // --- WIDOK AKTYWNEGO CZATU ---
            <>
              <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                className="flex-1" // FlatList musi zająć całą dostępną przestrzeń
                contentContainerStyle={{ flexGrow: 1, padding: 16 }}
                ListFooterComponent={isTyping ? <TypingIndicator /> : null}
                onContentSizeChange={scrollToBottom}
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
            // --- WIDOK ONBOARDINGU ---
            // ScrollView pozwala przewijać na mniejszych ekranach (np. mobilna przeglądarka)
            <ScrollView
              className="flex-1"
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center', // Centrujemy w pionie
                padding: 24,
              }}>
              {/* Ograniczamy szerokość samego onboardingu dla czytelności na dużym oknie */}
              <View className="mx-auto w-full max-w-xl">
                <OnboardingHeader />
                <ChatInput
                  variant="onboarding"
                  inputText={inputText}
                  setInputText={setInputText}
                  onSend={handleSend}
                  disabled={isLimitReached}
                />
                <Text className="mt-6 px-4 text-center text-sm text-gray-600">
                  Pamiętaj, AI to tylko wstępna sugestia. Ostateczną diagnozę może postawić
                  wyłącznie lekarz.
                </Text>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
      <AppFooter onReportPress={() => setIsFeedbackModalVisible(true)} />

      <WebFeedbackModal
        visible={isFeedbackModalVisible}
        onClose={() => setIsFeedbackModalVisible(false)}
      />
    </View>
  );
};

export default ChatScreen;
