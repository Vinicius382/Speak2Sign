import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { useCores } from '../theme/useCores';
import type { Cores } from '../theme/cores';

interface BotaoPrincipalProps {
  titulo: string;
  aoClicar: () => void;
  carregando?: boolean;
  desativado?: boolean;
  estilo?: ViewStyle;
}

const BotaoPrincipal: React.FC<BotaoPrincipalProps> = ({
  titulo,
  aoClicar,
  carregando = false,
  desativado = false,
  estilo,
}) => {
  const { cores, fatorFonte } = useCores();
  const estilos = useMemo(() => criarEstilos(cores, fatorFonte), [cores, fatorFonte]);

  return (
    <View style={estilo}>
      <TouchableOpacity
        onPress={aoClicar}
        disabled={desativado || carregando}
        activeOpacity={0.85}
      >
        <View
          style={[
            estilos.botao,
            desativado && estilos.botaoDesativado,
          ]}
        >
          {carregando ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={estilos.texto}>{titulo}</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const criarEstilos = (cores: Cores, fatorFonte: number = 1) => StyleSheet.create({
  botao: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.destaque,
    shadowColor: cores.destaque,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  botaoDesativado: {
    backgroundColor: '#B0BEC5',
    shadowColor: '#90A4AE',
  },
  texto: {
    color: '#FFFFFF',
    fontSize: Math.round(18 * fatorFonte),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default BotaoPrincipal;
