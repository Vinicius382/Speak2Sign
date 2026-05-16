import React, { useMemo } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCores } from '../theme/useCores';
import type { Cores } from '../theme/cores';
import type { PalavraDicionario } from '../data/dicionario';

type CardPalavraDicionarioProps = {
  palavra: PalavraDicionario;
  onPress: (palavra: PalavraDicionario) => void;
};

const CardPalavraDicionario: React.FC<CardPalavraDicionarioProps> = ({
  palavra,
  onPress,
}) => {
  const { cores, fatorFonte } = useCores();
  const estilos = useMemo(() => criarEstilos(cores, fatorFonte), [cores, fatorFonte]);

  return (
    <TouchableOpacity
      style={estilos.card}
      activeOpacity={0.75}
      onPress={() => onPress(palavra)}
      accessibilityRole="button"
      accessibilityLabel={`Abrir sinal de ${palavra.texto}`}
    >
      <MaterialCommunityIcons
        name={palavra.icone}
        size={Math.round(34 * fatorFonte)}
        color={cores.iconeTeal}
      />
      <Text
        style={estilos.texto}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {palavra.texto}
      </Text>
    </TouchableOpacity>
  );
};

const criarEstilos = (cores: Cores, fatorFonte: number = 1) => StyleSheet.create({
  card: {
    flex: 1,
    minHeight: Math.round(126 * fatorFonte),
    backgroundColor: cores.superficie,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: cores.inputBorda,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 18,
    shadowColor: cores.sombra,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  texto: {
    width: '100%',
    color: cores.textoPrincipal,
    fontSize: Math.round(15 * fatorFonte),
    lineHeight: Math.round(20 * fatorFonte),
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 12,
  },
});

export default CardPalavraDicionario;
