import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/NavegacaoPrincipal';
import { cores } from '../theme/cores';
import BarraInferior from '../components/BarraInferior';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ResultadoRouteProp = RouteProp<RootStackParamList, 'ResultadoLibras'>;

const TelaResultadoLibras: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ResultadoRouteProp>();
  const { texto } = route.params;

  return (
    <SafeAreaView style={estilos.container}>
      <StatusBar barStyle="dark-content" backgroundColor={cores.fundo} />

      {/* Cabeçalho */}
      <View style={estilos.cabecalho}>
        <TouchableOpacity
          style={estilos.botaoVoltar}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={cores.textoPrincipal} />
        </TouchableOpacity>
        <Text style={estilos.titulo}>Resultado em Libras</Text>
      </View>

      {/* Indicadores de progresso */}
      <View style={estilos.indicadores}>
        <View style={[estilos.indicador, estilos.indicadorAtivo]} />
        <View style={[estilos.indicador, estilos.indicadorAtivo]} />
        <View style={[estilos.indicador, estilos.indicadorAtivo]} />
      </View>

      {/* Conteúdo principal */}
      <View style={estilos.conteudo}>
        {/* Área do avatar / VLibras */}
        <View style={estilos.areaAvatar}>
          <View style={estilos.avatarPlaceholder}>
            <MaterialCommunityIcons
              name="hand-wave-outline"
              size={64}
              color={cores.iconeTeal}
            />
            <Text style={estilos.avatarTexto}>Integração VLibras</Text>
            <Text style={estilos.avatarSubtexto}>Em breve</Text>
          </View>
        </View>

        {/* Texto original */}
        <View style={estilos.textoOriginalContainer}>
          <Text style={estilos.textoOriginalRotulo}>Texto original:</Text>
          <Text style={estilos.textoOriginal}>{texto}</Text>
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
  botaoVoltar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    color: cores.textoPrincipal,
  },
  indicadores: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
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
  conteudo: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  areaAvatar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholder: {
    width: '100%',
    height: 260,
    backgroundColor: cores.superficie,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: cores.sombra,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarTexto: {
    fontSize: 18,
    fontWeight: '600',
    color: cores.iconeTeal,
    marginTop: 16,
  },
  avatarSubtexto: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginTop: 4,
  },
  textoOriginalContainer: {
    backgroundColor: cores.superficie,
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: cores.sombra,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  textoOriginalRotulo: {
    fontSize: 12,
    fontWeight: '600',
    color: cores.textoSuave,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textoOriginal: {
    fontSize: 16,
    color: cores.textoPrincipal,
    lineHeight: 22,
  },
  acoesContainer: {
    gap: 12,
    marginBottom: 20,
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
