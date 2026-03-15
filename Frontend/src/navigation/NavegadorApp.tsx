import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaLogin from '../screens/TelaLogin';
import TelaCadastro from '../screens/TelaCadastro';
import TelaInicial from '../screens/TelaInicial';

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Inicial: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const NavegadorApp: React.FC = () => {
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
    </Stack.Navigator>
  );
};

export default NavegadorApp;
