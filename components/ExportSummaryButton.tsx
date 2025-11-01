import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Share, TouchableOpacity, Alert, Platform } from 'react-native';
import { AISummary } from '../types';

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
    <TouchableOpacity
      onPress={onShare}
      className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-200">
      <Feather name="share-2" size={22} color="#6b7280" />
    </TouchableOpacity>
  );
};

export default ExportSummaryButton;
