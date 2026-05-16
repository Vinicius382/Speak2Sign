import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/NavegacaoPrincipal';
import { useCores } from '../theme/useCores';
import type { Cores } from '../theme/cores';
import BarraInferior from '../components/BarraInferior';
import BotaoVoltar from '../components/BotaoVoltar';
import CardPalavraDicionario from '../components/CardPalavraDicionario';
import {
  categoriasDicionario,
  type CategoriaDicionarioId,
  type PalavraDicionario,
} from '../data/dicionario';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TelaDicionario: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { cores, estaEscuro, fatorFonte } = useCores();
  const estilos = useMemo(() => criarEstilos(cores, fatorFonte), [cores, fatorFonte]);
  const [categoriaAtivaId, setCategoriaAtivaId] =
    useState<CategoriaDicionarioId>('saudacoes');

  const categoriaAtiva = useMemo(
    () =>
      categoriasDicionario.find((categoria) => categoria.id === categoriaAtivaId) ??
      categoriasDicionario[0],
    [categoriaAtivaId]
  );

  const abrirSinal = (palavra: PalavraDicionario) => {
    navigation.navigate('ResultadoLibras', { texto: palavra.texto });
  };

  return (
    <SafeAreaView style={estilos.container} edges={['top']}>
      <StatusBar barStyle={estaEscuro ? 'light-content' : 'dark-content'} backgroundColor={cores.fundo} />

      <View style={estilos.cabecalho}>
        <BotaoVoltar />
        <Text style={estilos.titulo} numberOfLines={1}>Dicionário</Text>
      </View>

      <View style={estilos.categoriasContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={estilos.categoriasConteudo}
        >
          {categoriasDicionario.map((categoria) => {
            const ativa = categoria.id === categoriaAtivaId;

            return (
              <TouchableOpacity
                key={categoria.id}
                style={[estilos.chipCategoria, ativa && estilos.chipCategoriaAtiva]}
                activeOpacity={0.75}
                onPress={() => setCategoriaAtivaId(categoria.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: ativa }}
              >
                <Text
                  style={[
                    estilos.chipCategoriaTexto,
                    ativa && estilos.chipCategoriaTextoAtivo,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {categoria.titulo}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={estilos.contexto}>
        <Text style={estilos.contextoTitulo} numberOfLines={1}>
          {categoriaAtiva.titulo}
        </Text>
        <Text style={estilos.contextoContador}>
          {categoriaAtiva.itens.length} sinais
        </Text>
      </View>

      <FlatList
        key={categoriaAtiva.id}
        data={categoriaAtiva.itens}
        keyExtractor={(palavra) => palavra.id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={estilos.cardWrapper}>
            <CardPalavraDicionario palavra={item} onPress={abrirSinal} />
          </View>
        )}
        contentContainerStyle={estilos.gradeConteudo}
        showsVerticalScrollIndicator={false}
      />

      <BarraInferior />
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
  titulo: {
    flex: 1,
    color: cores.textoPrincipal,
    fontSize: Math.round(20 * fatorFonte),
    fontWeight: '700',
  },
  categoriasContainer: {
    paddingTop: 12,
  },
  categoriasConteudo: {
    paddingHorizontal: 20,
    paddingRight: 28,
  },
  chipCategoria: {
    minHeight: Math.round(44 * fatorFonte),
    maxWidth: Math.round(190 * fatorFonte),
    justifyContent: 'center',
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.inputBorda,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 10,
  },
  chipCategoriaAtiva: {
    backgroundColor: cores.fundoIcone,
    borderColor: cores.destaque,
  },
  chipCategoriaTexto: {
    color: cores.textoSecundario,
    fontSize: Math.round(14 * fatorFonte),
    fontWeight: '600',
    flexShrink: 1,
  },
  chipCategoriaTextoAtivo: {
    color: cores.iconeTeal,
    fontWeight: '700',
  },
  contexto: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 12,
  },
  contextoTitulo: {
    flex: 1,
    color: cores.textoPrincipal,
    fontSize: Math.round(18 * fatorFonte),
    fontWeight: '700',
    marginRight: 12,
  },
  contextoContador: {
    color: cores.textoSecundario,
    fontSize: Math.round(13 * fatorFonte),
    fontWeight: '600',
  },
  gradeConteudo: {
    paddingHorizontal: 14,
    paddingBottom: 112,
  },
  cardWrapper: {
    width: '50%',
    paddingHorizontal: 6,
    paddingBottom: 12,
  },
});

export default TelaDicionario;
