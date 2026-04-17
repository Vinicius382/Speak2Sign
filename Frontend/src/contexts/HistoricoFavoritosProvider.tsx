import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthProvider';
import {
  listarHistorico,
  adicionarHistoricoApi,
  removerHistoricoApi,
  limparHistoricoApi,
  listarFavoritos,
  adicionarFavoritoApi,
  removerFavoritoApi,
} from '../services/api';

// Tipos
export type TipoTraducao = 'voz' | 'texto' | 'libras';

export type ItemHistorico = {
  id: string;
  idRemoto?: number; // ID do backend
  tipo: TipoTraducao;
  texto: string;
  data: string;
};

export type ItemFavorito = {
  id: string;
  idRemoto?: number; // ID do backend
  tipo: TipoTraducao;
  texto: string;
  data: string;
};

// Interface do contexto
interface HistoricoFavoritosContexto {
  historico: ItemHistorico[];
  favoritos: ItemFavorito[];
  adicionarAoHistorico: (texto: string, tipo: TipoTraducao) => void;
  removerDoHistorico: (id: string) => void;
  limparHistorico: () => void;
  adicionarFavorito: (texto: string, tipo: TipoTraducao) => void;
  removerFavorito: (id: string) => void;
  alternarFavorito: (texto: string, tipo: TipoTraducao) => void;
  ehFavorito: (texto: string) => boolean;
}

const CHAVE_FAVORITOS = '@speak2sign_favoritos';
const CHAVE_HISTORICO = '@speak2sign_historico';

const HistoricoFavoritosContext = createContext<HistoricoFavoritosContexto | undefined>(undefined);

// Hook de acesso
export const useHistoricoFavoritos = (): HistoricoFavoritosContexto => {
  const contexto = useContext(HistoricoFavoritosContext);
  if (!contexto) {
    throw new Error('useHistoricoFavoritos deve ser usado dentro de HistoricoFavoritosProvider');
  }
  return contexto;
};

// Formatar data
const formatarData = (): string => {
  return new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatarDataISO = (dataISO: string): string => {
  try {
    return new Date(dataISO).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dataISO;
  }
};

// Provider
export const HistoricoFavoritosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [historico, setHistorico] = useState<ItemHistorico[]>([]);
  const [favoritos, setFavoritos] = useState<ItemFavorito[]>([]);
  const { usuario } = useAuth();
  const sincronizouRef = useRef(false);

  // Carregar dados locais ao iniciar
  useEffect(() => {
    carregarDadosLocais();
  }, []);

  // Sincronizar com backend quando o usuário está logado
  useEffect(() => {
    if (usuario && !sincronizouRef.current) {
      sincronizouRef.current = true;
      sincronizarComBackend();
    }
    if (!usuario) {
      sincronizouRef.current = false;
    }
  }, [usuario]);

  const carregarDadosLocais = async () => {
    try {
      const [historicoArmazenado, favoritosArmazenados] = await Promise.all([
        AsyncStorage.getItem(CHAVE_HISTORICO),
        AsyncStorage.getItem(CHAVE_FAVORITOS),
      ]);
      if (historicoArmazenado) setHistorico(JSON.parse(historicoArmazenado));
      if (favoritosArmazenados) setFavoritos(JSON.parse(favoritosArmazenados));
    } catch (e) {
      console.error('Erro ao carregar dados locais:', e);
    }
  };

  const sincronizarComBackend = async () => {
    if (!usuario) return;

    try {
      // Buscar dados do backend
      const [historicoRemoto, favoritosRemotos] = await Promise.all([
        listarHistorico(usuario.id),
        listarFavoritos(usuario.id),
      ]);

      // Converter para formato local
      const historicoConvertido: ItemHistorico[] = historicoRemoto.map((item) => ({
        id: `remote_${item.id}`,
        idRemoto: item.id,
        tipo: item.tipo as TipoTraducao,
        texto: item.texto,
        data: formatarDataISO(item.dataCriacao),
      }));

      const favoritosConvertidos: ItemFavorito[] = favoritosRemotos.map((item) => ({
        id: `remote_${item.id}`,
        idRemoto: item.id,
        tipo: item.tipo as TipoTraducao,
        texto: item.texto,
        data: formatarDataISO(item.dataCriacao),
      }));

      // Mesclar: manter itens locais que não estão no backend + itens do backend
      setHistorico((prev) => {
        const textosRemotos = new Set(historicoConvertido.map((h) => h.texto));
        const locaisNovos = prev.filter((item) => !item.idRemoto && !textosRemotos.has(item.texto));

        // Enviar itens locais novos ao backend (em background)
        locaisNovos.forEach((item) => {
          adicionarHistoricoApi(usuario.id, { tipo: item.tipo, texto: item.texto }).catch(console.error);
        });

        const mesclado = [...locaisNovos, ...historicoConvertido];
        AsyncStorage.setItem(CHAVE_HISTORICO, JSON.stringify(mesclado)).catch(console.error);
        return mesclado;
      });

      setFavoritos((prev) => {
        const textosRemotos = new Set(favoritosConvertidos.map((f) => f.texto));
        const locaisNovos = prev.filter((item) => !item.idRemoto && !textosRemotos.has(item.texto));

        // Enviar itens locais novos ao backend (em background)
        locaisNovos.forEach((item) => {
          adicionarFavoritoApi(usuario.id, { tipo: item.tipo, texto: item.texto }).catch(console.error);
        });

        const mesclado = [...locaisNovos, ...favoritosConvertidos];
        AsyncStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(mesclado)).catch(console.error);
        return mesclado;
      });
    } catch (e) {
      console.error('Erro ao sincronizar com backend:', e);
      // Falha silenciosa — mantém dados locais
    }
  };

  // === HISTÓRICO ===

  const adicionarAoHistorico = useCallback((texto: string, tipo: TipoTraducao) => {
    const novoItem: ItemHistorico = {
      id: Date.now().toString(),
      tipo,
      texto,
      data: formatarData(),
    };

    setHistorico((prev) => {
      const atualizado = [novoItem, ...prev];
      AsyncStorage.setItem(CHAVE_HISTORICO, JSON.stringify(atualizado)).catch(console.error);
      return atualizado;
    });

    // Enviar ao backend em background
    if (usuario) {
      adicionarHistoricoApi(usuario.id, { tipo, texto }).catch(console.error);
    }
  }, [usuario]);

  const removerDoHistorico = useCallback((id: string) => {
    setHistorico((prev) => {
      const item = prev.find((h) => h.id === id);
      const atualizado = prev.filter((h) => h.id !== id);
      AsyncStorage.setItem(CHAVE_HISTORICO, JSON.stringify(atualizado)).catch(console.error);

      // Remover do backend se tiver ID remoto
      if (usuario && item?.idRemoto) {
        removerHistoricoApi(usuario.id, item.idRemoto).catch(console.error);
      }

      return atualizado;
    });
  }, [usuario]);

  const limparTodoHistorico = useCallback(() => {
    setHistorico([]);
    AsyncStorage.setItem(CHAVE_HISTORICO, JSON.stringify([])).catch(console.error);

    // Limpar no backend
    if (usuario) {
      limparHistoricoApi(usuario.id).catch(console.error);
    }
  }, [usuario]);

  // === FAVORITOS ===

  const adicionarFavorito = useCallback((texto: string, tipo: TipoTraducao) => {
    const novoFavorito: ItemFavorito = {
      id: Date.now().toString(),
      tipo,
      texto,
      data: formatarData(),
    };

    setFavoritos((prev) => {
      const atualizado = [novoFavorito, ...prev];
      AsyncStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(atualizado)).catch(console.error);
      return atualizado;
    });

    // Enviar ao backend em background
    if (usuario) {
      adicionarFavoritoApi(usuario.id, { tipo, texto }).catch(console.error);
    }
  }, [usuario]);

  const removerFavorito = useCallback((id: string) => {
    setFavoritos((prev) => {
      const item = prev.find((f) => f.id === id);
      const atualizado = prev.filter((f) => f.id !== id);
      AsyncStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(atualizado)).catch(console.error);

      // Remover do backend se tiver ID remoto
      if (usuario && item?.idRemoto) {
        removerFavoritoApi(usuario.id, item.idRemoto).catch(console.error);
      }

      return atualizado;
    });
  }, [usuario]);

  const ehFavorito = useCallback((texto: string): boolean => {
    return favoritos.some((f) => f.texto === texto);
  }, [favoritos]);

  const alternarFavorito = useCallback((texto: string, tipo: TipoTraducao) => {
    const existente = favoritos.find((f) => f.texto === texto);
    if (existente) {
      removerFavorito(existente.id);
    } else {
      adicionarFavorito(texto, tipo);
    }
  }, [favoritos, removerFavorito, adicionarFavorito]);

  return (
    <HistoricoFavoritosContext.Provider
      value={{
        historico,
        favoritos,
        adicionarAoHistorico,
        removerDoHistorico,
        limparHistorico: limparTodoHistorico,
        adicionarFavorito,
        removerFavorito,
        alternarFavorito,
        ehFavorito,
      }}
    >
      {children}
    </HistoricoFavoritosContext.Provider>
  );
};
