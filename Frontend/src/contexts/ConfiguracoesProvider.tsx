import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipos
export type TamanhoFonte = 'pequeno' | 'medio' | 'grande';
export type VelocidadeAvatar = 'lenta' | 'normal' | 'rapida';

export interface Configuracoes {
  temaEscuro: boolean;
  tamanhoFonte: TamanhoFonte;
  velocidadeAvatar: VelocidadeAvatar;
  sincronizacaoAtivada: boolean;
}

interface ConfiguracoesContexto {
  config: Configuracoes;
  setTemaEscuro: (valor: boolean) => void;
  setTamanhoFonte: (valor: TamanhoFonte) => void;
  setVelocidadeAvatar: (valor: VelocidadeAvatar) => void;
  setSincronizacaoAtivada: (valor: boolean) => void;
}

const CHAVE_CONFIG = '@speak2sign_configuracoes';

const configPadrao: Configuracoes = {
  temaEscuro: false,
  tamanhoFonte: 'medio',
  velocidadeAvatar: 'normal',
  sincronizacaoAtivada: true,
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

  // Carregar configurações salvas
  useEffect(() => {
    const carregar = async () => {
      try {
        const armazenado = await AsyncStorage.getItem(CHAVE_CONFIG);
        if (armazenado) {
          setConfig({ ...configPadrao, ...JSON.parse(armazenado) });
        }
      } catch (e) {
        console.error('Erro ao carregar configurações:', e);
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

  return (
    <ConfiguracoesContext.Provider
      value={{
        config,
        setTemaEscuro,
        setTamanhoFonte,
        setVelocidadeAvatar,
        setSincronizacaoAtivada,
      }}
    >
      {children}
    </ConfiguracoesContext.Provider>
  );
};
