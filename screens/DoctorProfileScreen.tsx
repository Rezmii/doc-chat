import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Doctor } from 'types';
import { getDoctorById } from 'services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'DoctorProfile'>;

const DoctorProfileScreen = ({ route, navigation }: Props) => {
  const { doctorId } = route.params;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const data: Doctor = await getDoctorById(doctorId);

        setDoctor(data);
      } catch (e) {
        setError('Wystąpił błąd podczas ładowania profilu.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [doctorId]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  if (error || !doctor) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 p-4">
        <Text className="text-lg text-red-600">{error || 'Nie znaleziono lekarza.'}</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-4 rounded-lg bg-gray-200 px-4 py-2">
          <Text>Wróć</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView>
        <View className="bg-white p-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute left-4 top-4 z-10 p-2">
            <Feather name="chevron-left" size={28} color="#334155" />
          </TouchableOpacity>
          <View className="items-center">
            <Image
              source={{ uri: `https://avatar.iran.liara.run/public/boy?username=${doctor.id}` }}
              className="h-28 w-28 rounded-full border-4 border-white"
            />
            <Text className="mt-4 text-2xl font-bold text-gray-800">{doctor.name}</Text>
            <Text className="text-base text-gray-500">{doctor.specialty}</Text>
          </View>
        </View>

        <View className="mt-4 flex-row justify-around bg-white p-4">
          <View className="items-center">
            <Text className="text-lg font-bold text-blue-600">{doctor.rating.toFixed(1)}</Text>
            <Text className="text-sm text-gray-500">Ocena</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold text-blue-600">10+</Text>
            <Text className="text-sm text-gray-500">Lat doświadczenia</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold text-blue-600">100+</Text>
            <Text className="text-sm text-gray-500">Opinii</Text>
          </View>
        </View>

        <View className="mt-4 bg-white p-4">
          <Text className="text-xl font-bold text-gray-800">O mnie</Text>
          <Text className="mt-2 text-base leading-6 text-gray-600">{doctor.bio}</Text>
        </View>
      </ScrollView>

      <View className="border-t border-gray-200 bg-white p-4">
        <TouchableOpacity
          onPress={() => navigation.navigate('PrivateChat', { doctorId: doctor.id })}
          className="h-14 w-full items-center justify-center rounded-xl bg-blue-600 active:bg-blue-700">
          <Text className="text-lg font-semibold text-white">Rozpocznij czat z lekarzem</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DoctorProfileScreen;
