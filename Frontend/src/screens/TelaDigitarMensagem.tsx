import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
import { useHistoricoFavoritos } from '../contexts/HistoricoFavoritosProvider';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const mensagensSugeridas = [
  'Olá, Bom dia',
  'Como você está?',
  'Por favor',
  'Obrigado',
];

const TelaDigitarMensagem: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [mensagem, setMensagem] = useState('');
  const { adicionarAoHistorico } = useHistoricoFavoritos();

  const selecionarSugestao = (sugestao: string) => {
    setMensagem(sugestao);
  };

  const converterParaLibras = () => {
    if (mensagem.trim()) {
      adicionarAoHistorico(mensagem.trim(), 'texto');
      navigation.navigate('ResultadoLibras', { texto: mensagem.trim() });
    }
  };

  return (
    <SafeAreaView style={estilos.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={cores.fundo} />

      <KeyboardAvoidingView
        style={estilos.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Cabeçalho */}
        <View style={estilos.cabecalho}>
          <BotaoVoltar />
          <Text style={estilos.titulo}>Digite a mensagem</Text>
        </View>

        {/* Indicadores de progresso */}
        <IndicadoresProgresso atual={2} />

        <ScrollView
          contentContainerStyle={estilos.conteudoScroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Mensagens Sugeridas */}
          <Text style={estilos.rotuloSugestoes}>Mensagens Sugeridas</Text>
          <View style={estilos.sugestoesContainer}>
            {mensagensSugeridas.map((sugestao, index) => (
              <TouchableOpacity
                key={index}
                style={estilos.chipSugestao}
                onPress={() => selecionarSugestao(sugestao)}
                activeOpacity={0.7}
              >
                <Text style={estilos.chipTexto}>{sugestao}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Campo de texto */}
          <View style={estilos.inputContainer}>
            <TextInput
              style={estilos.input}
              placeholder="Digite sua Mensagem"
              placeholderTextColor={cores.inputPlaceholder}
              value={mensagem}
              onChangeText={setMensagem}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Botão Converter para Libras */}
          <View style={estilos.botaoContainer}>
            <TouchableOpacity
              style={[
                estilos.botaoConverter,
                !mensagem.trim() && estilos.botaoConverterDesabilitado,
              ]}
              onPress={converterParaLibras}
              activeOpacity={0.8}
              disabled={!mensagem.trim()}
            >
              <Text style={estilos.botaoConverterTexto}>Converter para Libras</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
  flex: {
    flex: 1,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    color: cores.textoPrincipal,
  },
  conteudoScroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  rotuloSugestoes: {
    fontSize: 14,
    fontWeight: '500',
    color: cores.textoSecundario,
    marginBottom: 12,
  },
  sugestoesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  chipSugestao: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.inputBorda,
  },
  chipTexto: {
    fontSize: 13,
    color: cores.textoSecundario,
    fontWeight: '500',
  },
  inputContainer: {
    backgroundColor: cores.superficie,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: cores.inputBorda,
    marginBottom: 24,
    minHeight: 140,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 15,
    color: cores.textoPrincipal,
    minHeight: 140,
  },
  botaoContainer: {
    marginTop: 'auto',
    paddingTop: 10,
  },
  botaoConverter: {
    backgroundColor: cores.iconeTeal,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoConverterDesabilitado: {
    opacity: 0.5,
  },
  botaoConverterTexto: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default TelaDigitarMensagem;
