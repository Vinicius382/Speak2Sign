import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/NavegacaoPrincipal';
import { cores } from '../theme/cores';
import BarraInferior from '../components/BarraInferior';
import BotaoVoltar from '../components/BotaoVoltar';
import IndicadoresProgresso from '../components/IndicadoresProgresso';
import { useVLibras } from '../contexts/VLibrasProvider';
import { useHistoricoFavoritos } from '../contexts/HistoricoFavoritosProvider';
import { cores as coresTema } from '../theme/cores';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ResultadoRouteProp = RouteProp<RootStackParamList, 'ResultadoLibras'>;

const TelaResultadoLibras: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ResultadoRouteProp>();
  const { texto } = route.params;
  const { pronto, traduzir, mostrar, esconder, definirLayout } = useVLibras();
  const { alternarFavorito, ehFavorito } = useHistoricoFavoritos();
  const cardRef = useRef<View>(null);
  const traduziuRef = useRef(false);

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
        <TouchableOpacity
          onPress={() => alternarFavorito(texto, 'texto')}
          style={estilos.botaoFavorito}
        >
          <Ionicons
            name={ehFavorito(texto) ? 'star' : 'star-outline'}
            size={24}
            color={ehFavorito(texto) ? coresTema.favorito : coresTema.textoSuave}
          />
        </TouchableOpacity>
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
    </SafeAreaView>
  );
};

const estilos = StyleSheet.create({
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
  botaoFavorito: {
    padding: 8,
    marginLeft: 'auto',
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    color: cores.textoPrincipal,
  },
  subtitulo: {
    fontSize: 14,
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
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
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
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default TelaResultadoLibras;
