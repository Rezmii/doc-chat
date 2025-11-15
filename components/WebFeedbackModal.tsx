import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';

const WEB3FORMS_ACCESS_KEY = process.env.EXPO_PUBLIC_WEB3FORMS_ACCESS_KEY;
const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

interface WebFeedbackModalProps {
  visible: boolean;
  onClose: () => void;
}

const WebFeedbackModal = ({ visible, onClose }: WebFeedbackModalProps) => {
  type FeedbackState = 'idle' | 'submitting' | 'submitted';
  const [state, setState] = useState<FeedbackState>('idle');
  const [comment, setComment] = useState('');

  const sendFeedback = async () => {
    if (!comment.trim()) {
      Alert.alert('Błąd', 'Wpisz treść opinii przed wysłaniem.');
      return;
    }
    setState('submitting');
    try {
      const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: 'Nowa opinia (AI Health Assistant - Web Footer)',
        comment,
        source: 'Web App Footer',
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
      Alert.alert('Błąd', 'Wystąpił błąd podczas wysyłania opinii.');
      setState('idle');
    }
  };

  const handleClose = () => {
    setState('idle');
    setComment('');
    onClose();
  };

  const renderContent = () => {
    if (state === 'submitting') {
      return (
        <View className="h-48 items-center justify-center p-8">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      );
    }

    if (state === 'submitted') {
      return (
        <View className="h-48 items-center justify-center p-8">
          <Feather name="check-circle" size={48} color="#16a34a" />
          <Text className="mt-4 text-xl font-semibold text-gray-800">Dziękujemy!</Text>
          <Text className="mt-2 text-base text-gray-600">Twoja opinia została wysłana.</Text>
        </View>
      );
    }

    // Stan 'idle'
    return (
      <View>
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Napisz, co myślisz, co możemy poprawić, lub jaki błąd znalazłeś/aś..."
          multiline
          autoFocus
          className="mt-4 h-32 w-full rounded-xl border border-gray-300 bg-white p-4 align-text-top text-base"
        />
        <TouchableOpacity
          onPress={sendFeedback}
          className="mt-4 h-12 w-full items-center justify-center rounded-xl bg-blue-600 active:bg-blue-700">
          <Text className="text-lg font-semibold text-white">Wyślij opinię</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={handleClose}>
      {/* Tło (przyciemnienie) */}
      <View
        className="flex-1 items-center justify-center bg-black/50"
        style={{ cursor: 'pointer' }}
        // @ts-ignore: `onPress` jest dostępny na View na webie
        onPress={handleClose}>
        {/* Okno Modala */}
        <View
          // @ts-ignore: `onPress` jest dostępny na View na webie
          onPress={(e) => e.stopPropagation()} // Zapobiegaj zamykaniu po kliknięciu w modal
          className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-gray-900">Podziel się opinią</Text>
            <TouchableOpacity
              onPress={handleClose}
              className="h-8 w-8 items-center justify-center rounded-full active:bg-gray-200">
              <Feather name="x" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <Text className="mt-2 text-base text-gray-600">
            Jesteśmy w fazie Beta. Każda informacja jest dla nas na wagę złota!
          </Text>
          {renderContent()}
        </View>
      </View>
    </Modal>
  );
};

export default WebFeedbackModal;
