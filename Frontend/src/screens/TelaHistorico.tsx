import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
  ListRenderItem,
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
import { useHistoricoFavoritos, type ItemHistorico } from '../contexts/HistoricoFavoritosProvider';
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TelaHistorico: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { cores, estaEscuro, fatorFonte } = useCores();
  const estilos = useMemo(() => criarEstilos(cores, fatorFonte), [cores, fatorFonte]);
  const {
    historico,
    estatisticasHistorico,
    textosFavoritos,
    removerDoHistorico,
    limparHistorico,
    alternarFavorito,
  } = useHistoricoFavoritos();

  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<FiltroTipo>('todos');

  // Itens filtrados
  const itensFiltrados = useMemo(() => {
    let itens = historico;
    const termoBusca = busca.trim().toLowerCase();

    // Filtro por tipo
    if (filtro !== 'todos') {
      itens = itens.filter((item) => item.tipo === filtro);
    }

    // Filtro por busca
    if (termoBusca) {
      itens = itens.filter((item) =>
        item.texto.toLowerCase().includes(termoBusca)
      );
    }

    return itens;
  }, [historico, filtro, busca]);

  const confirmarLimpeza = () => {
    Alert.alert(
      'Limpar Histórico',
      'Tem certeza que deseja apagar todo o histórico?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', style: 'destructive', onPress: limparHistorico },
      ]
    );
  };

  const navegarParaResultado = useCallback((texto: string) => {
    navigation.navigate('ResultadoLibras', { texto });
  }, [navigation]);

  const obterChaveItem = useCallback((item: ItemHistorico) => item.id, []);

  const renderizarCabecalhoLista = useMemo(() => (
    <>
      <CampoBusca
        valor={busca}
        aoMudar={setBusca}
        placeholder="Busque no Histórico"
      />

      <CardsEstatisticas
        estatisticas={estatisticasHistorico}
        filtroAtivo={filtro}
        aoSelecionarFiltro={setFiltro}
      />
    </>
  ), [busca, estatisticasHistorico, filtro]);

  const renderizarItem: ListRenderItem<ItemHistorico> = useCallback(({ item }) => (
    <CardItem
      id={item.id}
      tipo={item.tipo}
      texto={item.texto}
      data={item.data}
      modo="historico"
      ehFavorito={textosFavoritos.has(item.texto)}
      aoRemover={removerDoHistorico}
      aoPlay={navegarParaResultado}
      aoAlternarFavorito={alternarFavorito}
    />
  ), [alternarFavorito, textosFavoritos, removerDoHistorico, navegarParaResultado]);

  const renderizarListaVazia = useCallback(() => (
    <View style={estilos.vazio}>
      <Ionicons name="time-outline" size={48} color={cores.inputBorda} />
      <Text style={estilos.vazioTexto}>
        {historico.length === 0
          ? 'Nenhuma tradução realizada ainda'
          : 'Nenhum resultado encontrado'}
      </Text>
    </View>
  ), [cores.inputBorda, estilos.vazio, estilos.vazioTexto, historico.length]);

  return (
    <SafeAreaView style={estilos.container} edges={['top']}>
      <StatusBar barStyle={estaEscuro ? 'light-content' : 'dark-content'} backgroundColor={cores.fundo} />

      {/* Cabeçalho */}
      <View style={estilos.cabecalho}>
        <BotaoVoltar />
        <View style={estilos.cabecalhoTexto}>
          <Text style={estilos.titulo}>Histórico</Text>
          <Text style={estilos.subtitulo}>Suas Traduções Recentes</Text>
        </View>
        <TouchableOpacity
          onPress={confirmarLimpeza}
          style={[
            estilos.botaoLimpar,
            historico.length === 0 && estilos.botaoLimparOculto,
          ]}
          disabled={historico.length === 0}
          accessibilityElementsHidden={historico.length === 0}
          importantForAccessibility={historico.length === 0 ? 'no-hide-descendants' : 'auto'}
        >
          <Ionicons name="trash-outline" size={20} color={cores.erro} />
        </TouchableOpacity>
      </View>

      <FlatList
        style={estilos.conteudo}
        contentContainerStyle={estilos.conteudoInner}
        showsVerticalScrollIndicator={false}
        data={itensFiltrados}
        keyExtractor={obterChaveItem}
        renderItem={renderizarItem}
        ListHeaderComponent={renderizarCabecalhoLista}
        ListEmptyComponent={renderizarListaVazia}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
      />

      <BarraInferior telaAtiva="Histórico" />
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
  botaoLimpar: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoLimparOculto: {
    opacity: 0,
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

export default TelaHistorico;
