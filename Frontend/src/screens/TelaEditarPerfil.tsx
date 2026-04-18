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
import { atualizarPerfil } from '../services/api';
import BotaoVoltar from '../components/BotaoVoltar';
import EntradaPersonalizada from '../components/EntradaPersonalizada';
import BotaoPrincipal from '../components/BotaoPrincipal';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TelaEditarPerfil: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { usuario, atualizarNome } = useAuth();
  const [nome, setNome] = useState(usuario?.nome || '');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | undefined>();

  const aoSalvar = async () => {
    if (!nome.trim()) {
      setErro('O nome é obrigatório');
      return;
    }

    if (nome.trim() === usuario?.nome) {
      navigation.goBack();
      return;
    }

    if (!usuario) return;

    setCarregando(true);
    setErro(undefined);

    try {
      await atualizarPerfil(usuario.id, { nome: nome.trim() });
      await atualizarNome(nome.trim());
      Alert.alert('Sucesso!', 'Nome atualizado com sucesso.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      const mensagem =
        error.response?.data || 'Erro ao atualizar perfil. Tente novamente.';
      Alert.alert('Erro', typeof mensagem === 'string' ? mensagem : 'Erro ao atualizar.');
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
          <Text style={estilos.tituloCabecalho}>Editar Perfil</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Informação atual */}
        <View style={estilos.infoCard}>
          <View style={estilos.avatarContainer}>
            <Text style={estilos.avatarTexto}>
              {usuario?.nome
                ? usuario.nome
                    .split(' ')
                    .map((p) => p[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()
                : '??'}
            </Text>
          </View>
          <Text style={estilos.emailInfo}>{usuario?.email}</Text>
        </View>

        {/* Formulário */}
        <View style={estilos.formulario}>
          <EntradaPersonalizada
            placeholder="Nome Completo"
            textoPlaceholder="Seu novo nome"
            valor={nome}
            aoMudarTexto={(texto) => {
              setNome(texto);
              setErro(undefined);
            }}
            autoCapitalizar="words"
            erro={erro}
          />

          <BotaoPrincipal
            titulo="Salvar Alterações"
            aoClicar={aoSalvar}
            carregando={carregando}
            estilo={estilos.botaoSalvar}
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

  infoCard: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: cores.iconeTeal,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarTexto: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFF',
  },
  emailInfo: {
    fontSize: 14,
    color: cores.textoSecundario,
  },

  formulario: {
    flex: 1,
  },
  botaoSalvar: {
    marginTop: 20,
  },
});

export default TelaEditarPerfil;
