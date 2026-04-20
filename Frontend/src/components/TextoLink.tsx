import React, { useMemo } from 'react';
import { Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useCores } from '../theme/useCores';
import type { Cores } from '../theme/cores';

interface TextoLinkProps {
  texto: string;
  textoLink: string;
  aoClicar: () => void;
  estilo?: ViewStyle;
}

const TextoLink: React.FC<TextoLinkProps> = ({ texto, textoLink, aoClicar, estilo }) => {
  const { cores, fatorFonte } = useCores();
  const estilos = useMemo(() => criarEstilos(cores, fatorFonte), [cores, fatorFonte]);

  return (
    <TouchableOpacity onPress={aoClicar} style={[estilos.container, estilo]} activeOpacity={0.7}>
      <Text style={estilos.texto}>
        {texto} <Text style={estilos.link}>{textoLink}</Text>
      </Text>
    </TouchableOpacity>
  );
};

const criarEstilos = (cores: Cores, fatorFonte: number = 1) => StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  texto: {
    fontSize: Math.round(14 * fatorFonte),
    color: cores.textoSecundario,
  },
  link: {
    color: cores.destaque,
    fontWeight: '700',
  },
});

export default TextoLink;
