import React, { useMemo } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useCores } from '../theme/useCores';
import type { Cores } from '../theme/cores';

interface IndicadoresProgressoProps {
  total?: number;
  atual: number;
  style?: StyleProp<ViewStyle>;
}

const IndicadoresProgresso: React.FC<IndicadoresProgressoProps> = ({ 
  total = 3, 
  atual, 
  style 
}) => {
  const { cores, fatorFonte } = useCores();
  const estilos = useMemo(() => criarEstilos(cores, fatorFonte), [cores, fatorFonte]);

  return (
    <View style={[estilos.indicadores, style]}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            estilos.indicador,
            index < atual && estilos.indicadorAtivo,
          ]}
        />
      ))}
    </View>
  );
};

const criarEstilos = (cores: Cores, fatorFonte: number = 1) => StyleSheet.create({
  indicadores: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  indicador: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: cores.inputBorda,
  },
  indicadorAtivo: {
    backgroundColor: cores.iconeTeal,
  },
});

export default IndicadoresProgresso;
