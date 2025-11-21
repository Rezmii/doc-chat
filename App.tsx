import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PortalHost } from '@rn-primitives/portal'; // <--- Import
import AppNavigator from './navigation/AppNavigator';
import './global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
      <PortalHost /> {/* <--- Dodaj to tutaj, na samym końcu */}
    </SafeAreaProvider>
  );
}
