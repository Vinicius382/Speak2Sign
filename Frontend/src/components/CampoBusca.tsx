import React, { useMemo } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCores } from '../theme/useCores';
import type { Cores } from '../theme/cores';

interface CampoBuscaProps {
  valor: string;
  aoMudar: (texto: string) => void;
  placeholder?: string;
}

const CampoBusca: React.FC<CampoBuscaProps> = ({
  valor,
  aoMudar,
  placeholder = 'Buscar...',
}) => {
  const { cores, fatorFonte } = useCores();
  const estilos = useMemo(() => criarEstilos(cores, fatorFonte), [cores, fatorFonte]);

  return (
    <View style={estilos.container}>
      <Ionicons name="search-outline" size={20} color={cores.textoSuave} style={estilos.icone} />
      <TextInput
        style={estilos.input}
        placeholder={placeholder}
        placeholderTextColor={cores.textoSuave}
        value={valor}
        onChangeText={aoMudar}
      />
    </View>
  );
};

const criarEstilos = (cores: Cores, fatorFonte: number = 1) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.superficie,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: cores.inputBorda,
  },
  icone: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: Math.round(15 * fatorFonte),
    color: cores.textoPrincipal,
  },
});

export default CampoBusca;
