import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/NavegacaoPrincipal';
import { useCores } from '../theme/useCores';
import type { Cores } from '../theme/cores';
import { useAuth } from '../contexts/AuthProvider';
import { useConfiguracoes } from '../contexts/ConfiguracoesProvider';
import type { TamanhoFonte, VelocidadeAvatar } from '../contexts/ConfiguracoesProvider';
import BotaoVoltar from '../components/BotaoVoltar';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TelaMinhaConta: React.FC = () => {
  const { usuario, limparUsuario } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const { cores, estaEscuro, fatorFonte } = useCores();
  const estilos = useMemo(() => criarEstilos(cores, fatorFonte), [cores, fatorFonte]);
  const {
    config,
    setTemaEscuro,
    setTamanhoFonte,
    setVelocidadeAvatar,
    setSincronizacaoAtivada,
  } = useConfiguracoes();

  const iniciais = usuario?.nome
    ? usuario.nome
        .split(' ')
        .map((p) => p[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : '??';

  // Componente de item de menu navegável
  const ItemMenu: React.FC<{
    icone: keyof typeof Ionicons.glyphMap;
    titulo: string;
    subtitulo?: string;
    aoClicar: () => void;
    corIcone?: string;
    perigo?: boolean;
  }> = ({ icone, titulo, subtitulo, aoClicar, corIcone, perigo }) => (
    <TouchableOpacity style={estilos.itemMenu} onPress={aoClicar} activeOpacity={0.6}>
      <View style={[estilos.itemMenuIcone, perigo && { backgroundColor: cores.perigo }]}>
        <Ionicons name={icone} size={20} color={perigo ? cores.erro : (corIcone || cores.iconeTeal)} />
      </View>
      <View style={estilos.itemMenuTexto}>
        <Text style={[estilos.itemMenuTitulo, perigo && { color: cores.erro }]}>{titulo}</Text>
        {subtitulo && <Text style={estilos.itemMenuSubtitulo}>{subtitulo}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={18} color={cores.textoSuave} />
    </TouchableOpacity>
  );

  // Componente de toggle
  const ItemToggle: React.FC<{
    icone: keyof typeof Ionicons.glyphMap;
    titulo: string;
    subtitulo?: string;
    valor: boolean;
    aoMudar: (valor: boolean) => void;
    corIcone?: string;
  }> = ({ icone, titulo, subtitulo, valor, aoMudar, corIcone }) => (
    <View style={estilos.itemMenu}>
      <View style={estilos.itemMenuIcone}>
        <Ionicons name={icone} size={20} color={corIcone || cores.iconeTeal} />
      </View>
      <View style={estilos.itemMenuTexto}>
        <Text style={estilos.itemMenuTitulo}>{titulo}</Text>
        {subtitulo && <Text style={estilos.itemMenuSubtitulo}>{subtitulo}</Text>}
      </View>
      <Switch
        value={valor}
        onValueChange={aoMudar}
        trackColor={{ false: cores.inputBorda, true: '#A5D6A7' }}
        thumbColor={valor ? cores.destaque : cores.superficie}
      />
    </View>
  );

  // Componente seletor de opções
  const ItemSeletor: React.FC<{
    icone: keyof typeof Ionicons.glyphMap;
    titulo: string;
    opcoes: { rotulo: string; valor: string }[];
    valorAtual: string;
    aoMudar: (valor: string) => void;
    corIcone?: string;
  }> = ({ icone, titulo, opcoes, valorAtual, aoMudar, corIcone }) => (
    <View style={estilos.itemSeletor}>
      <View style={estilos.itemSeletorCabecalho}>
        <View style={estilos.itemMenuIcone}>
          <Ionicons name={icone} size={20} color={corIcone || cores.iconeTeal} />
        </View>
        <Text style={estilos.itemMenuTitulo}>{titulo}</Text>
      </View>
      <View style={estilos.seletorOpcoes}>
        {opcoes.map((opcao) => (
          <TouchableOpacity
            key={opcao.valor}
            style={[
              estilos.seletorBotao,
              valorAtual === opcao.valor && estilos.seletorBotaoAtivo,
            ]}
            onPress={() => aoMudar(opcao.valor)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                estilos.seletorBotaoTexto,
                valorAtual === opcao.valor && estilos.seletorBotaoTextoAtivo,
              ]}
            >
              {opcao.rotulo}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const confirmarLimparDados = () => {
    Alert.alert(
      'Limpar Dados Locais',
      'Isso irá apagar todo o histórico e favoritos armazenados neste dispositivo. Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                '@speak2sign_historico',
                '@speak2sign_favoritos',
              ]);
              Alert.alert('Pronto!', 'Dados locais foram limpos com sucesso.');
            } catch (e) {
              Alert.alert('Erro', 'Não foi possível limpar os dados.');
            }
          },
        },
      ]
    );
  };

  const confirmarSair = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja encerrar sua sessão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await limparUsuario();
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={estilos.container} edges={['top']}>
      <StatusBar barStyle={estaEscuro ? 'light-content' : 'dark-content'} backgroundColor={cores.fundo} />
      <ScrollView
        contentContainerStyle={estilos.conteudoScroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <View style={estilos.cabecalho}>
          <BotaoVoltar />
          <Text style={estilos.tituloCabecalho}>Minha Conta</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Card do perfil */}
        <View style={estilos.cardPerfil}>
          <View style={estilos.avatarContainer}>
            <Text style={estilos.avatarTexto}>{iniciais}</Text>
          </View>
          <View style={estilos.perfilInfo}>
            <Text style={estilos.perfilNome}>{usuario?.nome || 'Usuário'}</Text>
            <Text style={estilos.perfilEmail}>{usuario?.email || 'email@exemplo.com'}</Text>
          </View>
        </View>

        {/* Seção Perfil */}
        <Text style={estilos.rotuloSecao}>PERFIL</Text>
        <View style={estilos.secaoCard}>
          <ItemMenu
            icone="person-outline"
            titulo="Editar Perfil"
            subtitulo="Altere seu nome"
            aoClicar={() => navigation.navigate('EditarPerfil')}
          />
          <View style={estilos.divisor} />
          <ItemMenu
            icone="lock-closed-outline"
            titulo="Alterar Senha"
            subtitulo="Atualize sua senha de acesso"
            aoClicar={() => navigation.navigate('AlterarSenha')}
          />
        </View>

        {/* Seção Preferências */}
        <Text style={estilos.rotuloSecao}>PREFERÊNCIAS DO APP</Text>
        <View style={estilos.secaoCard}>
          <ItemToggle
            icone="sync-outline"
            titulo="Sincronização"
            subtitulo="Sincronizar histórico e favoritos com a nuvem"
            valor={config.sincronizacaoAtivada}
            aoMudar={setSincronizacaoAtivada}
          />
          <View style={estilos.divisor} />
          <ItemSeletor
            icone="speedometer-outline"
            titulo="Velocidade do Avatar"
            opcoes={[
              { rotulo: 'Lenta', valor: 'lenta' },
              { rotulo: 'Normal', valor: 'normal' },
              { rotulo: 'Rápida', valor: 'rapida' },
            ]}
            valorAtual={config.velocidadeAvatar}
            aoMudar={(v) => setVelocidadeAvatar(v as VelocidadeAvatar)}
          />
          <View style={estilos.divisor} />
          <ItemToggle
            icone="moon-outline"
            titulo="Modo Escuro"
            subtitulo="Alterna entre tema claro e escuro"
            valor={config.temaEscuro}
            aoMudar={setTemaEscuro}
            corIcone="#6366F1"
          />
          <View style={estilos.divisor} />
          <ItemSeletor
            icone="text-outline"
            titulo="Tamanho da Fonte"
            opcoes={[
              { rotulo: 'Pequeno', valor: 'pequeno' },
              { rotulo: 'Médio', valor: 'medio' },
              { rotulo: 'Grande', valor: 'grande' },
            ]}
            valorAtual={config.tamanhoFonte}
            aoMudar={(v) => setTamanhoFonte(v as TamanhoFonte)}
          />
        </View>

        {/* Seção Ações */}
        <Text style={estilos.rotuloSecao}>AÇÕES</Text>
        <View style={estilos.secaoCard}>
          <ItemMenu
            icone="trash-outline"
            titulo="Limpar Dados Locais"
            subtitulo="Apagar histórico e favoritos do dispositivo"
            aoClicar={confirmarLimparDados}
            corIcone="#F59E0B"
          />
        </View>

        {/* Botão Sair */}
        <TouchableOpacity
          style={estilos.botaoSair}
          onPress={confirmarSair}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color="#FFF" />
          <Text style={estilos.botaoSairTexto}>Sair da Conta</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const criarEstilos = (cores: Cores, fatorFonte: number = 1) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudoScroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Cabeçalho
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 8,
  },
  tituloCabecalho: {
    fontSize: Math.round(18 * fatorFonte),
    fontWeight: '700',
    color: cores.textoPrincipal,
  },

  // Card Perfil
  cardPerfil: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.superficie,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: cores.sombra,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: cores.iconeTeal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarTexto: {
    fontSize: Math.round(20 * fatorFonte),
    fontWeight: '700',
    color: '#FFF',
  },
  perfilInfo: {
    flex: 1,
  },
  perfilNome: {
    fontSize: Math.round(18 * fatorFonte),
    fontWeight: '700',
    color: cores.textoPrincipal,
    marginBottom: 4,
  },
  perfilEmail: {
    fontSize: Math.round(14 * fatorFonte),
    color: cores.textoSecundario,
  },

  // Seções
  rotuloSecao: {
    fontSize: Math.round(11 * fatorFonte),
    fontWeight: '600',
    color: cores.textoSuave,
    letterSpacing: 1.5,
    marginBottom: 10,
    marginTop: 4,
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
  divisor: {
    height: 1,
    backgroundColor: cores.divisor,
    marginHorizontal: 16,
  },

  // Item de menu
  itemMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemMenuIcone: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: cores.fundoIcone,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  itemMenuTexto: {
    flex: 1,
  },
  itemMenuTitulo: {
    fontSize: Math.round(15 * fatorFonte),
    fontWeight: '600',
    color: cores.textoPrincipal,
  },
  itemMenuSubtitulo: {
    fontSize: Math.round(12 * fatorFonte),
    color: cores.textoSecundario,
    marginTop: 2,
  },

  // Seletor
  itemSeletor: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemSeletorCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  seletorOpcoes: {
    flexDirection: 'row',
    backgroundColor: cores.seletorFundo,
    borderRadius: 12,
    padding: 3,
  },
  seletorBotao: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  seletorBotaoAtivo: {
    backgroundColor: cores.superficie,
    shadowColor: cores.sombra,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  seletorBotaoTexto: {
    fontSize: Math.round(13 * fatorFonte),
    fontWeight: '500',
    color: cores.textoSecundario,
  },
  seletorBotaoTextoAtivo: {
    color: cores.destaque,
    fontWeight: '700',
  },

  // Botão Sair
  botaoSair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.erro,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 8,
    gap: 8,
  },
  botaoSairTexto: {
    fontSize: Math.round(16 * fatorFonte),
    fontWeight: '700',
    color: '#FFF',
  },
});

export default TelaMinhaConta;
