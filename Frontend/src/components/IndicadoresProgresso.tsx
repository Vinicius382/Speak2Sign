import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { cores } from '../theme/cores';

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

const estilos = StyleSheet.create({
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
    backgroundColor: '#D9D9D9',
  },
  indicadorAtivo: {
    backgroundColor: cores.iconeTeal,
  },
});

export default IndicadoresProgresso;
