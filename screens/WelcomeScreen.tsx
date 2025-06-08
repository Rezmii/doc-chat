// src/screens/WelcomeScreen.tsx

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen = ({ navigation }: Props) => {
  const handleNavigateToChat = () => {
    navigation.navigate('Chat');
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Usunęliśmy ScrollView i KeyboardAvoidingView, 
        ponieważ na tym ekranie nie ma już pól tekstowych i nie są potrzebne.
      */}
      <View className="flex-1 items-center justify-center p-6 text-center">
        {/* Kontener na główną treść */}
        <View className="w-full max-w-md items-center">
          <Text className="text-7xl">🩺</Text>

          <Text className="mt-6 text-center text-4xl font-bold text-gray-800">
            Wstępna Analiza Objawów
          </Text>

          <Text className="mt-4 text-center text-lg text-gray-600">
            Odpowiedz na kilka pytań naszego asystenta AI, aby uzyskać wstępną ocenę i rekomendację
            specjalisty.
          </Text>

          <TouchableOpacity
            onPress={handleNavigateToChat}
            className="mt-12 h-16 w-full items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30 active:bg-blue-700"
            activeOpacity={0.8}>
            <Text className="text-xl font-bold text-white">Rozpocznij Konsultację z AI</Text>
          </TouchableOpacity>

          <Text className="mt-4 text-center text-xs text-gray-400">
            Pamiętaj, AI to tylko wstępna sugestia. Ostateczną diagnozę może postawić wyłącznie
            lekarz.
          </Text>
        </View>

        {/* Kontener na link logowania, "przyklejony" do dołu */}
        <View className="absolute bottom-10">
          <TouchableOpacity>
            <Text className="text-center text-base text-gray-500">
              Masz już konto? <Text className="font-bold text-blue-600">Zaloguj się</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default WelcomeScreen;
