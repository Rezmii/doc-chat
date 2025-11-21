import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { Button } from './ui/button';
import { Text } from './ui/text';
import { Input } from './ui/input';
// ZMIANA: Używamy Dialogu zamiast Modal+Card
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';

const WEB3FORMS_ACCESS_KEY = process.env.EXPO_PUBLIC_WEB3FORMS_ACCESS_KEY;
const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
}

const FeedbackModal = ({ visible, onClose }: FeedbackModalProps) => {
  type FeedbackState = 'idle' | 'submitting' | 'submitted';
  const [state, setState] = useState<FeedbackState>('idle');
  const [comment, setComment] = useState('');

  const sendFeedback = async () => {
    if (!comment.trim()) return;

    setState('submitting');
    try {
      const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: 'Nowa opinia (AI Health Assistant)',
        comment,
        source: Platform.OS === 'web' ? 'Web App' : 'Mobile App',
      };
      const response = await fetch(WEB3FORMS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const resData = await response.json();
      if (!resData.success) throw new Error(resData.message);
      setState('submitted');
      setComment('');
    } catch (error) {
      console.error(error);
      setState('idle');
    }
  };

  const handleClose = () => {
    // Resetujemy stan tylko jeśli modal jest zamykany, a nie był w trakcie wysyłania
    if (state !== 'submitting') {
      setState('idle');
      setComment('');
      onClose();
    }
  };

  // Funkcja pomocnicza do renderowania treści w zależności od stanu
  const renderContent = () => {
    if (state === 'submitting') {
      return (
        <View className="items-center justify-center gap-4 py-12">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="text-sm text-muted-foreground">Wysyłanie opinii...</Text>
        </View>
      );
    }

    if (state === 'submitted') {
      return (
        <View className="items-center justify-center gap-6 py-10">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Feather name="check" size={32} color="#16a34a" />
          </View>
          <View className="items-center gap-1">
            <Text className="text-xl font-semibold text-foreground">Dziękujemy!</Text>
            <Text className="text-center text-muted-foreground">
              Twoja opinia jest dla nas bardzo cenna.
            </Text>
          </View>
          <Button variant="outline" className="w-full" onPress={handleClose}>
            <Text>Zamknij</Text>
          </Button>
        </View>
      );
    }

    // Stan IDLE
    return (
      <View className="gap-4">
        <DialogHeader>
          <DialogTitle>Zgłoś uwagę</DialogTitle>
          <DialogDescription>
            Jesteśmy w fazie Beta. Znalazłeś błąd? Masz pomysł? Napisz nam o tym.
          </DialogDescription>
        </DialogHeader>

        <Input
          multiline
          numberOfLines={4}
          placeholder="Opisz swój problem lub sugestię..."
          value={comment}
          onChangeText={setComment}
          className="min-h-[120px] p-3 align-top text-base"
          textAlignVertical="top"
          // Autofocus działa najlepiej na webie wewnątrz Dialogu
          autoFocus={Platform.OS === 'web'}
        />

        <DialogFooter>
          <View className="mt-2 flex-row justify-end gap-2">
            <Button variant="ghost" onPress={handleClose}>
              <Text>Anuluj</Text>
            </Button>
            <Button onPress={sendFeedback} disabled={!comment.trim()}>
              <Text>Wyślij</Text>
            </Button>
          </View>
        </DialogFooter>
      </View>
    );
  };

  return (
    <Dialog open={visible} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      {/* DialogContent w RNR automatycznie obsługuje:
        - Overlay (przyciemnienie tła)
        - Centrowanie na środku ekranu
        - Animacje wejścia/wyjścia
        - Wygląd "Karty" (białe tło, cień, zaokrąglenie)
        - Obsługę klawisza ESC na webie
      */}
      <DialogContent className="sm:max-w-[425px]">{renderContent()}</DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
