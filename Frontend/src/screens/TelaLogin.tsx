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
import { loginUsuario } from '../services/api';
import { cores } from '../theme/cores';
import { useAuth } from '../contexts/AuthProvider';

type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Inicial: undefined;
  EsqueciSenha: undefined;
};

interface TelaLoginProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
}

const TelaLogin: React.FC<TelaLoginProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState<{ email?: string; senha?: string }>({});
  const { salvarUsuario } = useAuth();

  const validar = (): boolean => {
    const novosErros: { email?: string; senha?: string } = {};

    if (!email.trim()) {
      novosErros.email = 'O e-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      novosErros.email = 'E-mail inválido';
    }

    if (!senha.trim()) {
      novosErros.senha = 'A senha é obrigatória';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const aoEntrar = async () => {
    if (!validar()) return;

    setCarregando(true);
    try {
      const resposta = await loginUsuario({ email: email.trim(), senha });
      await salvarUsuario({ id: resposta.id, nome: resposta.nome, email: resposta.email });
      navigation.reset({
        index: 0,
        routes: [{ name: 'Inicial' }],
      });
    } catch (erro: any) {
      const mensagem =
        erro.response?.data || 'Erro ao conectar com o servidor. Tente novamente.';
      Alert.alert('Erro', typeof mensagem === 'string' ? mensagem : 'Email ou senha incorretos.');
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

        <CabecalhoAutenticacao subtitulo="Seja Bem Vindo de Volta" />

        <View style={estilos.containerFormulario}>
          <EntradaPersonalizada
            placeholder="Email"
            textoPlaceholder="Digite seu email"
            valor={email}
            aoMudarTexto={setEmail}
            tipoTeclado="email-address"
            autoCapitalizar="none"
            erro={erros.email}
          />

          <EntradaPersonalizada
            placeholder="Senha"
            textoPlaceholder="Digite sua senha"
            valor={senha}
            aoMudarTexto={setSenha}
            textoSeguro
            erro={erros.senha}
          />

          <TextoLink
            texto="Esqueceu a Senha?"
            textoLink="Recupere"
            aoClicar={() => navigation.navigate('EsqueciSenha')}
            estilo={estilos.esqueceuSenha}
          />
        </View>
      </ScrollView>

      <View style={estilos.containerInferior}>
        <BotaoPrincipal
          titulo="Entrar"
          aoClicar={aoEntrar}
          carregando={carregando}
        />

        <TextoLink
          texto="Não tem Conta?"
          textoLink="Cadastre-se"
          aoClicar={() => navigation.navigate('Cadastro')}
          estilo={estilos.linkCadastro}
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
  esqueceuSenha: {
    alignItems: 'flex-end' as const,
    marginTop: -8,
    marginBottom: 8,
  },
  containerInferior: {
    paddingHorizontal: 28,
    paddingBottom: 38,
    paddingTop: 12,
    backgroundColor: cores.fundo,
  },
  linkCadastro: {
    marginTop: 14,
  },
});

export default TelaLogin;
