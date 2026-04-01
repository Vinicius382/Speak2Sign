import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/NavegacaoPrincipal';
import { cores } from '../theme/cores';
import BarraInferior from '../components/BarraInferior';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TelaInicial: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const avisoEmBreve = () => {
    Alert.alert('Em breve', 'Funcionalidade em desenvolvimento.');
  };

  return (
    <View style={estilos.container}>
      <ScrollView
        contentContainerStyle={estilos.conteudoScroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <View style={estilos.cabecalho}>
          <Text style={estilos.titulo}>Speak2Sign</Text>
          <Text style={estilos.subtitulo}>Bem vindo! O que deseja fazer?</Text>
        </View>

        {/* Label seção tradução */}
        <Text style={estilos.rotuloSecao}>TRADUÇÃO EM TEMPO REAL</Text>

        {/* Card principal */}
        <TouchableOpacity
          style={estilos.cardPrincipal}
          onPress={() => navigation.navigate('NovaTraducao')}
          activeOpacity={0.7}
        >
          {/* Ícone à esquerda */}
          <View style={estilos.cardPrincipalIconeContainer}>
            <MaterialCommunityIcons
              name="hand-wave-outline"
              size={30}
              color={cores.iconeTeal}
            />
            <View style={estilos.micBadge}>
              <Ionicons name="mic" size={10} color={cores.iconeTeal} />
            </View>
          </View>

          {/* Texto à direita */}
          <View style={estilos.cardPrincipalTexto}>
            <Text style={estilos.cardPrincipalTitulo}>Texto ou Áudio para Libras</Text>
            <Text style={estilos.cardPrincipalDescricao}>
              Use microfone ou teclado para gerar interpretação em Libras em tempo real.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Seção Meu Espaço */}
        <Text style={estilos.rotuloMeuEspaco}>Meu Espaço</Text>

        {/* Grade 2x2 */}
        <View style={estilos.grade}>
          <TouchableOpacity style={estilos.cardGrade} onPress={avisoEmBreve} activeOpacity={0.7}>
            <Ionicons name="star-outline" size={26} color={cores.textoSuave} />
            <Text style={estilos.cardGradeTitulo}>Favoritos</Text>
            <Text style={estilos.cardGradeDescricao}>Acesse suas mensagens favoritas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={estilos.cardGrade} onPress={avisoEmBreve} activeOpacity={0.7}>
            <Ionicons name="time-outline" size={26} color={cores.textoSuave} />
            <Text style={estilos.cardGradeTitulo}>Histórico</Text>
            <Text style={estilos.cardGradeDescricao}>Reveja suas conversas e mensagens anteriores</Text>
          </TouchableOpacity>

          <TouchableOpacity style={estilos.cardGrade} onPress={avisoEmBreve} activeOpacity={0.7}>
            <Ionicons name="book-outline" size={26} color={cores.textoSuave} />
            <Text style={estilos.cardGradeTitulo}>Mini-Curso{'\n'}de Libras</Text>
            <Text style={estilos.cardGradeDescricao}>Aprenda o básico de Libras</Text>
          </TouchableOpacity>

          <TouchableOpacity style={estilos.cardGrade} onPress={avisoEmBreve} activeOpacity={0.7}>
            <Ionicons name="person-outline" size={26} color={cores.textoSuave} />
            <Text style={estilos.cardGradeTitulo}>Minha Conta</Text>
            <Text style={estilos.cardGradeDescricao}>Gerencie suas configurações pessoais</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Barra de navegação inferior */}
      <BarraInferior aoClicarItem={avisoEmBreve} />
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudoScroll: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  cabecalho: {
    paddingTop: 60,
    paddingBottom: 24,
  },
  titulo: {
    fontSize: 32,
    fontWeight: '300',
    fontStyle: 'italic',
    color: '#333',
    marginBottom: 2,
  },
  subtitulo: {
    fontSize: 15,
    color: cores.textoSecundario,
    marginTop: 4,
  },

  rotuloSecao: {
    fontSize: 11,
    fontWeight: '600',
    color: cores.textoSuave,
    letterSpacing: 1.5,
    marginBottom: 12,
  },

  cardPrincipal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.superficie,
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    shadowColor: cores.sombra,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cardPrincipalIconeContainer: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: '#F0F4F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  micBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E8F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPrincipalTexto: {
    flex: 1,
  },
  cardPrincipalTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: cores.textoPrincipal,
    marginBottom: 4,
  },
  cardPrincipalDescricao: {
    fontSize: 13,
    color: cores.textoSecundario,
    lineHeight: 18,
  },

  rotuloMeuEspaco: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.textoSecundario,
    marginBottom: 14,
  },

  // Grade 2x2
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardGrade: {
    width: '48%',
    backgroundColor: cores.superficie,
    borderRadius: 16,
    padding: 15,
    marginBottom: 14,
    shadowColor: cores.sombra,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardGradeTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: cores.textoPrincipal,
    marginTop: 10,
    marginBottom: 6,
  },
  cardGradeDescricao: {
    fontSize: 12,
    color: cores.textoSecundario,
    lineHeight: 16,
  },
});

export default TelaInicial;
