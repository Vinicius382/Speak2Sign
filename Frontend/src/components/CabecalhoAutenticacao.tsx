import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { cores } from '../theme/cores';

interface CabecalhoAutenticacaoProps {
  subtitulo: string;
}

const CabecalhoAutenticacao: React.FC<CabecalhoAutenticacaoProps> = ({ subtitulo }) => {
  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Speak2Sign</Text>
      <Text style={estilos.subtitulo}>{subtitulo}</Text>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 36,
    fontStyle: 'italic',
    color: cores.textoPrincipal,
    letterSpacing: 1,
  },
  subtitulo: {
    fontSize: 16,
    color: cores.textoSecundario,
    marginTop: 8,
    fontWeight: '400',
  },
});

export default CabecalhoAutenticacao;
