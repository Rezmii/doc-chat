// App.tsx
import { StatusBar } from 'expo-status-bar';
import { Text, View, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import './global.css';

export default function App() {
  return (
    // Używamy SafeAreaView, aby treść nie wchodziła pod "notcha" w iPhonach
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-6">
        {/* Kontener na treść */}
        <View className="w-full">
          {/* Główny nagłówek */}
          <Text className="text-center text-4xl font-bold text-gray-800">
            Jak możemy Ci dzisiaj pomóc?
          </Text>

          {/* Podtytuł z zastrzeżeniem */}
          <Text className="mt-4 text-center text-base text-gray-500">
            Pamiętaj, AI to tylko wstępna sugestia. Ostateczną diagnozę może postawić wyłącznie
            lekarz.
          </Text>

          {/* Pole do wpisywania objawów */}
          <TextInput
            className="mt-12 h-14 w-full rounded-xl border border-gray-200 bg-gray-100 px-4 text-lg"
            placeholder="Opisz swoje objawy lub zadaj pytanie..."
            placeholderTextColor="#9CA3AF" // Kolor placeholder'a
          />

          {/* Przycisk akcji */}
          <TouchableOpacity
            className="mt-4 h-14 w-full items-center justify-center rounded-xl bg-blue-500"
            activeOpacity={0.8}>
            <Text className="text-lg font-semibold text-white">Rozpocznij czat z AI</Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
