import React, { useState, useMemo } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCores } from '../theme/useCores';
import type { Cores } from '../theme/cores';

interface EntradaPersonalizadaProps {
  placeholder: string;
  valor: string;
  aoMudarTexto: (texto: string) => void;
  textoSeguro?: boolean;
  tipoTeclado?: 'default' | 'email-address' | 'numeric';
  autoCapitalizar?: 'none' | 'sentences' | 'words' | 'characters';
  erro?: string;
  estilo?: ViewStyle;
  textoPlaceholder?: string;
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
  textoPlaceholder,
}) => {
  const [estaFocado, setEstaFocado] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  
  const { cores, fatorFonte } = useCores();
  const estilos = useMemo(() => criarEstilos(cores, fatorFonte), [cores, fatorFonte]);

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
          style={[estilos.input, textoSeguro && estilos.inputComIcone]}
          value={valor}
          onChangeText={aoMudarTexto}
          secureTextEntry={textoSeguro && !senhaVisivel}
          keyboardType={tipoTeclado}
          autoCapitalize={autoCapitalizar}
          placeholder={textoPlaceholder ?? placeholder}
          placeholderTextColor={cores.inputPlaceholder}
          onFocus={() => setEstaFocado(true)}
          onBlur={() => setEstaFocado(false)}
        />
        {textoSeguro && (
          <TouchableOpacity
            style={estilos.botaoOlho}
            onPress={() => setSenhaVisivel(!senhaVisivel)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={senhaVisivel ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={cores.textoSecundario}
            />
          </TouchableOpacity>
        )}
      </View>
      {erro ? <Text style={estilos.textoErro}>{erro}</Text> : null}
    </View>
  );
};

const criarEstilos = (cores: Cores, fatorFonte: number = 1) => StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  rotulo: {
    fontSize: Math.round(14 * fatorFonte),
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: Math.round(16 * fatorFonte),
    color: cores.textoPrincipal,
  },
  inputComIcone: {
    paddingRight: 48,
  },
  botaoOlho: {
    position: 'absolute',
    right: 14,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoErro: {
    fontSize: Math.round(12 * fatorFonte),
    color: cores.erro,
    marginTop: 6,
    marginLeft: 4,
  },
});

export default EntradaPersonalizada;
