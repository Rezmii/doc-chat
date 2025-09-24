import { Feather } from '@expo/vector-icons';
import { TextInput, TouchableOpacity, View, Text } from 'react-native';

interface ChatInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSend: () => void;
  variant: 'onboarding' | 'chat';
}

const ChatInput = ({ inputText, setInputText, onSend, variant }: ChatInputProps) => {
  // Wariant dla ekranu startowego (duży input i przycisk)
  if (variant === 'onboarding') {
    return (
      <View className="w-full">
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Zacznij tutaj, np. 'Od wczoraj mam silny ból gardła...'"
          multiline
          className="mt-8 h-24 rounded-2xl border border-gray-300 bg-gray-100 p-4 text-base leading-6"
        />
        <TouchableOpacity
          onPress={onSend}
          className="mt-4 h-14 w-full items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30 active:bg-blue-700">
          <Text className="text-xl font-bold text-white">Rozpocznij analizę</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Wariant dla aktywnej rozmowy (mały, przyklejony do dołu)
  return (
    <View className="flex-row items-center space-x-2 border-t border-gray-200 bg-white p-2">
      <TextInput
        value={inputText}
        onChangeText={setInputText}
        onSubmitEditing={onSend}
        className="mr-2 h-11 flex-1 rounded-full border border-gray-300 bg-gray-100 px-4 text-base"
        placeholder="Napisz wiadomość..."
      />
      <TouchableOpacity
        onPress={onSend}
        className="h-11 w-11 items-center justify-center rounded-full bg-blue-600 active:bg-blue-700">
        <Feather name="send" size={22} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default ChatInput;
