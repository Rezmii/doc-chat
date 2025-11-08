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
import ExportSummaryButton from './ExportSummaryButton';

interface SummaryCardProps {
  summary: AISummary;
  messageId: string;
  listRef: React.RefObject<FlatList<any> | null>;
}

const WEB3FORMS_ACCESS_KEY = 'TWOJ_WEB3FORMS_ACCESS_KEY';
const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

// ZMIANA: Komponent Section przebudowany zgodnie ze specyfikacją
const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
}) => (
  // ZMIANA: Zwiększony odstęp mt-6
  <View className="mt-6">
    {/* ZMIANA: opacity-90, ikona 16px, kolor #374151 */}
    <View className="flex-row items-center opacity-90">
      <Feather name={icon} size={16} color="#374151" />
      {/* ZMIANA: Styl nagłówka raportu */}
      <Text className="ml-2 text-sm font-semibold uppercase tracking-wider text-gray-700">
        {title}
      </Text>
    </View>
    {/* ZMIANA: Usunięto tło, padding i zaokrąglenie. Dodano mt-3 */}
    <View className="mt-3">{children}</View>
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
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const resData = await response.json();
      if (!resData.success) throw new Error(resData.message);
      setState('submitted');
    } catch (error) {
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

  // ZMIANA: Stan "Submitted" ze stylem
  if (state === 'submitted') {
    return (
      <View className="flex-row items-center justify-center py-4">
        <Feather name="check-circle" size={20} color="#16a34a" />
        <Text className="ml-2 text-base font-medium text-gray-700">
          Dziękujemy za Twoją opinię!
        </Text>
      </View>
    );
  }

  // Stan "Disliked"
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
          // ZMIANA: rounded-xl
          className="mt-2 h-20 w-full rounded-xl border border-gray-300 bg-white p-3 align-text-top text-base"
        />
        <TouchableOpacity
          onPress={() => sendFeedback('dislike', comment)}
          // ZMIANA: rounded-xl, bg-blue-600
          className="mt-2 h-11 w-full items-center justify-center rounded-xl bg-blue-600 active:bg-blue-700">
          <Text className="font-semibold text-white">Wyślij opinię</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Stan 'idle'
  return (
    // ZMIANA: Usunięto stałą wysokość
    <View className="items-center justify-center py-4">
      <Text className="text-base text-gray-600">Czy to było pomocne?</Text>
      <View className="mt-3 w-full flex-row justify-center gap-4">
        {/* ZMIANA: Mniejsze przyciski, rounded-xl */}
        <TouchableOpacity
          onPress={() => sendFeedback('like')}
          className="h-12 w-16 items-center justify-center rounded-xl bg-slate-200 active:bg-green-200">
          <Feather name="thumbs-up" size={20} color="#34d399" />
        </TouchableOpacity>
        {/* ZMIANA: Mniejsze przyciski, rounded-xl */}
        <TouchableOpacity
          onPress={() => setState('disliked')}
          className="h-12 w-16 items-center justify-center rounded-xl bg-slate-200 active:bg-red-200">
          <Feather name="thumbs-down" size={20} color="#f87171" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SummaryCard = ({ summary, messageId, listRef }: SummaryCardProps) => {
  return (
    // ZMIANA: Nowe style głównej karty
    <View className="mb-6 max-w-[95%] self-center rounded-xl bg-slate-50 p-5 shadow-lg">
      <View className="flex-row items-center justify-between border-b border-slate-200 pb-3">
        <View className="flex-1 flex-row items-center">
          <Feather name="check-circle" size={24} color="#16a34a" />
          {/* ZMIANA: Styl nagłówka */}
          <Text
            className="ml-3 text-xl font-semibold text-gray-900"
            numberOfLines={1}
            ellipsizeMode="tail">
            Podsumowanie Analizy
          </Text>
        </View>
        <ExportSummaryButton summary={summary} />
      </View>

      <Section title="Twoje Objawy" icon="activity">
        {/* ZMIANA: Styl "cytatu" */}
        <View className="rounded-lg border-l-4 border-slate-300 bg-slate-100 p-3">
          <Text className="text-base leading-relaxed text-gray-700">{summary.summary}</Text>
        </View>
      </Section>

      <Section title="Możliwe Kierunki" icon="compass">
        {/* ZMIANA: Nowy styl listy */}
        {summary.possibleCauses.map((cause, index) => (
          <Text key={index} className="mb-1 text-base font-medium text-gray-800">
            • {cause}
          </Text>
        ))}
      </Section>

      <Section title="Sugerowany Specjalista" icon="user-check">
        {/* ZMIANA: Styl "pigułki" */}
        <View className="flex-row flex-wrap">
          <View className="self-start rounded-full bg-blue-100 px-4 py-2">
            <Text className="text-base font-semibold text-blue-800">
              {summary.recommendedSpecialist}
            </Text>
          </View>
        </View>
      </Section>

      <Section title="Pytania do Lekarza" icon="help-circle">
        {summary.questionsForDoctor.map((question, index) => (
          <Text key={index} className="mb-1 text-base leading-6 text-gray-700">
            • {question}
          </Text>
        ))}
      </Section>

      {/* ZMIANA: Większy margines */}
      <View className="mt-6 border-t border-slate-200 pt-4">
        <FeedbackWidget messageId={messageId} listRef={listRef} />
      </View>

      {/* ZMIANA: Nowy, wyróżniony disclaimer */}
      <View className="mt-5 rounded-lg bg-slate-100 p-3">
        <View className="flex-row items-center">
          <Feather name="info" size={16} color="#4b5563" />
          <Text className="ml-2 flex-1 text-sm text-gray-600">
            To podsumowanie zostało wygenerowane przez AI. Pamiętaj, aby skonsultować się z
            prawdziwym lekarzem.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SummaryCard;
