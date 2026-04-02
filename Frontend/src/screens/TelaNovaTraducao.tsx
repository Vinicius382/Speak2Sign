import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/NavegacaoPrincipal';
import { cores } from '../theme/cores';
import BarraInferior from '../components/BarraInferior';
import BotaoVoltar from '../components/BotaoVoltar';
import IndicadoresProgresso from '../components/IndicadoresProgresso';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TelaNovaTraducao: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={estilos.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={cores.fundo} />

      {/* Cabeçalho */}
      <View style={estilos.cabecalho}>
        <BotaoVoltar />
        <View style={estilos.cabecalhoTexto}>
          <Text style={estilos.titulo}>Nova Tradução</Text>
          <Text style={estilos.subtitulo}>Escolha o Método de Entrada</Text>
        </View>
      </View>

      {/* Indicadores de progresso */}
      <IndicadoresProgresso atual={1} style={{ paddingVertical: 20 }} />

      {/* Conteúdo principal */}
      <View style={estilos.conteudo}>
        {/* Botão Falar */}
        <TouchableOpacity
          style={estilos.cardMetodo}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('FalarMensagem')}
        >
          <View style={estilos.iconeContainer}>
            <Ionicons name="mic-outline" size={48} color={cores.textoSecundario} />
          </View>
          <Text style={estilos.cardMetodoTexto}>Falar</Text>
        </TouchableOpacity>

        {/* Botão Digitar */}
        <TouchableOpacity
          style={estilos.cardMetodo}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('DigitarMensagem')}
        >
          <View style={[estilos.iconeContainer, estilos.iconeDigitar]}>
            <Ionicons name="chatbubble" size={40} color="#FFFFFF" />
          </View>
          <Text style={estilos.cardMetodoTexto}>Digitar</Text>
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
    paddingTop: 16,
    paddingBottom: 8,
  },
  cabecalhoTexto: {
    marginLeft: 12,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    color: cores.textoPrincipal,
  },
  subtitulo: {
    fontSize: 13,
    color: cores.textoSecundario,
    marginTop: 2,
  },
  conteudo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 100,
    gap: 24,
  },
  cardMetodo: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 28,
    backgroundColor: cores.superficie,
    borderRadius: 20,
    shadowColor: cores.sombra,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  iconeContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconeDigitar: {
    backgroundColor: '#2C2C2C',
  },
  cardMetodoTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.textoPrincipal,
  },
});

export default TelaNovaTraducao;
