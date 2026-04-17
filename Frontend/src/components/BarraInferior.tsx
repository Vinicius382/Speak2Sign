import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/NavegacaoPrincipal';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../theme/cores';

type ItemBarra = {
  icone: keyof typeof Ionicons.glyphMap;
  rotulo: string;
  rota: keyof RootStackParamList;
};

interface BarraInferiorProps {
  telaAtiva?: string;
}

const itens: ItemBarra[] = [
  { icone: 'home-outline', rotulo: 'Início', rota: 'Inicial' },
  { icone: 'time-outline', rotulo: 'Histórico', rota: 'Historico' },
  { icone: 'star-outline', rotulo: 'Favoritos', rota: 'Favoritos' },
  { icone: 'person-outline', rotulo: 'Perfil', rota: 'Inicial' },
];

const BarraInferior: React.FC<BarraInferiorProps> = ({ telaAtiva = 'Início' }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const lidarComClique = (item: ItemBarra) => {
    if (item.rotulo === 'Perfil') {
      // Placeholder — futuramente navegará para Perfil
      return;
    }
    navigation.navigate(item.rota as any);
  };

  return (
    <View style={estilos.barraInferior}>
      {itens.map((item) => {
        const ativo = item.rotulo === telaAtiva;
        return (
          <TouchableOpacity
            key={item.rotulo}
            style={estilos.itemBarra}
            onPress={() => lidarComClique(item)}
          >
            <Ionicons
              name={item.icone}
              size={24}
              color={ativo ? cores.iconeTeal : cores.textoSuave}
            />
            <Text
              style={[
                estilos.textoBarra,
                ativo && estilos.textoBarraAtivo,
              ]}
            >
              {item.rotulo}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const estilos = StyleSheet.create({
  barraInferior: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: cores.superficie,
    paddingVertical: 10,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: cores.sombra,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 8,
  },
  itemBarra: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBarra: {
    fontSize: 11,
    color: cores.textoSuave,
    marginTop: 4,
    fontWeight: '500',
  },
  textoBarraAtivo: {
    color: cores.iconeTeal,
    fontWeight: '600',
  },
});

export default BarraInferior;
