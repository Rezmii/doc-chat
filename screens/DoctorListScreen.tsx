import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState, useMemo } from 'react';
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
import { Doctor, DoctorFromAPI } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'DoctorList'>;

const DoctorListScreen = ({ route, navigation }: Props) => {
  const { specialties } = route.params;

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const groupedDoctors = useMemo(() => {
    if (doctors.length === 0) return [];

    const groups: { [key: string]: Doctor[] } = doctors.reduce(
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

    return Object.keys(groups).map((specialty) => ({
      title: specialty,
      data: groups[specialty],
    }));
  }, [doctors]);

  useEffect(() => {
    const fetchAndFilterDoctors = async (specs: string[]) => {
      setIsLoading(true);
      setInfoMessage(null);
      try {
        const data = await getDoctors(specs);
        if (data.length === 0) {
          if (specs[0] !== 'Lekarz Rodzinny') {
            setInfoMessage(
              `Niestety, nie mamy obecnie dostępnych specjalistów z dziedzin: ${specs.join(', ')}. Proponujemy konsultację z lekarzem rodzinnym.`
            );

            fetchAndFilterDoctors(['Lekarz Rodzinny']);
            return;
          } else {
            setInfoMessage('Niestety, nie mamy obecnie dostępnych lekarzy rodzinnych.');
          }
        } else {
          const foundSpecs = [...new Set(data.map((d) => d.specialty))];
          const missingSpecs = specs.filter(
            (s) => !foundSpecs.includes(s) && s !== 'Lekarz Rodzinny'
          );
          if (missingSpecs.length > 0) {
            setInfoMessage(
              `Znaleziono specjalistów z dziedziny: ${foundSpecs.join(', ')}. Brak dostępnych lekarzy dla: ${missingSpecs.join(', ')}.`
            );
          }
        }

        const formattedDoctors: Doctor[] = data.map((d) => ({
          id: d.id,
          name: d.user.name,
          specialty: d.specialty,
          rating: d.rating,
          bio: d.bio,
          reviews: 0,
          photoUrl: d.photoUrl || `https://avatar.iran.liara.run/public/boy?username=${d.id}`,
          nextAvailable: 'Dostępny',
        }));
        setDoctors(formattedDoctors);
      } catch (e) {
        setError('Nie można było załadować lekarzy. Spróbuj ponownie później.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndFilterDoctors(specialties);
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
        <View className="border-b border-yellow-200 bg-yellow-100 p-4">
          <Text className="text-center text-yellow-800">{infoMessage}</Text>
        </View>
      )}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <SectionList
          sections={groupedDoctors}
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
      )}
    </SafeAreaView>
  );
};

export default DoctorListScreen;
