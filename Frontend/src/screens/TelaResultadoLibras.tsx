import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/NavegacaoPrincipal';
import { useCores } from '../theme/useCores';
import type { Cores } from '../theme/cores';
import BarraInferior from '../components/BarraInferior';
import BotaoVoltar from '../components/BotaoVoltar';
import IndicadoresProgresso from '../components/IndicadoresProgresso';
import { useVLibras } from '../contexts/VLibrasProvider';
import { useHistoricoFavoritos } from '../contexts/HistoricoFavoritosProvider';
import { useConfiguracoes } from '../contexts/ConfiguracoesProvider';
import type { AvatarVLibras, VelocidadeAvatar } from '../contexts/ConfiguracoesProvider';


type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ResultadoRouteProp = RouteProp<RootStackParamList, 'ResultadoLibras'>;

const TelaResultadoLibras: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ResultadoRouteProp>();
  const { texto, registrarHistorico } = route.params;
  const { pronto, traduzir, mostrar, esconder, definirLayout } = useVLibras();
  const { adicionarAoHistorico, alternarFavorito, ehFavorito } = useHistoricoFavoritos();
  const { config, setAvatarVLibras, setVelocidadeAvatar } = useConfiguracoes();
  const cardRef = useRef<View>(null);
  const traduziuRef = useRef(false);
  const registrouHistoricoRef = useRef(false);
  const [ajustesVisiveis, setAjustesVisiveis] = useState(false);

  const { cores, fatorFonte } = useCores();
  const estilos = useMemo(() => criarEstilos(cores, fatorFonte), [cores, fatorFonte]);

  const opcoesAvatar: { rotulo: string; valor: AvatarVLibras }[] = [
    { rotulo: 'Guga', valor: 'guga' },
    { rotulo: 'Ícaro', valor: 'icaro' },
    { rotulo: 'Hozana', valor: 'hosana' },
    { rotulo: 'Aleatório', valor: 'random' },
  ];

  const opcoesVelocidade: { rotulo: string; valor: VelocidadeAvatar }[] = [
    { rotulo: 'Lenta', valor: 'lenta' },
    { rotulo: 'Normal', valor: 'normal' },
    { rotulo: 'Rápida', valor: 'rapida' },
  ];

  // useFocusEffect: dispara ao FOCAR e cleanup ao PERDER FOCO
  // (diferente de useEffect, que só dispara cleanup ao desmontar)
  useFocusEffect(
    useCallback(() => {
      mostrar();
      traduziuRef.current = false;

      return () => {
        esconder();
      };
    }, [mostrar, esconder])
  );

  // Traduz quando o widget fica pronto
  useEffect(() => {
    if (pronto && !traduziuRef.current) {
      traduziuRef.current = true;
      setTimeout(() => {
        traduzir(texto);
      }, 500);
    }
  }, [pronto, texto, traduzir]);

  useEffect(() => {
    traduziuRef.current = false;
  }, [config.avatarVLibras]);

  useEffect(() => {
    registrouHistoricoRef.current = false;
  }, [registrarHistorico, texto]);

  useEffect(() => {
    if (registrarHistorico && !registrouHistoricoRef.current) {
      registrouHistoricoRef.current = true;
      adicionarAoHistorico(texto, 'texto');
    }
  }, [adicionarAoHistorico, registrarHistorico, texto]);

  // Mede a posição do card e informa ao Provider
  const handleCardLayout = () => {
    if (cardRef.current) {
      cardRef.current.measureInWindow((x, y, width, height) => {
        definirLayout({ x, y, width, height });
      });
    }
  };

  return (
    <SafeAreaView style={estilos.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={cores.fundo} />

      {/* Cabeçalho */}
      <View style={estilos.cabecalho}>
        <BotaoVoltar />
        <View style={estilos.cabecalhoTexto}>
          <Text style={estilos.titulo}>Tradução LIBRAS</Text>
          <Text style={estilos.subtitulo}>Resultado da Tradução</Text>
        </View>
        <View style={estilos.acoesCabecalho}>
          <TouchableOpacity
            onPress={() => setAjustesVisiveis(true)}
            style={estilos.botaoCabecalhoAcao}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Abrir ajustes rápidos do VLibras"
          >
            <Ionicons name="options-outline" size={23} color={cores.textoSuave} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => alternarFavorito(texto, 'texto')}
            style={estilos.botaoCabecalhoAcao}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Favoritar tradução"
          >
            <Ionicons
              name={ehFavorito(texto) ? 'star' : 'star-outline'}
              size={24}
              color={ehFavorito(texto) ? cores.favorito : cores.textoSuave}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Indicadores de progresso */}
      <IndicadoresProgresso atual={3} style={{ paddingVertical: 12 }} />

      {/* Card onde o widget VLibras será posicionado (via Provider) */}
      <View
        ref={cardRef}
        style={estilos.vlibrasWebViewCard}
        onLayout={handleCardLayout}
      >
        {/* O conteúdo real (WebView) vem do VLibrasProvider, posicionado absolutamente sobre este card */}
      </View>

      {/* Botões de ação */}
      <View style={estilos.acoesContainer}>
        <TouchableOpacity
          style={estilos.botaoNovaTraducao}
          onPress={() => 
            navigation.reset({
              index: 1,
              routes: [{ name: 'Inicial' }, { name: 'NovaTraducao' }],
            })
          }
          activeOpacity={0.8}
        >
          <Text style={estilos.botaoNovaTraducaoTexto}>Nova Tradução</Text>
        </TouchableOpacity>
      </View>

      {/* Barra de navegação inferior */}
      <BarraInferior />

      <Modal
        visible={ajustesVisiveis}
        transparent
        animationType="slide"
        onRequestClose={() => setAjustesVisiveis(false)}
      >
        <TouchableOpacity
          style={estilos.modalOverlay}
          activeOpacity={1}
          onPress={() => setAjustesVisiveis(false)}
        >
          <TouchableOpacity
            style={estilos.modalConteudo}
            activeOpacity={1}
            onPress={(evento) => evento.stopPropagation()}
          >
            <View style={estilos.modalCabecalho}>
              <View>
                <Text style={estilos.modalTitulo}>Ajustes rápidos</Text>
                <Text style={estilos.modalSubtitulo}>Avatar e velocidade do VLibras</Text>
              </View>
              <TouchableOpacity
                style={estilos.modalFechar}
                onPress={() => setAjustesVisiveis(false)}
                activeOpacity={0.75}
              >
                <Ionicons name="close" size={22} color={cores.textoPrincipal} />
              </TouchableOpacity>
            </View>

            <View style={estilos.ajusteLinha}>
              <Text style={estilos.ajusteRotulo}>Avatar</Text>
              <View style={estilos.opcoesCompactas}>
                {opcoesAvatar.map((opcao) => {
                  const ativo = config.avatarVLibras === opcao.valor;

                  return (
                    <TouchableOpacity
                      key={opcao.valor}
                      style={[estilos.chipAjuste, ativo && estilos.chipAjusteAtivo]}
                      onPress={() => setAvatarVLibras(opcao.valor)}
                      activeOpacity={0.75}
                      accessibilityRole="button"
                      accessibilityState={{ selected: ativo }}
                    >
                      <Text style={[estilos.chipAjusteTexto, ativo && estilos.chipAjusteTextoAtivo]}>
                        {opcao.rotulo}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={estilos.ajusteLinha}>
              <Text style={estilos.ajusteRotulo}>Velocidade</Text>
              <View style={estilos.opcoesCompactas}>
                {opcoesVelocidade.map((opcao) => {
                  const ativo = config.velocidadeAvatar === opcao.valor;

                  return (
                    <TouchableOpacity
                      key={opcao.valor}
                      style={[estilos.chipAjuste, ativo && estilos.chipAjusteAtivo]}
                      onPress={() => setVelocidadeAvatar(opcao.valor)}
                      activeOpacity={0.75}
                      accessibilityRole="button"
                      accessibilityState={{ selected: ativo }}
                    >
                      <Text style={[estilos.chipAjusteTexto, ativo && estilos.chipAjusteTextoAtivo]}>
                        {opcao.rotulo}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
    marginLeft: 12,
    flex: 1,
  },
  acoesCabecalho: {
    flexDirection: 'row',
    marginLeft: 'auto',
    gap: 4,
  },
  botaoCabecalhoAcao: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ajusteLinha: {
    marginTop: 16,
  },
  ajusteRotulo: {
    color: cores.textoSecundario,
    fontSize: Math.round(12 * fatorFonte),
    fontWeight: '700',
    marginBottom: 8,
  },
  opcoesCompactas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipAjuste: {
    minHeight: 34,
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.inputBorda,
    backgroundColor: cores.inputFundo,
    paddingHorizontal: 12,
  },
  chipAjusteAtivo: {
    borderColor: cores.destaque,
    backgroundColor: cores.fundoIcone,
  },
  chipAjusteTexto: {
    color: cores.textoSecundario,
    fontSize: Math.round(12 * fatorFonte),
    fontWeight: '600',
  },
  chipAjusteTextoAtivo: {
    color: cores.iconeTeal,
    fontWeight: '800',
  },
  titulo: {
    fontSize: Math.round(20 * fatorFonte),
    fontWeight: '700',
    color: cores.textoPrincipal,
  },
  subtitulo: {
    fontSize: Math.round(14 * fatorFonte),
    color: cores.textoSecundario,
    marginTop: 2,
  },
  vlibrasWebViewCard: {
    flex: 1,
    maxHeight: 520,
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: cores.inputFundo,
    shadowColor: cores.sombra,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: cores.inputBorda,
  },
  acoesContainer: {
    marginTop: 'auto',
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  botaoNovaTraducao: {
    backgroundColor: cores.iconeTeal,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoNovaTraducaoTexto: {
    fontSize: Math.round(16 * fatorFonte),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalConteudo: {
    backgroundColor: cores.fundo,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
  },
  modalCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitulo: {
    color: cores.textoPrincipal,
    fontSize: Math.round(18 * fatorFonte),
    fontWeight: '800',
  },
  modalSubtitulo: {
    color: cores.textoSecundario,
    fontSize: Math.round(13 * fatorFonte),
    marginTop: 2,
  },
  modalFechar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.superficie,
  },
});

export default TelaResultadoLibras;
