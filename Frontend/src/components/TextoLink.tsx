import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { cores } from '../theme/cores';

interface TextoLinkProps {
  texto: string;
  textoLink: string;
  aoClicar: () => void;
  estilo?: ViewStyle;
}

const TextoLink: React.FC<TextoLinkProps> = ({ texto, textoLink, aoClicar, estilo }) => {
  return (
    <TouchableOpacity onPress={aoClicar} style={[estilos.container, estilo]} activeOpacity={0.7}>
      <Text style={estilos.texto}>
        {texto} <Text style={estilos.link}>{textoLink}</Text>
      </Text>
    </TouchableOpacity>
  );
};

const estilos = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  texto: {
    fontSize: 14,
    color: cores.textoSecundario,
  },
  link: {
    color: cores.destaque,
    fontWeight: '700',
  },
});

export default TextoLink;
