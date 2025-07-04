import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SectionList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DoctorCard from '../components/DoctorCard';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getDoctors } from '../services/api';
import { Doctor } from '../types';

interface DoctorSection {
  title: string;
  data: Doctor[];
}

type Props = NativeStackScreenProps<RootStackParamList, 'DoctorList'>;

const DoctorListScreen = ({ route, navigation }: Props) => {
  const { specialties } = route.params;

  const [sections, setSections] = useState<DoctorSection[]>([]);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      setError(null);
      setInfoMessage(null);

      try {
        const recommendedDoctorsData = await getDoctors(specialties);

        if (recommendedDoctorsData.length > 0) {
          const formattedDoctors: Doctor[] = recommendedDoctorsData.map((d) => ({
            id: d.id,
            name: d.user.name,
            specialty: d.specialty,
            rating: d.rating,
            bio: d.bio,
            reviews: 0,
            photoUrl: d.photoUrl || `https://avatar.iran.liara.run/public/boy?username=${d.id}`,
            nextAvailable: 'Dostępny',
          }));

          const groups: { [key: string]: Doctor[] } = formattedDoctors.reduce(
            (acc, doctor) => {
              const { specialty } = doctor;
              if (!acc[specialty]) {
                acc[specialty] = [];
              }
              acc[specialty].push(doctor);
              return acc;
            },
            {} as { [key: string]: Doctor[] }
          );

          const foundSections = Object.keys(groups).map((specialty) => ({
            title: specialty,
            data: groups[specialty],
          }));
          setSections(foundSections);

          const foundSpecs = [...new Set(formattedDoctors.map((d) => d.specialty))];
          const missingSpecs = specialties.filter((s) => !foundSpecs.includes(s));
          if (missingSpecs.length > 0) {
            setInfoMessage(
              `Znaleziono specjalistów z dziedziny: ${foundSpecs.join(
                ', '
              )}. Brak dostępnych lekarzy dla: ${missingSpecs.join(', ')}.`
            );
          }
        } else {
          setInfoMessage(
            `Niestety, nie mamy obecnie dostępnych specjalistów z dziedzin: ${specialties.join(
              ', '
            )}. Poniżej znajdziesz listę dostępnych lekarzy rodzinnych, którzy mogą Ci pomóc.`
          );

          const familyDoctorsData = await getDoctors(['Lekarz Rodzinny']);

          if (familyDoctorsData.length > 0) {
            const formattedFamilyDoctors: Doctor[] = familyDoctorsData.map((d) => ({
              id: d.id,
              name: d.user.name,
              specialty: d.specialty,
              rating: d.rating,
              bio: d.bio,
              reviews: 0,
              photoUrl: d.photoUrl || `https://avatar.iran.liara.run/public/boy?username=${d.id}`,
              nextAvailable: 'Dostępny',
            }));
            setSections([{ title: 'Proponowani lekarze rodzinni', data: formattedFamilyDoctors }]);
          } else {
            setInfoMessage(
              `Niestety, w tym momencie nie znaleźliśmy żadnych dostępnych specjalistów z dziedzin: ${specialties.join(
                ', '
              )}, ani lekarzy rodzinnych.`
            );
            setSections([]);
          }
        }
      } catch (e) {
        setError('Nie można było załadować lekarzy. Spróbuj ponownie później.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, [specialties]);

  const handleSelectDoctor = (doctor: Doctor) => {
    navigation.navigate('DoctorProfile', { doctorId: doctor.id });
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-row items-center border-b border-gray-200 bg-white p-3">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Feather name="chevron-left" size={28} color="#334155" />
        </TouchableOpacity>
        <Text className="mr-10 flex-1 text-center text-xl font-bold text-gray-800">
          Polecani Specjaliści
        </Text>
      </View>

      {infoMessage && (
        <View className="m-4 flex-row items-start rounded-lg bg-blue-50 p-4">
          <Feather name="info" size={20} color="#1d4ed8" className="mr-3 mt-0.5" />
          <Text className="flex-1 text-base text-blue-800">{infoMessage}</Text>
        </View>
      )}

      {sections.length > 0 ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DoctorCard doctor={item} onPress={() => handleSelectDoctor(item)} />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text className="px-1 pb-3 pt-6 text-lg font-bold text-gray-800">{title}</Text>
          )}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          SectionSeparatorComponent={null}
          stickySectionHeadersEnabled={false}
        />
      ) : (
        !isLoading && (
          <View className="flex-1 items-center justify-center p-5">
            <Text className="text-center text-lg text-gray-600">
              Nie znaleziono żadnych dostępnych lekarzy. Spróbuj ponownie później.
            </Text>
          </View>
        )
      )}
    </SafeAreaView>
  );
};

export default DoctorListScreen;
