import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaLogin from '../screens/TelaLogin';
import TelaCadastro from '../screens/TelaCadastro';
import TelaInicial from '../screens/TelaInicial';
import TelaNovaTraducao from '../screens/TelaNovaTraducao';
import TelaDigitarMensagem from '../screens/TelaDigitarMensagem';
import TelaResultadoLibras from '../screens/TelaResultadoLibras';
import TelaFalarMensagem from '../screens/TelaFalarMensagem';
import TelaEsqueciSenha from '../screens/TelaEsqueciSenha';
import TelaCodigoVerificacao from '../screens/TelaCodigoVerificacao';
import TelaNovaSenha from '../screens/TelaNovaSenha';
import TelaHistorico from '../screens/TelaHistorico';
import TelaFavoritos from '../screens/TelaFavoritos';

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  EsqueciSenha: undefined;
  CodigoVerificacao: { email: string };
  NovaSenha: { email: string; token: string };
  Inicial: undefined;
  NovaTraducao: undefined;
  DigitarMensagem: undefined;
  FalarMensagem: undefined;
  ResultadoLibras: { texto: string };
  Historico: undefined;
  Favoritos: undefined;
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
      <Stack.Screen name="EsqueciSenha" component={TelaEsqueciSenha} />
      <Stack.Screen name="CodigoVerificacao" component={TelaCodigoVerificacao} />
      <Stack.Screen name="NovaSenha" component={TelaNovaSenha} />
      <Stack.Screen
        name="Inicial"
        component={TelaInicial}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name="NovaTraducao" component={TelaNovaTraducao} />
      <Stack.Screen name="DigitarMensagem" component={TelaDigitarMensagem} />
      <Stack.Screen name="FalarMensagem" component={TelaFalarMensagem} />
      <Stack.Screen name="ResultadoLibras" component={TelaResultadoLibras} />
      <Stack.Screen name="Historico" component={TelaHistorico} />
      <Stack.Screen name="Favoritos" component={TelaFavoritos} />
    </Stack.Navigator>
  );
};

export default NavegacaoPrincipal;
