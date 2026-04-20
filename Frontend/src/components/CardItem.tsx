import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCores } from '../theme/useCores';
import type { Cores } from '../theme/cores';
import type { TipoTraducao } from '../contexts/HistoricoFavoritosProvider';

interface CardItemProps {
  id: string;
  tipo: TipoTraducao;
  texto: string;
  data: string;
  ehFavorito?: boolean;
  // Modo: 'historico' mostra X para deletar + botão favoritar; 'favorito' mostra estrela para remover
  modo: 'historico' | 'favorito';
  aoRemover: (id: string) => void;
  aoPlay: (texto: string) => void;
  aoAlternarFavorito?: (texto: string, tipo: TipoTraducao) => void;
}

const obterCorTipo = (tipo: TipoTraducao, coresObj: Cores): string => {
  switch (tipo) {
    case 'voz':
      return coresObj.tipoVoz;
    case 'texto':
      return coresObj.tipoTexto;
    case 'libras':
      return coresObj.tipoLibras;
  }
};

const obterRotuloTipo = (tipo: TipoTraducao): string => {
  switch (tipo) {
    case 'voz':
      return 'Voz';
    case 'texto':
      return 'Texto';
    case 'libras':
      return 'Libras';
  }
};

const CardItem: React.FC<CardItemProps> = ({
  id,
  tipo,
  texto,
  data,
  ehFavorito = false,
  modo,
  aoRemover,
  aoPlay,
  aoAlternarFavorito,
}) => {
  const { cores, fatorFonte } = useCores();
  const estilos = useMemo(() => criarEstilos(cores, fatorFonte), [cores, fatorFonte]);
  const corTipo = obterCorTipo(tipo, cores);

  return (
    <View style={estilos.card}>
      {/* Tag de tipo */}
      <View style={[estilos.tag, { backgroundColor: corTipo + '20' }]}>
        <View style={[estilos.tagPonto, { backgroundColor: corTipo }]} />
        <Text style={[estilos.tagTexto, { color: corTipo }]}>
          {obterRotuloTipo(tipo)}
        </Text>
      </View>

      {/* Ação principal (canto superior direito) */}
      <TouchableOpacity
        style={estilos.botaoPrincipal}
        onPress={() => aoRemover(id)}
      >
        {modo === 'favorito' ? (
          <Ionicons name="star" size={24} color={cores.favorito} />
        ) : (
          <Ionicons name="close-circle" size={22} color={cores.textoSuave} />
        )}
      </TouchableOpacity>

      {/* Texto */}
      <Text style={estilos.texto} numberOfLines={3}>
        {texto}
      </Text>

      {/* Rodapé */}
      <View style={estilos.rodape}>
        <Text style={estilos.data}>{data}</Text>
        <View style={estilos.acoes}>
          {/* Botão play */}
          <TouchableOpacity
            style={estilos.botaoPlay}
            onPress={() => aoPlay(texto)}
          >
            <Ionicons name="play" size={16} color="#FFF" />
          </TouchableOpacity>

          {/* Botão favoritar (apenas no modo histórico) */}
          {modo === 'historico' && aoAlternarFavorito && (
            <TouchableOpacity
              style={[
                estilos.botaoFavoritar,
                ehFavorito && estilos.botaoFavoritarAtivo,
              ]}
              onPress={() => aoAlternarFavorito(texto, tipo)}
            >
              <Ionicons
                name={ehFavorito ? 'star' : 'star-outline'}
                size={16}
                color={ehFavorito ? cores.favorito : cores.textoSuave}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const criarEstilos = (cores: Cores, fatorFonte: number = 1) => StyleSheet.create({
  card: {
    backgroundColor: cores.superficie,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: cores.inputBorda,
    position: 'relative',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  tagPonto: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  tagTexto: {
    fontSize: Math.round(12 * fatorFonte),
    fontWeight: '600',
  },
  botaoPrincipal: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  texto: {
    fontSize: Math.round(16 * fatorFonte),
    color: cores.textoPrincipal,
    fontWeight: '500',
    marginBottom: 12,
    paddingRight: 30,
  },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  data: {
    fontSize: Math.round(12 * fatorFonte),
    color: cores.textoSuave,
  },
  acoes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  botaoPlay: {
    backgroundColor: cores.iconeTeal,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoFavoritar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.favoritoFundo,
  },
  botaoFavoritarAtivo: {
    backgroundColor: cores.favoritoAtivoFundo,
  },
});

export default CardItem;
