import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { ActivityIndicator, View } from 'react-native';
import NavegacaoPrincipal from './src/navigation/NavegacaoPrincipal';
import { cores } from './src/theme/cores';
import { VLibrasProvider } from './src/contexts/VLibrasProvider';

export default function App() {
  const [fontesCarregadas] = useFonts({
    PlayfairDisplay_700Bold,
  });

  if (!fontesCarregadas) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: cores.fundo }}>
        <ActivityIndicator size="large" color={cores.destaque} />
      </View>
    );
  }

  return (
    <VLibrasProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <NavegacaoPrincipal />
      </NavigationContainer>
    </VLibrasProvider>
  );
}
