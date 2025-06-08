import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import DoctorCard from '../components/DoctorCard';
import { Doctor, mockDoctors } from '../data/mockData';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'DoctorList'>;

const DoctorListScreen = ({ route, navigation }: Props) => {
  const { specialty } = route.params;

  const handleSelectDoctor = (doctor: Doctor) => {
    navigation.navigate('DoctorProfile', { doctorId: doctor.id });
  };

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
        data={mockDoctors}
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
