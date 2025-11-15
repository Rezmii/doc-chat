import { useRef, useState } from 'react';
import { FlatList, Keyboard } from 'react-native';
import { AISummary, ApiChatMessage, Message, AIResponse } from '../types';
import { postChatMessage } from '../services/api';

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

export const useChat = () => {
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

  return {
    messages,
    isTyping,
    conversationStarted,
    inputText,
    setInputText,
    isLimitReached,
    flatListRef,
    handleSend,
    scrollToBottom,
  };
};
