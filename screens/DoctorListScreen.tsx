import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
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
  const { specialty } = route.params;

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data: DoctorFromAPI[] = await getDoctors();
        const formattedDoctors: Doctor[] = data.map((d) => ({
          id: d.id,
          name: d.user.name,
          specialty: d.specialty,
          rating: d.rating,
          reviews: 0,
          photoUrl: `https://avatar.iran.liara.run/public/boy?username=${d.id}`,
          nextAvailable: 'Dostępny',
          bio: d.bio,
        }));

        setDoctors(formattedDoctors);
      } catch (e) {
        setError('Nie można było załadować lekarzy. Spróbuj ponownie później.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

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
          Polecani Lekarze ({specialty})
        </Text>
      </View>

      {/* Komponent FlatList do wyświetlenia listy */}
      <FlatList
        data={doctors}
        renderItem={({ item }) => (
          <DoctorCard doctor={item} onPress={() => handleSelectDoctor(item)} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
};

export default DoctorListScreen;
