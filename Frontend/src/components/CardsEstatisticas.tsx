import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCores } from '../theme/useCores';
import type { Cores } from '../theme/cores';
import type { TipoTraducao } from '../contexts/HistoricoFavoritosProvider';

export type FiltroTipo = 'todos' | TipoTraducao;

interface Estatisticas {
  total: number;
  voz: number;
  texto: number;
  libras: number;
}

interface CardsEstatisticasProps {
  estatisticas: Estatisticas;
  filtroAtivo: FiltroTipo;
  aoSelecionarFiltro: (filtro: FiltroTipo) => void;
}

const CardsEstatisticas: React.FC<CardsEstatisticasProps> = ({
  estatisticas,
  filtroAtivo,
  aoSelecionarFiltro,
}) => {
  const { cores, fatorFonte } = useCores();
  const estilos = useMemo(() => criarEstilos(cores, fatorFonte), [cores, fatorFonte]);

  const cards: { chave: FiltroTipo; rotulo: string; valor: number }[] = [
    { chave: 'todos', rotulo: 'Total', valor: estatisticas.total },
    { chave: 'voz', rotulo: 'Voz', valor: estatisticas.voz },
    { chave: 'texto', rotulo: 'Texto', valor: estatisticas.texto },
    { chave: 'libras', rotulo: 'Libras', valor: estatisticas.libras },
  ];

  return (
    <View style={estilos.container}>
      {cards.map((card) => (
        <TouchableOpacity
          key={card.chave}
          style={[
            estilos.card,
            filtroAtivo === card.chave && estilos.cardAtivo,
          ]}
          onPress={() => aoSelecionarFiltro(card.chave)}
          activeOpacity={0.7}
        >
          <Text style={estilos.numero}>{card.valor}</Text>
          <Text style={estilos.rotulo}>{card.rotulo}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const criarEstilos = (cores: Cores, fatorFonte: number = 1) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: cores.superficie,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: cores.inputBorda,
  },
  cardAtivo: {
    borderColor: cores.iconeTeal,
    borderWidth: 2,
  },
  numero: {
    fontSize: Math.round(20 * fatorFonte),
    fontWeight: 'bold',
    color: cores.iconeTeal,
  },
  rotulo: {
    fontSize: Math.round(11 * fatorFonte),
    color: cores.textoSecundario,
    marginTop: 2,
    fontWeight: '500',
  },
});

export default CardsEstatisticas;
