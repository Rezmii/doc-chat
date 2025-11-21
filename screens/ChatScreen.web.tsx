import { Feather } from '@expo/vector-icons';
import React, { useState, useMemo } from 'react';
import { FlatList, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import ChatInput from '../components/ChatInput';
import SummaryCard from '../components/SummaryCard';
import FeedbackModal from '../components/FeedbackModal';
import { Message, AISummary } from '../types';
import { useChat } from '../hooks/useChat';

import { Text } from '../components/ui/text';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { Badge } from '~/components/ui/badge';

const aiIconSource = require('../assets/onboard_icon.png');

const BrandingSidebar = () => {
  return (
    <View className="hidden h-full w-4/12 justify-between border-r border-border bg-slate-50/50 p-10 lg:flex">
      <View>
        <View className="mb-8 flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm">
            <Feather name="activity" size={20} color="white" />
          </View>
          <Text className="text-2xl font-bold tracking-tight text-foreground">DocChat</Text>
        </View>

        <Text className="mb-6 text-3xl font-bold leading-tight text-foreground">
          Twoje zdrowie,{'\n'}zrozumiałe i jasne.
        </Text>
        <Text className="text-lg leading-relaxed text-muted-foreground">
          Inteligentny asystent, który pomoże Ci przygotować się do wizyty lekarskiej.
        </Text>
      </View>

      <View className="gap-8">
        <div className="space-y-6">
          {/* Elementy listy kroków - symulacja */}
          <View className="flex-row items-start gap-4 opacity-80">
            <View className="mt-0.5 h-6 w-6 items-center justify-center rounded-full bg-primary/10">
              <Feather name="message-circle" size={14} className="text-primary" color="#2563eb" />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-foreground">Wywiad medyczny</Text>
              <Text className="text-sm text-muted-foreground">AI zada Ci precyzyjne pytania.</Text>
            </View>
          </View>
          <View className="flex-row items-start gap-4 opacity-80">
            <View className="mt-0.5 h-6 w-6 items-center justify-center rounded-full bg-primary/10">
              <Feather name="file-text" size={14} className="text-primary" color="#2563eb" />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-foreground">Analiza i Raport</Text>
              <Text className="text-sm text-muted-foreground">
                Otrzymasz podsumowanie dla lekarza.
              </Text>
            </View>
          </View>
        </div>
      </View>

      <View>
        <Separator className="mb-4 bg-border" />
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-muted-foreground">© 2025 DocChat Beta</Text>
          <Text className="text-xs font-medium text-muted-foreground">Prywatne i Bezpieczne</Text>
        </View>
      </View>
    </View>
  );
};

const SummarySidebar = ({
  summaryData,
  messageId,
}: {
  summaryData: AISummary;
  messageId: string;
}) => (
  // Używamy tych samych klas kontenera co w BrandingSidebar: bg-slate-50/50 p-10
  <View className="hidden h-full w-full justify-between border-r border-border bg-slate-50/50 p-10 lg:flex">
    <View className="flex-1 overflow-hidden">
      {/* Header - dopasowany stylem do nagłówków BrandingSidebar */}
      <View className="mb-8 flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm">
          <Feather name="file-text" size={20} color="white" />
        </View>
        <Text className="text-2xl font-bold tracking-tight text-foreground">Twój Raport</Text>
      </View>

      {/* Treść - SummaryCard "wtopiona" w sidebar (bez tła i cienia) */}
      <ScrollView
        className="-mx-6 flex-1 px-6" // Ujemny margines pozwala paskowi przewijania być przy krawędzi
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}>
        <SummaryCard
          summary={summaryData}
          messageId={messageId}
          // Kluczowe: robimy kartę przezroczystą, aby wyglądała jak natywna część panelu
          className="border-0 bg-transparent p-0 shadow-none"
        />
      </ScrollView>
    </View>

    {/* Footer - identyczny układ jak w BrandingSidebar */}
    <View className="mt-6 pt-4">
      <Separator className="mb-4 bg-border" />
      <View className="flex-row items-start gap-4 opacity-80">
        <View className="mt-0.5 h-6 w-6 items-center justify-center rounded-full bg-primary/10">
          <Feather name="arrow-right-circle" size={14} className="text-primary" color="#2563eb" />
        </View>
        <View className="flex-1">
          <Text className="font-medium text-foreground">Co dalej?</Text>
          <Text className="text-sm text-muted-foreground">
            Zapisz ten raport i pokaż go swojemu lekarzowi pierwszego kontaktu.
          </Text>
        </View>
      </View>
    </View>
  </View>
);

// === MOBILNY HEADER ===
const MobileHeader = ({ onFeedbackPress }: { onFeedbackPress: () => void }) => (
  <View className="flex-row items-center justify-between border-b border-border bg-background px-4 py-3 lg:hidden">
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

// === TYPING INDICATOR (Minimalistyczny) ===
const TypingIndicator = () => (
  <View className="flex-row items-center gap-3 px-6 py-4">
    <View className="h-8 w-8 items-center justify-center rounded-lg bg-primary/5">
      <Feather name="loader" size={14} className="animate-spin text-primary" color="#2563eb" />
    </View>
    <Text className="text-sm text-muted-foreground">Analizuję...</Text>
  </View>
);

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

  const summaryMessage = useMemo(
    () => messages.find((m) => m.sender === 'ai' && m.content.type === 'summary'),
    [messages]
  );

  // --- Renderowanie Wiadomości ---
  const renderMessage = ({ item }: { item: Message }) => {
    if (item.sender === 'ai' && item.content.type === 'summary') {
      return (
        <View className="p-4 lg:hidden">
          <SummaryCard summary={item.content.data} messageId={item.id} listRef={flatListRef} />
        </View>
      );
    }

    const textToShow = item.content.type === 'text' ? item.content.text : '...';

    // AI MESSAGE: Professional "Document" Style
    if (item.sender === 'ai') {
      return (
        <View className="w-full border-b border-transparent px-4 py-6 transition-colors hover:border-border/30 hover:bg-slate-50/50 md:px-8">
          <View className="max-w-3xl flex-row gap-4">
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

    // USER MESSAGE: Clean Bubble aligned right (but subtle)
    return (
      <View className="w-full flex-row justify-end px-4 py-4 md:px-8">
        <View className="max-w-[80%] rounded-2xl rounded-tr-sm bg-secondary/80 px-5 py-3 md:max-w-xl">
          <Text className="text-base font-medium leading-6 text-foreground">{textToShow}</Text>
        </View>
      </View>
    );
  };

  return (
    <View className="h-screen w-screen flex-1 flex-row overflow-hidden bg-background">
      {/* LEWY PANEL */}

      {summaryMessage ? (
        <View className="hidden h-full w-4/12 border-r border-border lg:flex">
          <SummarySidebar
            summaryData={
              summaryMessage.content.type === 'summary' ? summaryMessage.content.data : ({} as any)
            }
            messageId={summaryMessage.id}
          />
        </View>
      ) : (
        <BrandingSidebar />
      )}

      {/* PRAWA STRONA */}
      <View className="relative h-full flex-1 flex-col bg-white">
        {/* Top Bar Sesji (Tylko gdy rozmowa trwa) */}
        {conversationStarted && (
          <View className="sticky top-0 z-10 hidden h-14 flex-row items-center justify-between border-b border-border bg-white/80 px-6 backdrop-blur lg:flex">
            <View className="flex-row items-center gap-2">
              <View className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <Text className="text-sm font-medium text-foreground">Sesja aktywna</Text>
            </View>
            <Button variant="ghost" size="sm" onPress={() => setIsFeedbackModalVisible(true)}>
              <Feather name="flag" size={14} className="mr-2 text-muted-foreground" />
              <Text className="text-xs text-muted-foreground">Zgłoś problem</Text>
            </Button>
          </View>
        )}

        <MobileHeader onFeedbackPress={() => setIsFeedbackModalVisible(true)} />

        <View className="relative w-full flex-1">
          {conversationStarted ? (
            <View className="flex-1 flex-col">
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
              <View className="mx-auto w-full max-w-3xl">
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
            // ONBOARDING (Zintegrowany tutaj dla uproszczenia)
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
              <View className="mx-auto w-full max-w-xl space-y-8">
                <View>
                  <Text className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
                    Nowa konsultacja
                  </Text>
                  <Text className="mb-4 text-4xl font-bold tracking-tight text-foreground">
                    Dzień dobry.
                  </Text>
                  <Text className="text-xl leading-relaxed text-muted-foreground">
                    Opisz swoje dolegliwości. Przeanalizuję je i przygotuję wstępną ocenę dla
                    lekarza.
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
                    <Text className="text-xsma font-medium text-muted-foreground">
                      Szyfrowane połączenie
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </View>

      <FeedbackModal
        visible={isFeedbackModalVisible}
        onClose={() => setIsFeedbackModalVisible(false)}
      />
    </View>
  );
};

export default ChatScreen;
