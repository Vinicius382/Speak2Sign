import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaLogin from '../screens/TelaLogin';
import TelaCadastro from '../screens/TelaCadastro';
import TelaInicial from '../screens/TelaInicial';
import TelaNovaTraducao from '../screens/TelaNovaTraducao';
import TelaDigitarMensagem from '../screens/TelaDigitarMensagem';
import TelaResultadoLibras from '../screens/TelaResultadoLibras';
import TelaFalarMensagem from '../screens/TelaFalarMensagem';

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Inicial: undefined;
  NovaTraducao: undefined;
  DigitarMensagem: undefined;
  FalarMensagem: undefined;
  ResultadoLibras: { texto: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const NavegacaoPrincipal: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}
    >
      <Stack.Screen name="Login" component={TelaLogin} />
      <Stack.Screen name="Cadastro" component={TelaCadastro} />
      <Stack.Screen
        name="Inicial"
        component={TelaInicial}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name="NovaTraducao" component={TelaNovaTraducao} />
      <Stack.Screen name="DigitarMensagem" component={TelaDigitarMensagem} />
      <Stack.Screen name="FalarMensagem" component={TelaFalarMensagem} />
      <Stack.Screen name="ResultadoLibras" component={TelaResultadoLibras} />
    </Stack.Navigator>
  );
};

export default NavegacaoPrincipal;
