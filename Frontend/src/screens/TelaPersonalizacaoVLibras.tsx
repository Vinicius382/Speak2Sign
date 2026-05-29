import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BotaoVoltar from '../components/BotaoVoltar';
import {
  type PersonalizacaoVLibras,
  personalizacaoVLibrasPadrao,
  useConfiguracoes,
} from '../contexts/ConfiguracoesProvider';
import type { Cores } from '../theme/cores';
import { useCores } from '../theme/useCores';

type CampoPersonalizacao = keyof PersonalizacaoVLibras;

type CampoConfig = {
  campo: CampoPersonalizacao;
  titulo: string;
  icone: keyof typeof Ionicons.glyphMap;
  opcoes: string[];
};

const CAMPOS: CampoConfig[] = [
  {
    campo: 'corpo',
    titulo: 'Pele',
    icone: 'body-outline',
    opcoes: ['#F2C1A0', '#D49A7A', '#C18471', '#8D5524', '#5C4033'],
  },
  {
    campo: 'cabelo',
    titulo: 'Cabelo',
    icone: 'sparkles-outline',
    opcoes: ['#000000', '#3B2414', '#6B4226', '#A0522D', '#D9B08C', '#FFFFFF'],
  },
  {
    campo: 'camisa',
    titulo: 'Camisa',
    icone: 'shirt-outline',
    opcoes: ['#1A1A1A', '#2E7D32', '#5BA4A4', '#6366F1', '#E74C3C', '#F59E0B'],
  },
  {
    campo: 'calca',
    titulo: 'Calça',
    icone: 'accessibility-outline',
    opcoes: ['#201E62', '#1F2937', '#2563EB', '#6B7280', '#14532D'],
  },
  {
    campo: 'olhos',
    titulo: 'Olhos',
    icone: 'eye-outline',
    opcoes: ['#FFFFFF', '#F8F9FA', '#E0E0E0', '#94A3B8'],
  },
  {
    campo: 'iris',
    titulo: 'Íris',
    icone: 'radio-button-on-outline',
    opcoes: ['#000000', '#3B82F6', '#22C55E', '#8B5A2B', '#64748B'],
  },
  {
    campo: 'sobrancelhas',
    titulo: 'Sobrancelhas',
    icone: 'remove-outline',
    opcoes: ['#000000', '#3B2414', '#6B4226', '#A0522D', '#D9B08C'],
  },
];

const TelaPersonalizacaoVLibras: React.FC = () => {
  const { config, setPersonalizacaoVLibras, resetPersonalizacaoVLibras } = useConfiguracoes();
  const { cores, estaEscuro, fatorFonte } = useCores();
  const estilos = useMemo(() => criarEstilos(cores, fatorFonte), [cores, fatorFonte]);
  const [personalizacao, setPersonalizacao] = useState<PersonalizacaoVLibras>(
    config.personalizacaoVLibras
  );

  const alterarCor = (campo: CampoPersonalizacao, cor: string) => {
    setPersonalizacao((atual) => ({
      ...atual,
      [campo]: cor,
    }));
  };

  const salvar = () => {
    setPersonalizacaoVLibras(personalizacao);
    Alert.alert('Pronto!', 'As cores do avatar foram salvas.');
  };

  const restaurarPadrao = () => {
    setPersonalizacao(personalizacaoVLibrasPadrao);
    resetPersonalizacaoVLibras();
    Alert.alert('Padrão restaurado', 'As cores do avatar voltaram ao padrão.');
  };

  return (
    <SafeAreaView style={estilos.container} edges={['top']}>
      <StatusBar barStyle={estaEscuro ? 'light-content' : 'dark-content'} backgroundColor={cores.fundo} />

      <View style={estilos.cabecalho}>
        <BotaoVoltar />
        <Text style={estilos.tituloCabecalho}>Personalizar Avatar</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={estilos.conteudoScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={estilos.previewCard}>
          <View style={estilos.avatarMiniatura}>
            <View style={[estilos.cabeca, { backgroundColor: personalizacao.corpo }]}>
              <View style={[estilos.cabelo, { backgroundColor: personalizacao.cabelo }]} />
              <View style={estilos.olhosLinha}>
                <View style={[estilos.olho, { backgroundColor: personalizacao.olhos }]}>
                  <View style={[estilos.iris, { backgroundColor: personalizacao.iris }]} />
                </View>
                <View style={[estilos.olho, { backgroundColor: personalizacao.olhos }]}>
                  <View style={[estilos.iris, { backgroundColor: personalizacao.iris }]} />
                </View>
              </View>
              <View style={[estilos.sobrancelha, { backgroundColor: personalizacao.sobrancelhas }]} />
            </View>
            <View style={[estilos.camisa, { backgroundColor: personalizacao.camisa }]} />
            <View style={[estilos.calca, { backgroundColor: personalizacao.calca }]} />
          </View>
          <View style={estilos.previewTexto}>
            <Text style={estilos.previewTitulo}>Avatar VLibras</Text>
            <Text style={estilos.previewSubtitulo}>Cores aplicadas na próxima tradução</Text>
          </View>
        </View>

        <View style={estilos.secaoCard}>
          {CAMPOS.map((item, indice) => (
            <View key={item.campo}>
              <View style={estilos.campoContainer}>
                <View style={estilos.campoCabecalho}>
                  <View style={estilos.iconeContainer}>
                    <Ionicons name={item.icone} size={20} color={cores.iconeTeal} />
                  </View>
                  <View style={estilos.campoTituloContainer}>
                    <Text style={estilos.campoTitulo}>{item.titulo}</Text>
                    <Text style={estilos.campoValor}>{personalizacao[item.campo]}</Text>
                  </View>
                  <View
                    style={[
                      estilos.amostraAtual,
                      { backgroundColor: personalizacao[item.campo] },
                    ]}
                  />
                </View>

                <View style={estilos.paleta}>
                  {item.opcoes.map((cor) => {
                    const selecionada = personalizacao[item.campo] === cor;

                    return (
                      <TouchableOpacity
                        key={`${item.campo}-${cor}`}
                        style={[
                          estilos.opcaoCor,
                          selecionada && estilos.opcaoCorSelecionada,
                        ]}
                        onPress={() => alterarCor(item.campo, cor)}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityState={{ selected: selecionada }}
                      >
                        <View style={[estilos.opcaoCorInterna, { backgroundColor: cor }]} />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              {indice < CAMPOS.length - 1 && <View style={estilos.divisor} />}
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={estilos.botaoSalvar}
          onPress={salvar}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
          <Text style={estilos.botaoSalvarTexto}>Salvar alterações</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={estilos.botaoRestaurar}
          onPress={restaurarPadrao}
          activeOpacity={0.8}
        >
          <Ionicons name="refresh-outline" size={20} color={cores.iconeTeal} />
          <Text style={estilos.botaoRestaurarTexto}>Restaurar padrão</Text>
        </TouchableOpacity>
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  tituloCabecalho: {
    flex: 1,
    color: cores.textoPrincipal,
    fontSize: Math.round(18 * fatorFonte),
    fontWeight: '700',
    textAlign: 'center',
  },
  conteudoScroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.superficie,
    borderRadius: 16,
    padding: 18,
    marginTop: 12,
    marginBottom: 20,
    shadowColor: cores.sombra,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarMiniatura: {
    width: 78,
    alignItems: 'center',
    marginRight: 16,
  },
  cabeca: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cabelo: {
    position: 'absolute',
    top: 0,
    width: 48,
    height: 16,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  olhosLinha: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 8,
  },
  olho: {
    width: 9,
    height: 9,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iris: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  sobrancelha: {
    position: 'absolute',
    top: 16,
    width: 26,
    height: 3,
    borderRadius: 2,
  },
  camisa: {
    width: 58,
    height: 34,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: -2,
  },
  calca: {
    width: 46,
    height: 24,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  previewTexto: {
    flex: 1,
  },
  previewTitulo: {
    color: cores.textoPrincipal,
    fontSize: Math.round(17 * fatorFonte),
    fontWeight: '700',
    marginBottom: 4,
  },
  previewSubtitulo: {
    color: cores.textoSecundario,
    fontSize: Math.round(13 * fatorFonte),
  },
  secaoCard: {
    backgroundColor: cores.superficie,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: cores.sombra,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  campoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  campoCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconeContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: cores.fundoIcone,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  campoTituloContainer: {
    flex: 1,
  },
  campoTitulo: {
    color: cores.textoPrincipal,
    fontSize: Math.round(15 * fatorFonte),
    fontWeight: '700',
  },
  campoValor: {
    color: cores.textoSecundario,
    fontSize: Math.round(12 * fatorFonte),
    marginTop: 2,
  },
  amostraAtual: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: cores.inputBorda,
  },
  paleta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  opcaoCor: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  opcaoCorSelecionada: {
    borderColor: cores.destaque,
  },
  opcaoCorInterna: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: cores.inputBorda,
  },
  divisor: {
    height: 1,
    backgroundColor: cores.divisor,
    marginHorizontal: 16,
  },
  botaoSalvar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.destaque,
    borderRadius: 14,
    paddingVertical: 15,
    marginBottom: 12,
    gap: 8,
  },
  botaoSalvarTexto: {
    color: '#FFFFFF',
    fontSize: Math.round(16 * fatorFonte),
    fontWeight: '700',
  },
  botaoRestaurar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.inputBorda,
    borderRadius: 14,
    paddingVertical: 15,
    gap: 8,
  },
  botaoRestaurarTexto: {
    color: cores.iconeTeal,
    fontSize: Math.round(16 * fatorFonte),
    fontWeight: '700',
  },
});

export default TelaPersonalizacaoVLibras;
