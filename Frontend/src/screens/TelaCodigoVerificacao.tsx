import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import CabecalhoAutenticacao from '../components/CabecalhoAutenticacao';
import BotaoPrincipal from '../components/BotaoPrincipal';
import TextoLink from '../components/TextoLink';
import { solicitarRedefinicaoSenha } from '../services/api';
import { useCores } from '../theme/useCores';
import type { Cores } from '../theme/cores';

type RootStackParamList = {
  Login: undefined;
  EsqueciSenha: undefined;
  CodigoVerificacao: { email: string };
  NovaSenha: { email: string; token: string };
};

interface TelaCodigoVerificacaoProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CodigoVerificacao'>;
  route: RouteProp<RootStackParamList, 'CodigoVerificacao'>;
}

const TAMANHO_CODIGO = 6;

const TelaCodigoVerificacao: React.FC<TelaCodigoVerificacaoProps> = ({ navigation, route }) => {
  const { email } = route.params;
  const [codigo, setCodigo] = useState<string[]>(Array(TAMANHO_CODIGO).fill(''));
  const [reenviando, setReenviando] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(60);
  const dataExpiracaoRef = useRef<number | null>(Date.now() + 60000);
  const inputsRef = useRef<(TextInput | null)[]>([]);

  const { cores, fatorFonte } = useCores();
  const estilos = useMemo(() => criarEstilos(cores, fatorFonte), [cores, fatorFonte]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (dataExpiracaoRef.current) {
        const remaining = Math.ceil((dataExpiracaoRef.current - Date.now()) / 1000);
        if (remaining <= 0) {
          setTempoRestante(0);
          dataExpiracaoRef.current = null;
        } else {
          setTempoRestante(remaining);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const aoMudarDigito = (texto: string, indice: number) => {
    const novoCodigo = [...codigo];

    if (texto.length > 1) {
      // Caso o usuário cole o código inteiro
      const digitos = texto.replace(/\D/g, '').slice(0, TAMANHO_CODIGO).split('');
      for (let i = 0; i < TAMANHO_CODIGO; i++) {
        novoCodigo[i] = digitos[i] || '';
      }
      setCodigo(novoCodigo);
      const indiceFoco = Math.min(digitos.length, TAMANHO_CODIGO - 1);
      inputsRef.current[indiceFoco]?.focus();
      return;
    }

    novoCodigo[indice] = texto.replace(/\D/g, '');
    setCodigo(novoCodigo);

    if (texto && indice < TAMANHO_CODIGO - 1) {
      inputsRef.current[indice + 1]?.focus();
    }
  };

  const aoApagarDigito = (tecla: string, indice: number) => {
    if (tecla === 'Backspace' && !codigo[indice] && indice > 0) {
      const novoCodigo = [...codigo];
      novoCodigo[indice - 1] = '';
      setCodigo(novoCodigo);
      inputsRef.current[indice - 1]?.focus();
    }
  };

  const aoVerificar = () => {
    const codigoCompleto = codigo.join('');
    if (codigoCompleto.length < TAMANHO_CODIGO) {
      Alert.alert('Atenção', 'Digite o código completo de 6 dígitos.');
      return;
    }
    navigation.navigate('NovaSenha', { email, token: codigoCompleto });
  };

  const aoReenviar = async () => {
    setReenviando(true);
    try {
      await solicitarRedefinicaoSenha({ email });
      dataExpiracaoRef.current = Date.now() + 60000;
      setTempoRestante(60);
      setCodigo(Array(TAMANHO_CODIGO).fill(''));
      inputsRef.current[0]?.focus();
      Alert.alert('Sucesso', 'Um novo código foi enviado para seu e-mail.');
    } catch (erro: any) {
      const mensagem =
        erro.response?.data || 'Erro ao reenviar código. Tente novamente.';
      Alert.alert('Erro', typeof mensagem === 'string' ? mensagem : 'Erro ao reenviar.');
    } finally {
      setReenviando(false);
    }
  };

  const codigoCompleto = codigo.join('').length === TAMANHO_CODIGO;

  return (
    <KeyboardAvoidingView
      style={estilos.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={estilos.conteudoScroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={estilos.espacoTopo} />

        <CabecalhoAutenticacao subtitulo="Verificação de Código" />

        <Text style={estilos.instrucao}>
          Enviamos um código de 6 dígitos para{'\n'}
          <Text style={estilos.emailDestaque}>{email}</Text>
        </Text>

        <View style={estilos.containerCodigo}>
          {codigo.map((digito, indice) => (
            <TextInput
              key={indice}
              ref={(ref) => { inputsRef.current[indice] = ref; }}
              style={[
                estilos.inputDigito,
                digito ? estilos.inputDigitoPreenchido : null,
              ]}
              value={digito}
              onChangeText={(texto) => aoMudarDigito(texto, indice)}
              onKeyPress={({ nativeEvent }) => aoApagarDigito(nativeEvent.key, indice)}
              keyboardType="number-pad"
              maxLength={indice === 0 ? TAMANHO_CODIGO : 1}
              selectTextOnFocus
              placeholderTextColor={cores.inputPlaceholder}
            />
          ))}
        </View>

        <View style={estilos.containerReenviar}>
          {tempoRestante > 0 ? (
            <Text style={estilos.textoTempo}>
              Reenviar código em <Text style={estilos.tempoDestaque}>{tempoRestante}s</Text>
            </Text>
          ) : (
            <TextoLink
              texto="Não recebeu?"
              textoLink="Reenviar código"
              aoClicar={aoReenviar}
            />
          )}
        </View>
      </ScrollView>

      <View style={estilos.containerInferior}>
        <BotaoPrincipal
          titulo="Verificar"
          aoClicar={aoVerificar}
          carregando={reenviando}
          desativado={!codigoCompleto}
        />

        <TextoLink
          texto="Voltar para"
          textoLink="Login"
          aoClicar={() => navigation.navigate('Login')}
          estilo={estilos.linkVoltar}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const criarEstilos = (cores: Cores, fatorFonte: number = 1) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudoScroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
  },
  espacoTopo: {
    height: 80,
  },
  instrucao: {
    fontSize: Math.round(15 * fatorFonte),
    color: cores.textoSecundario,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  emailDestaque: {
    fontWeight: '700',
    color: cores.destaque,
  },
  containerCodigo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  inputDigito: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    borderColor: cores.inputBorda,
    borderRadius: 14,
    backgroundColor: cores.inputFundo,
    textAlign: 'center',
    fontSize: Math.round(22 * fatorFonte),
    fontWeight: '700',
    color: cores.textoPrincipal,
  },
  inputDigitoPreenchido: {
    borderColor: cores.destaque,
    backgroundColor: cores.codigoPreenchidoFundo,
  },
  containerReenviar: {
    alignItems: 'center',
    marginTop: 8,
  },
  textoTempo: {
    fontSize: Math.round(14 * fatorFonte),
    color: cores.textoSecundario,
  },
  tempoDestaque: {
    fontWeight: '700',
    color: cores.destaque,
  },
  containerInferior: {
    paddingHorizontal: 28,
    paddingBottom: 38,
    paddingTop: 12,
    backgroundColor: cores.fundo,
  },
  linkVoltar: {
    marginTop: 14,
  },
});

export default TelaCodigoVerificacao;
