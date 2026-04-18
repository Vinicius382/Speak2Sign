import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/NavegacaoPrincipal';
import { cores } from '../theme/cores';
import { useAuth } from '../contexts/AuthProvider';
import { alterarSenhaApi } from '../services/api';
import BotaoVoltar from '../components/BotaoVoltar';
import EntradaPersonalizada from '../components/EntradaPersonalizada';
import BotaoPrincipal from '../components/BotaoPrincipal';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TelaAlterarSenha: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { usuario } = useAuth();
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState<{
    senhaAtual?: string;
    novaSenha?: string;
    confirmarSenha?: string;
  }>({});

  const validar = (): boolean => {
    const novosErros: typeof erros = {};

    if (!senhaAtual.trim()) {
      novosErros.senhaAtual = 'Informe a senha atual';
    }

    if (!novaSenha.trim()) {
      novosErros.novaSenha = 'A nova senha é obrigatória';
    } else if (novaSenha.length < 6) {
      novosErros.novaSenha = 'A senha deve ter pelo menos 6 caracteres';
    }

    if (!confirmarSenha.trim()) {
      novosErros.confirmarSenha = 'Confirme a nova senha';
    } else if (novaSenha !== confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas não coincidem';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const aoAlterar = async () => {
    if (!validar() || !usuario) return;

    setCarregando(true);

    try {
      await alterarSenhaApi(usuario.id, {
        senhaAtual,
        novaSenha,
      });
      Alert.alert('Sucesso!', 'Senha alterada com sucesso.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      const mensagem =
        error.response?.data || 'Erro ao alterar senha. Tente novamente.';
      Alert.alert('Erro', typeof mensagem === 'string' ? mensagem : 'Erro ao alterar senha.');
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
        {/* Cabeçalho */}
        <View style={estilos.cabecalho}>
          <BotaoVoltar />
          <Text style={estilos.tituloCabecalho}>Alterar Senha</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Descrição */}
        <View style={estilos.descricaoCard}>
          <View style={estilos.descricaoIcone}>
            <Text style={{ fontSize: 28 }}>🔒</Text>
          </View>
          <Text style={estilos.descricaoTexto}>
            Para sua segurança, informe sua senha atual antes de definir uma nova senha.
          </Text>
        </View>

        {/* Formulário */}
        <View style={estilos.formulario}>
          <EntradaPersonalizada
            placeholder="Senha Atual"
            textoPlaceholder="Digite sua senha atual"
            valor={senhaAtual}
            aoMudarTexto={(texto) => {
              setSenhaAtual(texto);
              setErros((prev) => ({ ...prev, senhaAtual: undefined }));
            }}
            textoSeguro
            erro={erros.senhaAtual}
          />

          <EntradaPersonalizada
            placeholder="Nova Senha"
            textoPlaceholder="Mínimo de 6 caracteres"
            valor={novaSenha}
            aoMudarTexto={(texto) => {
              setNovaSenha(texto);
              setErros((prev) => ({ ...prev, novaSenha: undefined }));
            }}
            textoSeguro
            erro={erros.novaSenha}
          />

          <EntradaPersonalizada
            placeholder="Confirmar Nova Senha"
            textoPlaceholder="Digite a nova senha novamente"
            valor={confirmarSenha}
            aoMudarTexto={(texto) => {
              setConfirmarSenha(texto);
              setErros((prev) => ({ ...prev, confirmarSenha: undefined }));
            }}
            textoSeguro
            erro={erros.confirmarSenha}
          />

          <BotaoPrincipal
            titulo="Alterar Senha"
            aoClicar={aoAlterar}
            carregando={carregando}
            estilo={estilos.botaoAlterar}
          />
        </View>
      </ScrollView>
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
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
  },
  tituloCabecalho: {
    fontSize: 18,
    fontWeight: '700',
    color: cores.textoPrincipal,
  },

  descricaoCard: {
    alignItems: 'center',
    backgroundColor: cores.superficie,
    borderRadius: 16,
    padding: 24,
    marginBottom: 28,
    shadowColor: cores.sombra,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  descricaoIcone: {
    marginBottom: 12,
  },
  descricaoTexto: {
    fontSize: 14,
    color: cores.textoSecundario,
    textAlign: 'center',
    lineHeight: 20,
  },

  formulario: {
    flex: 1,
  },
  botaoAlterar: {
    marginTop: 20,
  },
});

export default TelaAlterarSenha;
