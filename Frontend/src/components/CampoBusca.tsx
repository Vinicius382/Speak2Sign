import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../theme/cores';

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

const estilos = StyleSheet.create({
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
    fontSize: 15,
    color: cores.textoPrincipal,
  },
});

export default CampoBusca;
