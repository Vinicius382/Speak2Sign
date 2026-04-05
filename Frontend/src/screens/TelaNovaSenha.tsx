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
import { RouteProp } from '@react-navigation/native';
import CabecalhoAutenticacao from '../components/CabecalhoAutenticacao';
import EntradaPersonalizada from '../components/EntradaPersonalizada';
import BotaoPrincipal from '../components/BotaoPrincipal';
import { redefinirSenha } from '../services/api';
import { cores } from '../theme/cores';

type RootStackParamList = {
  Login: undefined;
  NovaSenha: { email: string; token: string };
};

interface TelaNovaSenhaProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NovaSenha'>;
  route: RouteProp<RootStackParamList, 'NovaSenha'>;
}

const TelaNovaSenha: React.FC<TelaNovaSenhaProps> = ({ navigation, route }) => {
  const { email, token } = route.params;
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState<{ novaSenha?: string; confirmarSenha?: string }>({});

  const validar = (): boolean => {
    const novosErros: { novaSenha?: string; confirmarSenha?: string } = {};

    if (!novaSenha.trim()) {
      novosErros.novaSenha = 'A nova senha é obrigatória';
    } else if (novaSenha.length < 6) {
      novosErros.novaSenha = 'A senha deve ter pelo menos 6 caracteres';
    }

    if (!confirmarSenha.trim()) {
      novosErros.confirmarSenha = 'Confirme sua nova senha';
    } else if (novaSenha !== confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas não coincidem';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const aoRedefinir = async () => {
    if (!validar()) return;

    setCarregando(true);
    try {
      await redefinirSenha({ email, token, novaSenha });
      Alert.alert(
        'Sucesso!',
        'Sua senha foi redefinida com sucesso. Faça login com a nova senha.',
        [
          {
            text: 'OK',
            onPress: () =>
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              }),
          },
        ]
      );
    } catch (erro: any) {
      const mensagem =
        erro.response?.data || 'Erro ao redefinir senha. Tente novamente.';
      Alert.alert('Erro', typeof mensagem === 'string' ? mensagem : 'Erro ao redefinir senha.');
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

        <CabecalhoAutenticacao subtitulo="Crie Sua Nova Senha" />

        <View style={estilos.containerFormulario}>
          <EntradaPersonalizada
            placeholder="Nova Senha"
            textoPlaceholder="Mínimo de 6 caracteres"
            valor={novaSenha}
            aoMudarTexto={setNovaSenha}
            textoSeguro
            erro={erros.novaSenha}
          />

          <EntradaPersonalizada
            placeholder="Confirmar Nova Senha"
            textoPlaceholder="Digite a senha novamente"
            valor={confirmarSenha}
            aoMudarTexto={setConfirmarSenha}
            textoSeguro
            erro={erros.confirmarSenha}
          />
        </View>
      </ScrollView>

      <View style={estilos.containerInferior}>
        <BotaoPrincipal
          titulo="Redefinir Senha"
          aoClicar={aoRedefinir}
          carregando={carregando}
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
});

export default TelaNovaSenha;
