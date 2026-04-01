import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/NavegacaoPrincipal';
import { cores } from '../theme/cores';
import BarraInferior from '../components/BarraInferior';
import VLibrasWidget, { VLibrasWidgetRef } from '../components/VLibrasWidget';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ResultadoRouteProp = RouteProp<RootStackParamList, 'ResultadoLibras'>;

const TelaResultadoLibras: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ResultadoRouteProp>();
  const { texto } = route.params;
  const vlibrasRef = useRef<VLibrasWidgetRef>(null);

  return (
    <SafeAreaView style={estilos.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={cores.fundo} />

      {/* Cabeçalho */}
      <View style={estilos.cabecalho}>
        <TouchableOpacity
          style={estilos.botaoVoltar}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={cores.textoPrincipal} />
        </TouchableOpacity>
        <View>
          <Text style={estilos.titulo}>Tradução LIBRAS</Text>
          <Text style={estilos.subtitulo}>Resultado da Tradução</Text>
        </View>
      </View>

      {/* Indicadores de progresso */}
      <View style={estilos.indicadores}>
        <View style={[estilos.indicador, estilos.indicadorAtivo]} />
        <View style={[estilos.indicador, estilos.indicadorAtivo]} />
        <View style={[estilos.indicador, estilos.indicadorAtivo]} />
      </View>

      {/* WebView com VLibras (Componentizado) */}
      <View style={estilos.vlibrasWebViewCard}>
        <VLibrasWidget ref={vlibrasRef} textoInicial={texto} />
      </View>

      {/* Botões de ação */}
      <View style={estilos.acoesContainer}>
        <TouchableOpacity
          style={estilos.botaoNovaTraducao}
          onPress={() => navigation.navigate('NovaTraducao')}
          activeOpacity={0.8}
        >
          <Text style={estilos.botaoNovaTraducaoTexto}>Nova Tradução</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={estilos.botaoInicio}
          onPress={() => navigation.navigate('Inicial')}
          activeOpacity={0.8}
        >
          <Ionicons name="home-outline" size={20} color={cores.iconeTeal} />
          <Text style={estilos.botaoInicioTexto}>Voltar ao Início</Text>
        </TouchableOpacity>
      </View>

      {/* Barra de navegação inferior */}
      <BarraInferior aoClicarItem={() => {}} />
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
    paddingTop: 8,
    paddingBottom: 8,
  },
  botaoVoltar: {
    padding: 8,
    marginRight: 12,
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
  indicadores: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  indicador: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D9D9D9',
  },
  indicadorAtivo: {
    backgroundColor: cores.iconeTeal,
  },
  vlibrasWebViewCard: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 12,
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
    paddingHorizontal: 20,
    paddingBottom: 90,
    gap: 10,
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
  botaoInicio: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.superficie,
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: cores.iconeTeal,
    gap: 8,
  },
  botaoInicioTexto: {
    fontSize: 15,
    fontWeight: '600',
    color: cores.iconeTeal,
  },
});

export default TelaResultadoLibras;
