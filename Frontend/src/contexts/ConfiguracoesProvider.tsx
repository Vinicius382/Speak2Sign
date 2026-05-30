import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipos
export type TamanhoFonte = 'pequeno' | 'medio' | 'grande';
export type VelocidadeAvatar = 'lenta' | 'normal' | 'rapida';
export type AvatarVLibras = 'icaro' | 'hosana' | 'guga' | 'random';

export interface Configuracoes {
  temaEscuro: boolean;
  tamanhoFonte: TamanhoFonte;
  velocidadeAvatar: VelocidadeAvatar;
  sincronizacaoAtivada: boolean;
  avatarVLibras: AvatarVLibras;
  revisaoVLibras: number;
}

interface ConfiguracoesContexto {
  config: Configuracoes;
  configuracoesCarregadas: boolean;
  setTemaEscuro: (valor: boolean) => void;
  setTamanhoFonte: (valor: TamanhoFonte) => void;
  setVelocidadeAvatar: (valor: VelocidadeAvatar) => void;
  setSincronizacaoAtivada: (valor: boolean) => void;
  setAvatarVLibras: (valor: AvatarVLibras) => void;
}

const CHAVE_CONFIG = '@speak2sign_configuracoes';

const configPadrao: Configuracoes = {
  temaEscuro: false,
  tamanhoFonte: 'medio',
  velocidadeAvatar: 'normal',
  sincronizacaoAtivada: true,
  avatarVLibras: 'icaro',
  revisaoVLibras: 0,
};

const AVATARES_VLIBRAS: AvatarVLibras[] = ['icaro', 'hosana', 'guga', 'random'];

const normalizarAvatarVLibras = (valor: unknown): AvatarVLibras => {
  if (typeof valor === 'string' && AVATARES_VLIBRAS.includes(valor as AvatarVLibras)) {
    return valor as AvatarVLibras;
  }

  return configPadrao.avatarVLibras;
};

const mesclarConfiguracoes = (valor: unknown): Configuracoes => {
  if (!valor || typeof valor !== 'object') {
    return configPadrao;
  }

  const armazenada = valor as Partial<Configuracoes>;

  return {
    temaEscuro: typeof armazenada.temaEscuro === 'boolean' ? armazenada.temaEscuro : configPadrao.temaEscuro,
    tamanhoFonte: armazenada.tamanhoFonte || configPadrao.tamanhoFonte,
    velocidadeAvatar: armazenada.velocidadeAvatar || configPadrao.velocidadeAvatar,
    sincronizacaoAtivada:
      typeof armazenada.sincronizacaoAtivada === 'boolean'
        ? armazenada.sincronizacaoAtivada
        : configPadrao.sincronizacaoAtivada,
    avatarVLibras: normalizarAvatarVLibras(armazenada.avatarVLibras),
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

  const setAvatarVLibras = (valor: AvatarVLibras) => {
    salvarConfig({
      ...config,
      avatarVLibras: normalizarAvatarVLibras(valor),
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
        setAvatarVLibras,
      }}
    >
      {children}
    </ConfiguracoesContext.Provider>
  );
};
