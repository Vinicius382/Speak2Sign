import React, { useState, useMemo } from 'react';
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
import { cadastrarUsuario } from '../services/api';
import { useCores } from '../theme/useCores';
import type { Cores } from '../theme/cores';

type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Inicial: undefined;
};

interface TelaCadastroProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Cadastro'>;
}

const TelaCadastro: React.FC<TelaCadastroProps> = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState<{
    nome?: string;
    email?: string;
    senha?: string;
    confirmarSenha?: string;
  }>({});

  const { cores, fatorFonte } = useCores();
  const estilos = useMemo(() => criarEstilos(cores, fatorFonte), [cores, fatorFonte]);

  const validar = (): boolean => {
    const novosErros: typeof erros = {};

    if (!nome.trim()) {
      novosErros.nome = 'O nome é obrigatório';
    }

    if (!email.trim()) {
      novosErros.email = 'O e-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      novosErros.email = 'E-mail inválido';
    }

    if (!senha.trim()) {
      novosErros.senha = 'A senha é obrigatória';
    } else if (senha.length < 6) {
      novosErros.senha = 'A senha deve ter pelo menos 6 caracteres';
    }

    if (!confirmarSenha.trim()) {
      novosErros.confirmarSenha = 'Confirme sua senha';
    } else if (senha !== confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas não coincidem';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const aoCadastrar = async () => {
    if (!validar()) return;

    setCarregando(true);
    try {
      await cadastrarUsuario({ nome: nome.trim(), email: email.trim(), senha });
      Alert.alert('Sucesso!', 'Conta criada com sucesso! Faça login para continuar.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (erro: any) {
      const mensagem =
        erro.response?.data || 'Erro ao conectar com o servidor. Tente novamente.';
      Alert.alert('Erro', typeof mensagem === 'string' ? mensagem : 'Erro ao cadastrar.');
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

        <CabecalhoAutenticacao subtitulo="Faça Seu Cadastro" />

        <View style={estilos.containerFormulario}>
          <EntradaPersonalizada
            placeholder="Nome Completo"
            textoPlaceholder="Seu Nome"
            valor={nome}
            aoMudarTexto={setNome}
            autoCapitalizar="words"
            erro={erros.nome}
          />

          <EntradaPersonalizada
            placeholder="Email"
            textoPlaceholder="email@email.com"
            valor={email}
            aoMudarTexto={setEmail}
            tipoTeclado="email-address"
            autoCapitalizar="none"
            erro={erros.email}
          />

          <EntradaPersonalizada
            placeholder="Senha"
            textoPlaceholder="Mínimo de 6 Caracteres"
            valor={senha}
            aoMudarTexto={setSenha}
            textoSeguro
            erro={erros.senha}
          />

          <EntradaPersonalizada
            placeholder="Confirmar Senha"
            textoPlaceholder="Digite a senha novamente"
            valor={confirmarSenha}
            aoMudarTexto={setConfirmarSenha}
            textoSeguro
            erro={erros.confirmarSenha}
          />

          <BotaoPrincipal
            titulo="Criar Conta"
            aoClicar={aoCadastrar}
            carregando={carregando}
            estilo={estilos.botao}
          />

          <TextoLink
            texto="Já tem conta?"
            textoLink="Fazer Login"
            aoClicar={() => navigation.navigate('Login')}
            estilo={estilos.linkLogin}
          />
        </View>
      </ScrollView>
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
    paddingBottom: 30,
  },
  espacoTopo: {
    height: 60,
  },
  containerFormulario: {
    flex: 1,
  },
  botao: {
    marginTop: 80,
    marginBottom: -10,
  },
  linkLogin: {
    marginTop: 24,
  },
});

export default TelaCadastro;
