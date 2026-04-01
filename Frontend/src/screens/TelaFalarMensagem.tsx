import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/NavegacaoPrincipal';
import { cores } from '../theme/cores';
import BarraInferior from '../components/BarraInferior';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TelaFalarMensagem: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [reconhecendo, setReconhecendo] = useState(false);
  const [transcricao, setTranscricao] = useState('');
  const [transcricaoParcial, setTranscricaoParcial] = useState('');
  const [erro, setErro] = useState('');

  // Animações
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;
  const pulseAnimRef = useRef<Animated.CompositeAnimation | null>(null);

  // Eventos de reconhecimento de voz
  useSpeechRecognitionEvent('start', () => {
    setReconhecendo(true);
    setErro('');
  });

  useSpeechRecognitionEvent('end', () => {
    setReconhecendo(false);
  });

  useSpeechRecognitionEvent('result', (event) => {
    const resultado = event.results[0]?.transcript ?? '';
    if (event.isFinal) {
      setTranscricao((prev) => {
        const novoTexto = prev ? `${prev} ${resultado}` : resultado;
        return novoTexto;
      });
      setTranscricaoParcial('');
    } else {
      setTranscricaoParcial(resultado);
    }
  });

  useSpeechRecognitionEvent('error', (event) => {
    console.log('Erro de reconhecimento:', event.error, event.message);
    if (event.error === 'no-speech') {
      setErro('Nenhuma fala detectada. Tente novamente.');
    } else if (event.error === 'not-allowed') {
      setErro('Permissão negada. Habilite o microfone nas configurações.');
    } else {
      setErro('Erro ao reconhecer a fala. Tente novamente.');
    }
  });

  // Iniciar animação de pulso
  useEffect(() => {
    if (reconhecendo) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1.3,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.6,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.3,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
        ]),
      );
      pulseAnimRef.current = animation;
      animation.start();
    } else {
      if (pulseAnimRef.current) {
        pulseAnimRef.current.stop();
        pulseAnimRef.current = null;
      }
      pulseAnim.setValue(1);
      opacityAnim.setValue(0.3);
    }

    return () => {
      if (pulseAnimRef.current) {
        pulseAnimRef.current.stop();
      }
    };
  }, [reconhecendo]);

  const iniciarReconhecimento = useCallback(async () => {
    try {
      const resultado = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!resultado.granted) {
        Alert.alert(
          'Permissão Necessária',
          'Para usar o reconhecimento de voz, é necessário permitir o acesso ao microfone.',
          [{ text: 'OK' }],
        );
        return;
      }

      setErro('');
      setTranscricaoParcial('');

      ExpoSpeechRecognitionModule.start({
        lang: 'pt-BR',
        interimResults: true,
        continuous: false,
      });
    } catch (e) {
      console.error('Erro ao iniciar reconhecimento:', e);
      setErro('Não foi possível iniciar o reconhecimento de voz.');
    }
  }, []);

  const pararReconhecimento = useCallback(() => {
    ExpoSpeechRecognitionModule.stop();
  }, []);

  const limparTranscricao = useCallback(() => {
    setTranscricao('');
    setTranscricaoParcial('');
    setErro('');
  }, []);

  const converterParaLibras = useCallback(() => {
    const textoFinal = transcricao.trim();
    if (textoFinal) {
      navigation.navigate('ResultadoLibras', { texto: textoFinal });
    }
  }, [transcricao, navigation]);

  const textoExibido = transcricaoParcial
    ? `${transcricao} ${transcricaoParcial}`.trim()
    : transcricao;

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
        <Text style={estilos.titulo}>Falar Mensagem</Text>
      </View>

      {/* Indicadores de progresso */}
      <View style={estilos.indicadores}>
        <View style={[estilos.indicador, estilos.indicadorAtivo]} />
        <View style={[estilos.indicador, estilos.indicadorAtivo]} />
        <View style={estilos.indicador} />
      </View>

      <ScrollView
        contentContainerStyle={estilos.conteudoScroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Área do microfone */}
        <View style={estilos.microfoneArea}>
          {/* Anéis de pulso */}
          {reconhecendo && (
            <>
              <Animated.View
                style={[
                  estilos.pulseRing,
                  estilos.pulseRingExterna,
                  {
                    transform: [{ scale: pulseAnim }],
                    opacity: opacityAnim,
                  },
                ]}
              />
              <Animated.View
                style={[
                  estilos.pulseRing,
                  estilos.pulseRingInterna,
                  {
                    transform: [
                      {
                        scale: Animated.multiply(pulseAnim, 0.85),
                      },
                    ],
                    opacity: Animated.multiply(opacityAnim, 1.3),
                  },
                ]}
              />
            </>
          )}

          <TouchableOpacity
            style={[
              estilos.botaoMicrofone,
              reconhecendo && estilos.botaoMicrofoneAtivo,
            ]}
            onPress={reconhecendo ? pararReconhecimento : iniciarReconhecimento}
            activeOpacity={0.8}
          >
            <Ionicons
              name={reconhecendo ? 'stop' : 'mic'}
              size={40}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <Text style={estilos.microfoneLabel}>
            {reconhecendo
              ? 'Ouvindo... Toque para parar'
              : 'Toque para falar'}
          </Text>
        </View>

        {/* Exibição do erro */}
        {erro !== '' && (
          <View style={estilos.erroContainer}>
            <Ionicons name="alert-circle-outline" size={18} color={cores.erro} />
            <Text style={estilos.erroTexto}>{erro}</Text>
          </View>
        )}

        {/* Área de transcrição */}
        <View style={estilos.transcricaoContainer}>
          <View style={estilos.transcricaoHeader}>
            <Text style={estilos.transcricaoLabel}>Texto Reconhecido</Text>
            {textoExibido !== '' && (
              <TouchableOpacity onPress={limparTranscricao}>
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color={cores.textoSecundario}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={estilos.transcricaoBox}>
            {textoExibido ? (
              <Text style={estilos.transcricaoTexto}>
                {transcricao}
                {transcricaoParcial ? (
                  <Text style={estilos.transcricaoParcial}>
                    {transcricao ? ' ' : ''}
                    {transcricaoParcial}
                  </Text>
                ) : null}
              </Text>
            ) : (
              <Text style={estilos.transcricaoPlaceholder}>
                O texto reconhecido aparecerá aqui...
              </Text>
            )}
          </View>
        </View>

        {/* Botão Converter para Libras */}
        <View style={estilos.botaoContainer}>
          <TouchableOpacity
            style={[
              estilos.botaoConverter,
              !transcricao.trim() && estilos.botaoConverterDesabilitado,
            ]}
            onPress={converterParaLibras}
            activeOpacity={0.8}
            disabled={!transcricao.trim()}
          >
            <Text style={estilos.botaoConverterTexto}>Converter para Libras</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
  conteudoScroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  microfoneArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    borderRadius: 999,
  },
  pulseRingExterna: {
    width: 140,
    height: 140,
    backgroundColor: cores.iconeTeal,
  },
  pulseRingInterna: {
    width: 120,
    height: 120,
    backgroundColor: cores.iconeTeal,
  },
  botaoMicrofone: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: cores.iconeTeal,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: cores.sombra,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 10,
  },
  botaoMicrofoneAtivo: {
    backgroundColor: '#E74C3C',
  },
  microfoneLabel: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '500',
    color: cores.textoSecundario,
  },
  erroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  erroTexto: {
    fontSize: 13,
    color: cores.erro,
    flex: 1,
  },
  transcricaoContainer: {
    marginBottom: 24,
  },
  transcricaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  transcricaoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: cores.textoSecundario,
  },
  transcricaoBox: {
    backgroundColor: cores.superficie,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: cores.inputBorda,
    padding: 16,
    minHeight: 120,
  },
  transcricaoTexto: {
    fontSize: 15,
    color: cores.textoPrincipal,
    lineHeight: 22,
  },
  transcricaoParcial: {
    color: cores.textoSecundario,
    fontStyle: 'italic',
  },
  transcricaoPlaceholder: {
    fontSize: 15,
    color: cores.inputPlaceholder,
    fontStyle: 'italic',
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

export default TelaFalarMensagem;
