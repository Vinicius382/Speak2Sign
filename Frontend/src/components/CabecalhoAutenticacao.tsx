import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useCores } from '../theme/useCores';
import type { Cores } from '../theme/cores';

interface CabecalhoAutenticacaoProps {
  subtitulo: string;
}

const CabecalhoAutenticacao: React.FC<CabecalhoAutenticacaoProps> = ({ subtitulo }) => {
  const { cores, fatorFonte } = useCores();
  const estilos = useMemo(() => criarEstilos(cores, fatorFonte), [cores, fatorFonte]);

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Speak2Sign</Text>
      <Text style={estilos.subtitulo}>{subtitulo}</Text>
    </View>
  );
};

const criarEstilos = (cores: Cores, fatorFonte: number = 1) => StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: Math.round(36 * fatorFonte),
    fontStyle: 'italic',
    color: cores.textoPrincipal,
    letterSpacing: 1,
  },
  subtitulo: {
    fontSize: Math.round(16 * fatorFonte),
    color: cores.textoSecundario,
    marginTop: 8,
    fontWeight: '400',
  },
});

export default CabecalhoAutenticacao;
