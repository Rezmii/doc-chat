import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { AISummary } from '../types';
import ExportSummaryButton from './ExportSummaryButton';

// RNR Components
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Text } from './ui/text';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input'; // Przywracamy Input
import { Separator } from './ui/separator';
import { cn } from '../lib/utils';

const WEB3FORMS_ACCESS_KEY = process.env.EXPO_PUBLIC_WEB3FORMS_ACCESS_KEY;
const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

interface SummaryCardProps {
  summary: AISummary;
  messageId: string;
  listRef?: React.RefObject<FlatList<any> | null>;
  className?: string;
}

const Section = ({
  title,
  icon,
  children,
  className,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  className?: string;
}) => (
  <View className={cn('flex-row items-start gap-4', className)}>
    <View className="mt-1 h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
      <Feather name={icon} size={16} className="text-primary" color="#2563eb" />
    </View>
    <View className="flex-1 gap-1">
      <Text className="text-base font-semibold text-foreground">{title}</Text>
      <View className="text-sm text-muted-foreground">{children}</View>
    </View>
  </View>
);

// =========CHANGE=========
// Zaktualizowany FeedbackWidget z pełną logiką (komentarz przy dislike)
interface FeedbackWidgetProps {
  messageId: string;
  listRef?: React.RefObject<FlatList<any> | null>;
}

const FeedbackWidget = ({ messageId, listRef }: FeedbackWidgetProps) => {
  type FeedbackState = 'idle' | 'disliked' | 'submitting' | 'submitted';
  const [state, setState] = useState<FeedbackState>('idle');
  const [comment, setComment] = useState('');

  const sendFeedback = async (rating: 'like' | 'dislike', feedbackComment: string = '') => {
    setState('submitting');
    try {
      await fetch(WEB3FORMS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: 'Ocena raportu (AI Health Assistant)',
          messageId,
          rating,
          comment: feedbackComment,
        }),
      });
      setState('submitted');
    } catch (error) {
      console.error(error);
      // W razie błędu wróć do poprzedniego stanu
      setState(rating === 'like' ? 'idle' : 'disliked');
    }
  };

  // 1. Ładowanie
  if (state === 'submitting') {
    return (
      <View className="items-center justify-center gap-2 py-4">
        <ActivityIndicator size="small" color="#64748b" />
        <Text className="text-xs text-muted-foreground">Wysyłanie...</Text>
      </View>
    );
  }

  // 2. Sukces
  if (state === 'submitted') {
    return (
      <View className="w-full flex-row items-center justify-center gap-2 rounded-lg bg-green-50/50 py-4">
        <Feather name="check-circle" size={16} color="#16a34a" />
        <Text className="text-sm font-medium text-green-700">Dziękujemy za opinię!</Text>
      </View>
    );
  }

  // 3. Stan "Disliked" - pytamy o powód
  if (state === 'disliked') {
    return (
      <View className="w-full gap-3 py-2 animate-in fade-in slide-in-from-top-2">
        <Text className="text-sm font-medium text-foreground">Co możemy poprawić?</Text>
        <Input
          value={comment}
          onChangeText={setComment}
          placeholder="Twoja opinia..."
          multiline
          className="min-h-[80px] bg-background" // RNR style
          textAlignVertical="top"
          onFocus={() => {
            // Scrollujemy listę, żeby klawiatura nie zasłoniła pola (głównie mobile)
            setTimeout(() => {
              listRef?.current?.scrollToEnd({ animated: true });
            }, 100);
          }}
        />
        <View className="flex-row justify-end gap-2">
          <Button variant="ghost" size="sm" onPress={() => setState('idle')}>
            <Text>Anuluj</Text>
          </Button>
          <Button size="sm" className="bg-primary" onPress={() => sendFeedback('dislike', comment)}>
            <Text className="text-primary-foreground">Wyślij</Text>
          </Button>
        </View>
      </View>
    );
  }

  // 4. Stan 'idle' - Pytanie + Przyciski
  return (
    <View className="w-full items-center gap-3">
      <Text className="text-xs text-muted-foreground">Czy ta analiza była pomocna?</Text>
      <View className="flex-row gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full hover:border-green-200 hover:bg-green-50 active:bg-green-100"
          onPress={() => sendFeedback('like')}>
          <Feather
            name="thumbs-up"
            size={16}
            className="text-muted-foreground group-hover:text-green-600"
          />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full hover:border-red-200 hover:bg-red-50 active:bg-red-100"
          onPress={() => setState('disliked')}>
          <Feather
            name="thumbs-down"
            size={16}
            className="text-muted-foreground group-hover:text-red-600"
          />
        </Button>
      </View>
    </View>
  );
};

const SummaryCard = ({ summary, messageId, listRef, className }: SummaryCardProps) => {
  return (
    <Card className={cn('w-full bg-card/80 shadow-sm backdrop-blur-sm', className)}>
      <CardHeader className="flex-row items-start justify-between border-b border-border/40 pb-6">
        <View>
          <CardTitle className="text-2xl font-bold tracking-tight">Podsumowanie</CardTitle>
          <Text className="mt-1 text-sm text-muted-foreground">
            Wygenerowano przez AI Assistant
          </Text>
        </View>
        <ExportSummaryButton summary={summary} />
      </CardHeader>

      <CardContent className="gap-8 pt-8">
        <Section title="Twoje Objawy" icon="activity">
          <Text className="leading-relaxed text-foreground/90">{summary.summary}</Text>
        </Section>

        <Section title="Możliwe przyczyny" icon="compass">
          <View className="mt-1 gap-2">
            {summary.possibleCauses.map((cause, i) => (
              <View key={i} className="flex-row items-start gap-2">
                <View className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <Text className="text-foreground/90">{cause}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Sugerowany Specjalista" icon="user-check">
          <View className="mt-1 flex-row">
            <Badge variant="secondary" className="px-3 py-1.5">
              <Text className="text-sm font-semibold text-primary">
                {summary.recommendedSpecialist}
              </Text>
            </Badge>
          </View>
        </Section>

        <Section title="O co zapytać lekarza?" icon="help-circle">
          <View className="mt-1 gap-3">
            {summary.questionsForDoctor.map((q, i) => (
              <View key={i} className="rounded-lg border border-border/50 bg-secondary/50 p-3">
                <Text className="text-sm italic text-foreground">"{q}"</Text>
              </View>
            ))}
          </View>
        </Section>
      </CardContent>

      <CardFooter className="justify-center border-t border-border/40 bg-muted/5 pb-2 pt-6">
        {/* Przekazujemy listRef do widgetu, aby mógł scrollować przy pisaniu */}
        <FeedbackWidget messageId={messageId} listRef={listRef} />
      </CardFooter>
    </Card>
  );
};

export default SummaryCard;
