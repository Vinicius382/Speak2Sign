import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { configurarTokenAutenticacao, type LoginResposta } from '../services/api';

export interface UsuarioLogado {
  id: number;
  nome: string;
  email: string;
}

interface AuthContexto {
  usuario: UsuarioLogado | null;
  token: string | null;
  carregandoSessao: boolean;
  salvarSessao: (resposta: LoginResposta) => Promise<void>;
  limparSessao: () => Promise<void>;
  atualizarNome: (novoNome: string) => Promise<void>;
}

const CHAVE_USUARIO = '@speak2sign_usuario';
const CHAVE_TOKEN = '@speak2sign_token';

const AuthContext = createContext<AuthContexto | undefined>(undefined);

export const useAuth = (): AuthContexto => {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return contexto;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);

  // Carregar sessão salva ao iniciar
  useEffect(() => {
    const carregar = async () => {
      try {
        const [usuarioArmazenado, tokenArmazenado] = await Promise.all([
          AsyncStorage.getItem(CHAVE_USUARIO),
          AsyncStorage.getItem(CHAVE_TOKEN),
        ]);

        if (usuarioArmazenado && tokenArmazenado) {
          const usuarioSalvo = JSON.parse(usuarioArmazenado);
          setUsuario(usuarioSalvo);
          setToken(tokenArmazenado);
          configurarTokenAutenticacao(tokenArmazenado);
        } else {
          await AsyncStorage.multiRemove([CHAVE_USUARIO, CHAVE_TOKEN]);
          configurarTokenAutenticacao(null);
        }
      } catch (e) {
        console.error('Erro ao carregar sessão:', e);
        await AsyncStorage.multiRemove([CHAVE_USUARIO, CHAVE_TOKEN]);
        configurarTokenAutenticacao(null);
      } finally {
        setCarregandoSessao(false);
      }
    };
    carregar();
  }, []);

  const salvarSessao = async (resposta: LoginResposta) => {
    try {
      await AsyncStorage.multiSet([
        [CHAVE_USUARIO, JSON.stringify(resposta.usuario)],
        [CHAVE_TOKEN, resposta.token],
      ]);
      setUsuario(resposta.usuario);
      setToken(resposta.token);
      configurarTokenAutenticacao(resposta.token);
    } catch (e) {
      console.error('Erro ao salvar sessão:', e);
    }
  };

  const limparSessao = async () => {
    try {
      await AsyncStorage.multiRemove([CHAVE_USUARIO, CHAVE_TOKEN]);
      setUsuario(null);
      setToken(null);
      configurarTokenAutenticacao(null);
    } catch (e) {
      console.error('Erro ao limpar sessão:', e);
    }
  };

  const atualizarNome = async (novoNome: string) => {
    if (!usuario) return;
    try {
      const atualizado = { ...usuario, nome: novoNome };
      await AsyncStorage.setItem(CHAVE_USUARIO, JSON.stringify(atualizado));
      setUsuario(atualizado);
    } catch (e) {
      console.error('Erro ao atualizar nome:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, token, carregandoSessao, salvarSessao, limparSessao, atualizarNome }}>
      {children}
    </AuthContext.Provider>
  );
};
