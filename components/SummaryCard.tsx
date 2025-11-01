import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { AISummary } from '../types';

interface SummaryCardProps {
  summary: AISummary;
  messageId: string;
  listRef: React.RefObject<FlatList<any> | null>;
}

const WEB3FORMS_ACCESS_KEY = '58046f88-45f0-498b-a225-23bf16d7429e';
const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
}) => (
  <View className="mt-4">
    <View className="flex-row items-center">
      <Feather name={icon} size={18} color="#4b5563" />
      <Text className="ml-2 text-lg font-bold text-gray-800">{title}</Text>
    </View>
    <View className="mt-2 rounded-lg bg-white p-3">{children}</View>
  </View>
);

interface FeedbackWidgetProps {
  messageId: string;
  listRef: React.RefObject<FlatList<any> | null>;
}

const FeedbackWidget = ({ messageId, listRef }: FeedbackWidgetProps) => {
  type FeedbackState = 'idle' | 'disliked' | 'submitting' | 'submitted';
  const [state, setState] = useState<FeedbackState>('idle');
  const [comment, setComment] = useState('');

  const sendFeedback = async (rating: 'like' | 'dislike', comment: string = '') => {
    setState('submitting');
    try {
      const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: 'Nowa opinia (AI Health Assistant)',
        messageId,
        rating,
        comment,
      };

      const response = await fetch(WEB3FORMS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!resData.success) {
        throw new Error(resData.message || 'Nie udało się wysłać opinii.');
      }

      setState('submitted');
    } catch (error) {
      console.error('Błąd wysyłania opinii:', error);
      Alert.alert('Błąd', 'Wystąpił błąd podczas wysyłania opinii.');
      setState(rating === 'like' ? 'idle' : 'disliked');
    }
  };

  if (state === 'submitting') {
    return (
      <View className="h-28 items-center justify-center">
        <ActivityIndicator size="small" color="#6b7280" />
      </View>
    );
  }

  if (state === 'submitted') {
    return (
      <View className="items-center py-2">
        <Text className="text-base text-gray-600">Dziękujemy za Twoją opinię!</Text>
      </View>
    );
  }

  if (state === 'disliked') {
    return (
      <View className="w-full">
        <Text className="text-base font-semibold text-gray-700">Co możemy poprawić?</Text>
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Twoja opinia..."
          multiline
          autoFocus
          onFocus={() => {
            setTimeout(() => {
              listRef.current?.scrollToEnd({ animated: true });
            }, 100);
          }}
          className="mt-2 h-20 w-full rounded-lg border border-gray-300 bg-white p-3 align-text-top text-base"
        />
        <TouchableOpacity
          onPress={() => sendFeedback('dislike', comment)}
          className="mt-2 h-11 w-full items-center justify-center rounded-lg bg-gray-800 active:bg-gray-600">
          <Text className="font-semibold text-white">Wyślij opinię</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Stan 'idle'
  return (
    <View className="h-28 items-center justify-center">
      <Text className="text-base text-gray-600">Czy to było pomocne?</Text>
      <View className="mt-3 w-full flex-row justify-center gap-4">
        <TouchableOpacity
          onPress={() => sendFeedback('like')}
          className="h-14 w-20 items-center justify-center rounded-2xl bg-gray-200 active:bg-green-200">
          <Feather name="thumbs-up" size={24} color="#34d399" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setState('disliked')}
          className="h-14 w-20 items-center justify-center rounded-2xl bg-gray-200 active:bg-red-200">
          <Feather name="thumbs-down" size={24} color="#f87171" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SummaryCard = ({ summary, messageId, listRef }: SummaryCardProps) => {
  return (
    <View className="mb-6 max-w-[95%] self-center rounded-2xl bg-slate-100 p-4 shadow-sm">
      <View className="flex-row items-center border-b border-slate-200 pb-3">
        <Feather name="check-circle" size={24} color="#16a34a" />
        <Text className="ml-3 text-xl font-bold text-gray-800">Podsumowanie Analizy</Text>
      </View>

      <Section title="Twoje Objawy" icon="activity">
        <Text className="text-base text-gray-700">{summary.summary}</Text>
      </Section>

      <Section title="Możliwe Kierunki" icon="compass">
        {summary.possibleCauses.map((cause, index) => (
          <Text key={index} className="text-base leading-6 text-gray-700">
            • {cause}
          </Text>
        ))}
      </Section>

      <Section title="Sugerowany Specjalista" icon="user-check">
        <Text className="text-base font-bold text-blue-600">{summary.recommendedSpecialist}</Text>
      </Section>

      <Section title="Pytania do Lekarza" icon="help-circle">
        {summary.questionsForDoctor.map((question, index) => (
          <Text key={index} className="mb-1 text-base leading-6 text-gray-700">
            • {question}
          </Text>
        ))}
      </Section>

      <View className="mt-4 border-t border-slate-200 pt-4">
        <FeedbackWidget messageId={messageId} listRef={listRef} />
      </View>

      <Text className="mt-4 text-center text-xs text-gray-500">
        To podsumowanie zostało wygenerowane przez AI. Pamiętaj, aby skonsultować się z prawdziwym
        lekarzem.
      </Text>
    </View>
  );
};

export default SummaryCard;
