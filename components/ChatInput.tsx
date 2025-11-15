import { Feather } from '@expo/vector-icons';
import { TextInput, TouchableOpacity, View, Text } from 'react-native';

interface ChatInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSend: () => void;
  variant: 'onboarding' | 'chat';
  disabled?: boolean;
  // =========CHANGE=========
  // Dodajemy opcjonalny prop `className`
  className?: string;
}

const ChatInput = ({
  inputText,
  setInputText,
  onSend,
  variant,
  disabled = false,
  // =========CHANGE=========
  // Odbieramy `className` i domyślnie ustawiamy na pusty string
  className = '',
}: ChatInputProps) => {
  if (variant === 'chat' && disabled) {
    return (
      // =========CHANGE=========
      // Dodajemy {className} do głównego View
      <View className={`items-center border-t border-gray-200 bg-white p-6 ${className}`}>
        <View className="flex-row items-center justify-center rounded-full bg-red-100 p-3">
          <Feather name="alert-octagon" size={24} color="#dc2626" />
        </View>
        <Text className="mt-3 text-lg font-semibold text-gray-800">Osiągnięto darmowy limit</Text>
        <Text className="mt-1 px-4 text-center text-base text-gray-500">
          Wykorzystałeś/aś 5 darmowych analiz w tym miesiącu.
        </Text>
        <Text className="mt-2 text-center text-sm text-gray-400">
          Limit odnowi się automatycznie za 30 dni.
        </Text>
      </View>
    );
  }

  // Wariant dla ekranu startowego (duży input i przycisk)
  if (variant === 'onboarding') {
    return (
      // =========CHANGE=========
      // Dodajemy {className} do głównego View
      <View className={`w-full ${className}`}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Zacznij tutaj, np. 'Od wczoraj mam silny ból gardła...'"
          multiline
          editable={!disabled}
          className={`mt-8 h-24 rounded-xl border border-gray-300 p-4 text-base leading-6 ${
            disabled ? 'bg-gray-200 text-gray-400' : 'bg-white'
          }`}
        />
        <TouchableOpacity
          onPress={onSend}
          disabled={disabled}
          className={`mt-4 w-full items-center justify-center rounded-xl py-4 shadow-lg shadow-blue-500/30 ${
            disabled ? 'bg-blue-300' : 'bg-blue-600 active:bg-blue-700'
          }`}>
          <Text className="text-lg font-semibold text-white">Rozpocznij analizę</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Wariant dla aktywnej rozmowy (mały, przyklejony do dołu)
  return (
    // =========CHANGE=========
    // Dodajemy {className} do głównego View
    <View
      className={`flex-row items-center gap-3 border-t border-gray-200 bg-white p-3 ${className}`}>
      <TextInput
        value={inputText}
        onChangeText={setInputText}
        onSubmitEditing={onSend}
        editable={!disabled}
        className={`h-11 flex-1 rounded-full bg-slate-100 px-5 text-base ${
          disabled ? 'bg-gray-200 text-gray-400' : 'bg-slate-100'
        }`}
        placeholder={disabled ? 'Osiągnięto limit...' : 'Napisz wiadomość...'}
      />
      <TouchableOpacity
        onPress={onSend}
        disabled={disabled}
        className={`h-11 w-11 items-center justify-center rounded-full ${
          disabled ? 'bg-gray-400' : 'bg-blue-600'
        }`}>
        <Feather name="send" size={22} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default ChatInput;
