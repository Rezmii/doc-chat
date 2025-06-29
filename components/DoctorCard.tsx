import { Feather } from '@expo/vector-icons';
import { Doctor } from '../types';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface DoctorCardProps {
  doctor: Doctor;
  onPress: () => void;
}

const DoctorCard = ({ doctor, onPress }: DoctorCardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mb-4 flex-row items-center rounded-2xl bg-white p-4 shadow-sm"
      activeOpacity={0.8}>
      {/* Zdjęcie lekarza */}
      <Image
        source={{ uri: doctor.photoUrl || 'https://avatar.iran.liara.run/public/boy' }}
        className="mr-4 h-20 w-20 rounded-full"
      />

      {/* Kontener na informacje tekstowe */}
      <View className="flex-1">
        <Text className="text-lg font-bold text-gray-800">{doctor.name}</Text>
        <Text className="text-sm text-gray-500">{doctor.specialty}</Text>

        {/* Informacje o ocenach */}
        <View className="mt-2 flex-row items-center">
          <Feather name="star" size={16} color="#f59e0b" />
          <Text className="ml-1 font-semibold text-gray-700">{doctor.rating.toFixed(1)}</Text>
          <Text className="ml-2 text-xs text-gray-400">({doctor.reviews} opinii)</Text>
        </View>

        {/* Informacje o dostępności */}
        <Text className="mt-2 text-xs font-semibold text-green-600">{doctor.nextAvailable}</Text>
      </View>

      {/* Strzałka wskazująca na możliwość interakcji */}
      <View>
        <Feather name="chevron-right" size={24} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );
};

export default DoctorCard;
