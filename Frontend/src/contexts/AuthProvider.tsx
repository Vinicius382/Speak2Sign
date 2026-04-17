import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UsuarioLogado {
  id: number;
  nome: string;
  email: string;
}

interface AuthContexto {
  usuario: UsuarioLogado | null;
  salvarUsuario: (usuario: UsuarioLogado) => Promise<void>;
  limparUsuario: () => Promise<void>;
}

const CHAVE_USUARIO = '@speak2sign_usuario';

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

  // Carregar usuário salvo ao iniciar
  useEffect(() => {
    const carregar = async () => {
      try {
        const armazenado = await AsyncStorage.getItem(CHAVE_USUARIO);
        if (armazenado) {
          setUsuario(JSON.parse(armazenado));
        }
      } catch (e) {
        console.error('Erro ao carregar usuário:', e);
      }
    };
    carregar();
  }, []);

  const salvarUsuario = async (novoUsuario: UsuarioLogado) => {
    try {
      await AsyncStorage.setItem(CHAVE_USUARIO, JSON.stringify(novoUsuario));
      setUsuario(novoUsuario);
    } catch (e) {
      console.error('Erro ao salvar usuário:', e);
    }
  };

  const limparUsuario = async () => {
    try {
      await AsyncStorage.removeItem(CHAVE_USUARIO);
      setUsuario(null);
    } catch (e) {
      console.error('Erro ao limpar usuário:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, salvarUsuario, limparUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};
