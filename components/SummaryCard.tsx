import { Feather } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { AISummary } from '../types';

interface SummaryCardProps {
  summary: AISummary;
}

const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
}) => (
  <View className="mt-4">
    <View className="flex-row items-center">
      <Feather name={icon} size={18} color="#4b5563" />
      <Text className="ml-2 text-lg font-bold text-gray-800">{title}</Text>
    </View>
    <View className="mt-2 rounded-lg bg-white p-3">{children}</View>
  </View>
);

const SummaryCard = ({ summary }: SummaryCardProps) => {
  return (
    <View className="mb-6 max-w-[95%] self-center rounded-2xl bg-slate-100 p-4 shadow-sm">
      <View className="flex-row items-center border-b border-slate-200 pb-3">
        <Feather name="check-circle" size={24} color="#16a34a" />
        <Text className="ml-3 text-xl font-bold text-gray-800">Podsumowanie Analizy</Text>
      </View>

      <Section title="Twoje Objawy" icon="activity">
        <Text className="text-base text-gray-700">{summary.summary}</Text>
      </Section>

      <Section title="Możliwe Kierunki" icon="compass">
        {summary.possibleCauses.map((cause, index) => (
          <Text key={index} className="text-base leading-6 text-gray-700">
            • {cause}
          </Text>
        ))}
      </Section>

      <Section title="Sugerowany Specjalista" icon="user-check">
        <Text className="text-base font-bold text-blue-600">{summary.recommendedSpecialist}</Text>
      </Section>

      <Section title="Pytania do Lekarza" icon="help-circle">
        {summary.questionsForDoctor.map((question, index) => (
          <Text key={index} className="mb-1 text-base leading-6 text-gray-700">
            • {question}
          </Text>
        ))}
      </Section>

      <Text className="mt-4 text-center text-xs text-gray-500">
        To podsumowanie zostało wygenerowane przez AI. Pamiętaj, aby skonsultować się z prawdziwym
        lekarzem.
      </Text>
    </View>
  );
};

export default SummaryCard;
