import { Feather } from '@expo/vector-icons';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Button } from './ui/button';
import { Text } from './ui/text';
import { cn } from '../lib/utils';

interface ChatInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSend: () => void;
  variant: 'onboarding' | 'chat';
  disabled?: boolean;
  className?: string;
}

const ChatInput = ({
  inputText,
  setInputText,
  onSend,
  variant,
  disabled = false,
  className,
}: ChatInputProps) => {
  // Wariant 1: Limit (Alert) - bez zmian logicznych, tylko styl RNR
  if (variant === 'chat' && disabled) {
    return (
      <View
        className={cn(
          'mx-4 mb-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4',
          className
        )}>
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
            <Feather name="alert-octagon" size={20} className="text-destructive" color="#ef4444" />
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-destructive">Limit osiągnięty</Text>
            <Text className="text-xs text-muted-foreground">
              Wykorzystałeś darmowy limit na ten miesiąc.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // Wariant 2: Onboarding (Duży)
  if (variant === 'onboarding') {
    return (
      <View className={cn('w-full gap-4', className)}>
        <View className="relative">
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Opisz tutaj swoje objawy..."
            multiline
            editable={!disabled}
            className={cn(
              'min-h-[140px] w-full rounded-xl border border-input bg-background px-4 py-3 align-top text-base leading-relaxed placeholder:text-muted-foreground web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
              disabled && 'opacity-50'
            )}
            style={{ textAlignVertical: 'top' }}
          />
          {/* Ikona wewnątrz inputu (opcjonalnie) */}
          <View className="absolute bottom-3 right-3">
            <Feather name="edit-2" size={14} color="#94a3b8" />
          </View>
        </View>

        <Button
          onPress={onSend}
          disabled={disabled || !inputText.trim()}
          size="lg"
          className="h-12 w-full rounded-xl bg-primary shadow-sm transition-transform active:scale-[0.99]">
          <Text className="text-base font-semibold text-primary-foreground">
            Rozpocznij Analizę
          </Text>
          <Feather name="arrow-right" size={18} color="white" className="ml-2" />
        </Button>
      </View>
    );
  }

  // Wariant 3: Active Chat (Professional Toolbar)
  return (
    <View className={cn('w-full px-4 pb-4 pt-2', className)}>
      {/* ZMIANA: items-end -> items-center (żeby przycisk był idealnie w linii z tekstem) */}
      <View className="flex-row items-center gap-2 rounded-2xl border border-input bg-background p-2 shadow-sm transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30">
        {/* ZMIANA: Usunięto przycisk spinacza (TouchableOpacity) */}

        <TextInput
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={onSend}
          editable={!disabled}
          multiline
          placeholder={disabled ? 'Limit wyczerpany...' : 'Wpisz wiadomość...'}
          className="max-h-[120px] min-h-[40px] flex-1 py-2 text-base text-foreground placeholder:text-muted-foreground web:outline-none"
          // textAlignVertical: 'center' zapewnia, że tekst jest na środku inputu (Android)
          style={{ textAlignVertical: 'center' }}
        />

        <Button
          onPress={onSend}
          disabled={disabled || !inputText.trim()}
          size="icon"
          className="h-10 w-10 rounded-xl bg-primary shadow-sm hover:bg-primary/90">
          <Feather name="arrow-up" size={20} color="white" />
        </Button>
      </View>
      <Text className="mt-2 text-center text-[10px] text-muted-foreground">
        DocChat może popełniać błędy. Informacje mają charakter edukacyjny.
      </Text>
    </View>
  );
};

export default ChatInput;
