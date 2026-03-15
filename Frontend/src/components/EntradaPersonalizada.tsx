import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { cores } from '../theme/cores';

interface EntradaPersonalizadaProps {
  placeholder: string;
  valor: string;
  aoMudarTexto: (texto: string) => void;
  textoSeguro?: boolean;
  tipoTeclado?: 'default' | 'email-address' | 'numeric';
  autoCapitalizar?: 'none' | 'sentences' | 'words' | 'characters';
  erro?: string;
  estilo?: ViewStyle;
}

const EntradaPersonalizada: React.FC<EntradaPersonalizadaProps> = ({
  placeholder,
  valor,
  aoMudarTexto,
  textoSeguro = false,
  tipoTeclado = 'default',
  autoCapitalizar = 'none',
  erro,
  estilo,
}) => {
  const [estaFocado, setEstaFocado] = useState(false);

  const corBorda = erro
    ? cores.erro
    : estaFocado
      ? cores.inputBordaFocado
      : cores.inputBorda;

  return (
    <View style={[estilos.container, estilo]}>
      <Text style={[estilos.rotulo, estaFocado && estilos.rotuloFocado, erro && estilos.rotuloErro]}>
        {placeholder}
      </Text>
      <View style={[estilos.wrapperInput, { borderColor: corBorda }]}>
        <TextInput
          style={estilos.input}
          value={valor}
          onChangeText={aoMudarTexto}
          secureTextEntry={textoSeguro}
          keyboardType={tipoTeclado}
          autoCapitalize={autoCapitalizar}
          placeholder={`Digite seu ${placeholder.toLowerCase()}`}
          placeholderTextColor={cores.inputPlaceholder}
          onFocus={() => setEstaFocado(true)}
          onBlur={() => setEstaFocado(false)}
        />
      </View>
      {erro ? <Text style={estilos.textoErro}>{erro}</Text> : null}
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: '600',
    color: cores.textoSecundario,
    marginBottom: 8,
  },
  rotuloFocado: {
    color: cores.destaque,
  },
  rotuloErro: {
    color: cores.erro,
  },
  wrapperInput: {
    borderWidth: 1.5,
    borderRadius: 14,
    backgroundColor: cores.inputFundo,
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    color: cores.textoPrincipal,
  },
  textoErro: {
    fontSize: 12,
    color: cores.erro,
    marginTop: 6,
    marginLeft: 4,
  },
});

export default EntradaPersonalizada;
