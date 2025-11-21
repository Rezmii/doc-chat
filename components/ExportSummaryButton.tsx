import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Share, Alert } from 'react-native';
import { AISummary } from '../types';
import { Button } from './ui/button'; // Używamy komponentu RNR

/**
 * Konwertuje obiekt podsumowania na czytelny, sformatowany tekst
 * gotowy do udostępnienia lub skopiowania.
 */
const formatSummaryForShare = (summary: AISummary): string => {
  const title = '🩺 WSTĘPNA ANALIZA OBJAWÓW';
  const divider = '────────────────────';
  const disclaimer =
    'Wygenerowano przez AI Health Assistant. Pamiętaj, że to nie jest diagnoza medyczna i należy skonsultować się z lekarzem.';

  const sections = [
    {
      icon: '📋',
      title: 'TWOJE OBJAWY',
      content: summary.summary,
    },
    {
      icon: '🧭',
      title: 'MOŻLIWE KIERUNKI',
      content: summary.possibleCauses.map((c) => `• ${c}`).join('\n'),
    },
    {
      icon: '👨‍⚕️',
      title: 'SUGEROWANY SPECJALISTA',
      content: summary.recommendedSpecialist,
    },
    {
      icon: '❓',
      title: 'SUGEROWANE PYTANIA DO LEKARZA',
      content: summary.questionsForDoctor.map((q) => `• ${q}`).join('\n'),
    },
  ];

  const formattedSections = sections.map((s) => `${s.icon} ${s.title}:\n${s.content}`).join('\n\n');

  return `${title}\n${divider}\n\n${formattedSections}\n\n${divider}\n${disclaimer}`;
};

/**
 * Przycisk, który otwiera natywny arkusz udostępniania (Share Sheet)
 * z sformatowanym podsumowaniem.
 */
const ExportSummaryButton = ({ summary }: { summary: AISummary }) => {
  const onShare = async () => {
    try {
      const formattedMessage = formatSummaryForShare(summary);
      await Share.share(
        {
          message: formattedMessage,
          title: 'Moje Podsumowanie Analizy Objawów', // 'title' jest używany np. jako temat e-maila
        },
        {
          // DialogTitle (tylko Android)
          dialogTitle: 'Udostępnij podsumowanie',
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Błąd', 'Nie udało się udostępnić podsumowania.');
      }
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-10 w-10 rounded-full hover:bg-secondary active:bg-secondary/80"
      onPress={onShare}>
      <Feather name="share-2" size={20} className="text-muted-foreground" />
    </Button>
  );
};

export default ExportSummaryButton;
