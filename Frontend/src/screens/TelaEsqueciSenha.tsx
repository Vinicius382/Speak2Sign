import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CabecalhoAutenticacao from '../components/CabecalhoAutenticacao';
import EntradaPersonalizada from '../components/EntradaPersonalizada';
import BotaoPrincipal from '../components/BotaoPrincipal';
import TextoLink from '../components/TextoLink';
import { solicitarRedefinicaoSenha } from '../services/api';
import { cores } from '../theme/cores';

type RootStackParamList = {
  Login: undefined;
  EsqueciSenha: undefined;
  CodigoVerificacao: { email: string };
};

interface TelaEsqueciSenhaProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EsqueciSenha'>;
}

const TelaEsqueciSenha: React.FC<TelaEsqueciSenhaProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState<{ email?: string }>({});

  const validar = (): boolean => {
    const novosErros: { email?: string } = {};

    if (!email.trim()) {
      novosErros.email = 'O e-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      novosErros.email = 'E-mail inválido';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const aoEnviar = async () => {
    if (!validar()) return;

    setCarregando(true);
    try {
      await solicitarRedefinicaoSenha({ email: email.trim() });
      navigation.navigate('CodigoVerificacao', { email: email.trim() });
    } catch (erro: any) {
      const mensagem =
        erro.response?.data || 'Erro ao conectar com o servidor. Tente novamente.';
      Alert.alert('Erro', typeof mensagem === 'string' ? mensagem : 'Erro ao enviar código.');
    } finally {
      setCarregando(false);
    }
  };

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

        <CabecalhoAutenticacao subtitulo="Recupere Sua Senha" />

        <View style={estilos.containerFormulario}>
          <EntradaPersonalizada
            placeholder="Email"
            textoPlaceholder="Digite seu email cadastrado"
            valor={email}
            aoMudarTexto={setEmail}
            tipoTeclado="email-address"
            autoCapitalizar="none"
            erro={erros.email}
          />
        </View>
      </ScrollView>

      <View style={estilos.containerInferior}>
        <BotaoPrincipal
          titulo="Enviar Código"
          aoClicar={aoEnviar}
          carregando={carregando}
        />

        <TextoLink
          texto="Lembrou a senha?"
          textoLink="Fazer Login"
          aoClicar={() => navigation.navigate('Login')}
          estilo={estilos.linkVoltar}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const estilos = StyleSheet.create({
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
  containerFormulario: {
    flex: 1,
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

export default TelaEsqueciSenha;
