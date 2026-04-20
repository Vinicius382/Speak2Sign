import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/NavegacaoPrincipal';
import { useCores } from '../theme/useCores';
import type { Cores } from '../theme/cores';
import BarraInferior from '../components/BarraInferior';
import BotaoVoltar from '../components/BotaoVoltar';
import CampoBusca from '../components/CampoBusca';
import CardsEstatisticas, { FiltroTipo } from '../components/CardsEstatisticas';
import CardItem from '../components/CardItem';
import { useHistoricoFavoritos } from '../contexts/HistoricoFavoritosProvider';
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TelaFavoritos: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { cores, estaEscuro, fatorFonte } = useCores();
  const estilos = useMemo(() => criarEstilos(cores, fatorFonte), [cores, fatorFonte]);
  const { favoritos, removerFavorito } = useHistoricoFavoritos();

  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<FiltroTipo>('todos');

  // Estatísticas
  const estatisticas = useMemo(() => ({
    total: favoritos.length,
    voz: favoritos.filter((f) => f.tipo === 'voz').length,
    texto: favoritos.filter((f) => f.tipo === 'texto').length,
    libras: favoritos.filter((f) => f.tipo === 'libras').length,
  }), [favoritos]);

  // Itens filtrados
  const itensFiltrados = useMemo(() => {
    let itens = favoritos;

    // Filtro por tipo
    if (filtro !== 'todos') {
      itens = itens.filter((item) => item.tipo === filtro);
    }

    // Filtro por busca
    if (busca.trim()) {
      itens = itens.filter((item) =>
        item.texto.toLowerCase().includes(busca.toLowerCase())
      );
    }

    return itens;
  }, [favoritos, filtro, busca]);

  const navegarParaResultado = (texto: string) => {
    navigation.navigate('ResultadoLibras', { texto });
  };

  return (
    <SafeAreaView style={estilos.container} edges={['top']}>
      <StatusBar barStyle={estaEscuro ? 'light-content' : 'dark-content'} backgroundColor={cores.fundo} />

      {/* Cabeçalho */}
      <View style={estilos.cabecalho}>
        <BotaoVoltar />
        <View style={estilos.cabecalhoTexto}>
          <Text style={estilos.titulo}>Favoritos</Text>
          <Text style={estilos.subtitulo}>Suas Mensagens Salvas</Text>
        </View>
      </View>

      <ScrollView
        style={estilos.conteudo}
        contentContainerStyle={estilos.conteudoInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Busca */}
        <CampoBusca
          valor={busca}
          aoMudar={setBusca}
          placeholder="Busque Mensagens Favoritas"
        />

        {/* Estatísticas / Filtros */}
        <CardsEstatisticas
          estatisticas={estatisticas}
          filtroAtivo={filtro}
          aoSelecionarFiltro={setFiltro}
        />

        {/* Lista */}
        {itensFiltrados.map((favorito) => (
          <CardItem
            key={favorito.id}
            id={favorito.id}
            tipo={favorito.tipo}
            texto={favorito.texto}
            data={favorito.data}
            modo="favorito"
            aoRemover={removerFavorito}
            aoPlay={navegarParaResultado}
          />
        ))}

        {/* Estado vazio */}
        {itensFiltrados.length === 0 && (
          <View style={estilos.vazio}>
            <Ionicons name="star-outline" size={48} color={cores.inputBorda} />
            <Text style={estilos.vazioTexto}>
              {favoritos.length === 0
                ? 'Nenhum favorito salvo ainda'
                : 'Nenhum resultado encontrado'}
            </Text>
          </View>
        )}
      </ScrollView>

      <BarraInferior telaAtiva="Favoritos" />
    </SafeAreaView>
  );
};

const criarEstilos = (cores: Cores, fatorFonte: number = 1) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  cabecalhoTexto: {
    marginLeft: 4,
    flex: 1,
  },
  titulo: {
    fontSize: Math.round(20 * fatorFonte),
    fontWeight: '700',
    color: cores.textoPrincipal,
  },
  subtitulo: {
    fontSize: Math.round(14 * fatorFonte),
    color: cores.iconeTeal,
    marginTop: 2,
  },
  conteudo: {
    flex: 1,
  },
  conteudoInner: {
    padding: 20,
    paddingBottom: 100,
  },
  vazio: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  vazioTexto: {
    fontSize: Math.round(16 * fatorFonte),
    color: cores.textoSuave,
    marginTop: 16,
  },
});

export default TelaFavoritos;
