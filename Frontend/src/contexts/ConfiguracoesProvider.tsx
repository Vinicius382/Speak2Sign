import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipos
export type TamanhoFonte = 'pequeno' | 'medio' | 'grande';
export type VelocidadeAvatar = 'lenta' | 'normal' | 'rapida';
export type AvatarVLibras = 'icaro' | 'hosana' | 'guga' | 'random';
export type OpacidadeVLibras = 0 | 0.25 | 0.5 | 0.75 | 1;

export interface PersonalizacaoVLibras {
  calca: string;
  camisa: string;
  cabelo: string;
  corpo: string;
  iris: string;
  olhos: string;
  sobrancelhas: string;
}

export interface Configuracoes {
  temaEscuro: boolean;
  tamanhoFonte: TamanhoFonte;
  velocidadeAvatar: VelocidadeAvatar;
  sincronizacaoAtivada: boolean;
  personalizacaoVLibras: PersonalizacaoVLibras;
  avatarVLibras: AvatarVLibras;
  opacidadeVLibras: OpacidadeVLibras;
  revisaoVLibras: number;
}

interface ConfiguracoesContexto {
  config: Configuracoes;
  configuracoesCarregadas: boolean;
  setTemaEscuro: (valor: boolean) => void;
  setTamanhoFonte: (valor: TamanhoFonte) => void;
  setVelocidadeAvatar: (valor: VelocidadeAvatar) => void;
  setSincronizacaoAtivada: (valor: boolean) => void;
  setPersonalizacaoVLibras: (valor: PersonalizacaoVLibras) => void;
  setAvatarVLibras: (valor: AvatarVLibras) => void;
  setOpacidadeVLibras: (valor: OpacidadeVLibras) => void;
  salvarPersonalizacaoVLibras: (
    personalizacao: PersonalizacaoVLibras,
    opacidade: OpacidadeVLibras,
    avatar?: AvatarVLibras
  ) => void;
  resetPersonalizacaoVLibras: () => void;
}

const CHAVE_CONFIG = '@speak2sign_configuracoes';

export const personalizacaoVLibrasPadrao: PersonalizacaoVLibras = {
  calca: '#201E62',
  camisa: '#1A1A1A',
  cabelo: '#000000',
  corpo: '#C18471',
  iris: '#000000',
  olhos: '#FFFFFF',
  sobrancelhas: '#000000',
};

const configPadrao: Configuracoes = {
  temaEscuro: false,
  tamanhoFonte: 'medio',
  velocidadeAvatar: 'normal',
  sincronizacaoAtivada: true,
  personalizacaoVLibras: personalizacaoVLibrasPadrao,
  avatarVLibras: 'icaro',
  opacidadeVLibras: 1,
  revisaoVLibras: 0,
};

const CAMPOS_PERSONALIZACAO: (keyof PersonalizacaoVLibras)[] = [
  'calca',
  'camisa',
  'cabelo',
  'corpo',
  'iris',
  'olhos',
  'sobrancelhas',
];

const AVATARES_VLIBRAS: AvatarVLibras[] = ['icaro', 'hosana', 'guga', 'random'];
const OPACIDADES_VLIBRAS: OpacidadeVLibras[] = [0, 0.25, 0.5, 0.75, 1];

const normalizarCorHex = (valor: unknown, padrao: string): string => {
  if (typeof valor !== 'string') {
    return padrao;
  }

  const semHash = valor.trim().replace(/^#/, '');
  if (!/^[0-9A-Fa-f]{6}$/.test(semHash)) {
    return padrao;
  }

  return `#${semHash.toUpperCase()}`;
};

const normalizarPersonalizacaoVLibras = (
  valor?: Partial<PersonalizacaoVLibras>
): PersonalizacaoVLibras => {
  const personalizacao = { ...personalizacaoVLibrasPadrao };

  CAMPOS_PERSONALIZACAO.forEach((campo) => {
    personalizacao[campo] = normalizarCorHex(valor?.[campo], personalizacaoVLibrasPadrao[campo]);
  });

  return personalizacao;
};

const normalizarAvatarVLibras = (valor: unknown): AvatarVLibras => {
  if (typeof valor === 'string' && AVATARES_VLIBRAS.includes(valor as AvatarVLibras)) {
    return valor as AvatarVLibras;
  }

  return configPadrao.avatarVLibras;
};

const normalizarOpacidadeVLibras = (valor: unknown): OpacidadeVLibras => {
  if (typeof valor === 'number' && OPACIDADES_VLIBRAS.includes(valor as OpacidadeVLibras)) {
    return valor as OpacidadeVLibras;
  }

  return configPadrao.opacidadeVLibras;
};

const mesclarConfiguracoes = (valor: unknown): Configuracoes => {
  if (!valor || typeof valor !== 'object') {
    return configPadrao;
  }

  const armazenada = valor as Partial<Configuracoes>;

  return {
    ...configPadrao,
    ...armazenada,
    personalizacaoVLibras: normalizarPersonalizacaoVLibras(armazenada.personalizacaoVLibras),
    avatarVLibras: normalizarAvatarVLibras(armazenada.avatarVLibras),
    opacidadeVLibras: normalizarOpacidadeVLibras(armazenada.opacidadeVLibras),
    revisaoVLibras: typeof armazenada.revisaoVLibras === 'number' ? armazenada.revisaoVLibras : 0,
  };
};

const ConfiguracoesContext = createContext<ConfiguracoesContexto | undefined>(undefined);

export const useConfiguracoes = (): ConfiguracoesContexto => {
  const contexto = useContext(ConfiguracoesContext);
  if (!contexto) {
    throw new Error('useConfiguracoes deve ser usado dentro de ConfiguracoesProvider');
  }
  return contexto;
};

export const ConfiguracoesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Configuracoes>(configPadrao);
  const [configuracoesCarregadas, setConfiguracoesCarregadas] = useState(false);

  // Carregar configurações salvas
  useEffect(() => {
    const carregar = async () => {
      try {
        const armazenado = await AsyncStorage.getItem(CHAVE_CONFIG);
        if (armazenado) {
          setConfig(mesclarConfiguracoes(JSON.parse(armazenado)));
        }
      } catch (e) {
        console.error('Erro ao carregar configurações:', e);
      } finally {
        setConfiguracoesCarregadas(true);
      }
    };
    carregar();
  }, []);

  const salvarConfig = async (novaConfig: Configuracoes) => {
    try {
      await AsyncStorage.setItem(CHAVE_CONFIG, JSON.stringify(novaConfig));
      setConfig(novaConfig);
    } catch (e) {
      console.error('Erro ao salvar configurações:', e);
    }
  };

  const setTemaEscuro = (valor: boolean) => {
    salvarConfig({ ...config, temaEscuro: valor });
  };

  const setTamanhoFonte = (valor: TamanhoFonte) => {
    salvarConfig({ ...config, tamanhoFonte: valor });
  };

  const setVelocidadeAvatar = (valor: VelocidadeAvatar) => {
    salvarConfig({ ...config, velocidadeAvatar: valor });
  };

  const setSincronizacaoAtivada = (valor: boolean) => {
    salvarConfig({ ...config, sincronizacaoAtivada: valor });
  };

  const setPersonalizacaoVLibras = (valor: PersonalizacaoVLibras) => {
    salvarConfig({
      ...config,
      personalizacaoVLibras: normalizarPersonalizacaoVLibras(valor),
      revisaoVLibras: config.revisaoVLibras + 1,
    });
  };

  const setAvatarVLibras = (valor: AvatarVLibras) => {
    salvarConfig({
      ...config,
      avatarVLibras: normalizarAvatarVLibras(valor),
      revisaoVLibras: config.revisaoVLibras + 1,
    });
  };

  const setOpacidadeVLibras = (valor: OpacidadeVLibras) => {
    salvarConfig({
      ...config,
      opacidadeVLibras: normalizarOpacidadeVLibras(valor),
      revisaoVLibras: config.revisaoVLibras + 1,
    });
  };

  const salvarPersonalizacaoVLibras = (
    personalizacao: PersonalizacaoVLibras,
    opacidade: OpacidadeVLibras,
    avatar?: AvatarVLibras
  ) => {
    salvarConfig({
      ...config,
      personalizacaoVLibras: normalizarPersonalizacaoVLibras(personalizacao),
      opacidadeVLibras: normalizarOpacidadeVLibras(opacidade),
      avatarVLibras: avatar ? normalizarAvatarVLibras(avatar) : config.avatarVLibras,
      revisaoVLibras: config.revisaoVLibras + 1,
    });
  };

  const resetPersonalizacaoVLibras = () => {
    salvarConfig({
      ...config,
      personalizacaoVLibras: personalizacaoVLibrasPadrao,
      avatarVLibras: configPadrao.avatarVLibras,
      opacidadeVLibras: configPadrao.opacidadeVLibras,
      revisaoVLibras: config.revisaoVLibras + 1,
    });
  };

  return (
    <ConfiguracoesContext.Provider
      value={{
        config,
        configuracoesCarregadas,
        setTemaEscuro,
        setTamanhoFonte,
        setVelocidadeAvatar,
        setSincronizacaoAtivada,
        setPersonalizacaoVLibras,
        setAvatarVLibras,
        setOpacidadeVLibras,
        salvarPersonalizacaoVLibras,
        resetPersonalizacaoVLibras,
      }}
    >
      {children}
    </ConfiguracoesContext.Provider>
  );
};
