import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import ChatScreen from '../screens/ChatScreen';
import DoctorListScreen from '../screens/DoctorListScreen';
import DoctorProfileScreen from '../screens/DoctorProfileScreen';
import PrivateChatScreen from '../screens/PrivateChatScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Chat: undefined;
  DoctorList: { specialty: string };
  DoctorProfile: { doctorId: string };
  PrivateChat: { doctorId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="DoctorList" component={DoctorListScreen} />
        <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
        <Stack.Screen name="PrivateChat" component={PrivateChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
