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
  ativo?: boolean;
};

interface BarraInferiorProps {
  aoClicarItem?: (rotulo: string) => void;
}

const itens: ItemBarra[] = [
  { icone: 'home-outline', rotulo: 'Início', ativo: true },
  { icone: 'time-outline', rotulo: 'Histórico' },
  { icone: 'star-outline', rotulo: 'Favoritos' },
  { icone: 'person-outline', rotulo: 'Perfil' },
];

const BarraInferior: React.FC<BarraInferiorProps> = ({ aoClicarItem }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const lidarComClique = (rotulo: string) => {
    if (rotulo === 'Início') {
      navigation.navigate('Inicial');
      return;
    }
    aoClicarItem?.(rotulo);
  };

  return (
    <View style={estilos.barraInferior}>
      {itens.map((item) => (
        <TouchableOpacity
          key={item.rotulo}
          style={estilos.itemBarra}
          onPress={() => lidarComClique(item.rotulo)}
        >
          <Ionicons
            name={item.icone}
            size={24}
            color={item.ativo ? cores.iconeTeal : cores.textoSuave}
          />
          <Text
            style={[
              estilos.textoBarra,
              item.ativo && estilos.textoBarraAtivo,
            ]}
          >
            {item.rotulo}
          </Text>
        </TouchableOpacity>
      ))}
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
