import React, { useMemo } from 'react';
import { TouchableOpacity, StyleSheet, TouchableOpacityProps, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCores } from '../theme/useCores';
import type { Cores } from '../theme/cores';

interface BotaoVoltarProps extends TouchableOpacityProps {
  comFundo?: boolean;
  style?: StyleProp<ViewStyle>;
}

const BotaoVoltar: React.FC<BotaoVoltarProps> = ({ comFundo = false, style, onPress, ...props }) => {
  const navigation = useNavigation();
  const { cores, fatorFonte } = useCores();
  const estilos = useMemo(() => criarEstilos(cores, fatorFonte), [cores, fatorFonte]);

  return (
    <TouchableOpacity
      style={[
        estilos.botaoPadrao,
        comFundo && estilos.comFundo,
        style
      ]}
      onPress={onPress || (() => navigation.goBack())}
      {...props}
    >
      <Ionicons name="arrow-back" size={24} color={cores.textoPrincipal} />
    </TouchableOpacity>
  );
};

const criarEstilos = (cores: Cores, fatorFonte: number = 1) => StyleSheet.create({
  botaoPadrao: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  comFundo: {
    backgroundColor: cores.superficie,
    shadowColor: cores.sombra,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default BotaoVoltar;
