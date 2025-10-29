import { Feather } from '@expo/vector-icons';
import { TextInput, TouchableOpacity, View, Text } from 'react-native';

interface ChatInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSend: () => void;
  variant: 'onboarding' | 'chat';
  disabled?: boolean;
}

const ChatInput = ({
  inputText,
  setInputText,
  onSend,
  variant,
  disabled = false,
}: ChatInputProps) => {
  if (variant === 'chat' && disabled) {
    return (
      <View className="items-center border-t border-gray-200 bg-white p-6">
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
        {/* W przyszłości tutaj dodamy przycisk "Upgrade do Pro" */}
      </View>
    );
  }

  if (variant === 'onboarding') {
    return (
      <View className="w-full">
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Zacznij tutaj, np. 'Od wczoraj mam silny ból gardła...'"
          multiline
          editable={!disabled}
          className={`mt-8 h-24 rounded-2xl border border-gray-300 p-4 text-base leading-6 ${
            disabled ? 'bg-gray-200 text-gray-400' : 'bg-gray-100'
          }`}
        />
        <TouchableOpacity
          onPress={onSend}
          disabled={disabled}
          className={`mt-4 h-14 w-full items-center justify-center rounded-2xl shadow-lg shadow-blue-500/30 ${
            disabled ? 'bg-blue-300' : 'bg-blue-600 active:bg-blue-700'
          }`}>
          <Text className="text-xl font-bold text-white">Rozpocznij analizę</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-row items-center space-x-2 border-t border-gray-200 bg-white p-2">
      <TextInput
        value={inputText}
        onChangeText={setInputText}
        onSubmitEditing={onSend}
        editable={!disabled}
        className={`mr-2 h-11 flex-1 rounded-full border border-gray-300 px-4 text-base ${
          disabled ? 'bg-gray-200 text-gray-400' : 'bg-gray-100'
        }`}
        placeholder={disabled ? 'Osiągnięto limit...' : 'Napisz wiadomość...'}
      />
      <TouchableOpacity
        onPress={onSend}
        disabled={disabled}
        className={`h-11 w-11 items-center justify-center rounded-full ${
          disabled ? 'bg-gray-400' : 'bg-blue-600 active:bg-blue-700'
        }`}>
        <Feather name="send" size={22} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default ChatInput;
