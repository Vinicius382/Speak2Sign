import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthProvider';
import { useConfiguracoes } from './ConfiguracoesProvider';
import {
  listarHistorico,
  adicionarHistoricoApi,
  removerHistoricoApi,
  limparHistoricoApi,
  listarFavoritos,
  adicionarFavoritoApi,
  removerFavoritoApi,
} from '../services/api';

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

export type EstatisticasTraducoes = {
  total: number;
  voz: number;
  texto: number;
  libras: number;
};

interface HistoricoFavoritosContexto {
  historico: ItemHistorico[];
  favoritos: ItemFavorito[];
  estatisticasHistorico: EstatisticasTraducoes;
  estatisticasFavoritos: EstatisticasTraducoes;
  textosFavoritos: ReadonlySet<string>;
  adicionarAoHistorico: (texto: string, tipo: TipoTraducao) => void;
  removerDoHistorico: (id: string) => void;
  limparHistorico: () => void;
  limparDadosLocais: () => Promise<void>;
  adicionarFavorito: (texto: string, tipo: TipoTraducao) => void;
  removerFavorito: (id: string) => void;
  alternarFavorito: (texto: string, tipo: TipoTraducao) => void;
  ehFavorito: (texto: string) => boolean;
}

const CHAVE_FAVORITOS = '@speak2sign_favoritos';
const CHAVE_HISTORICO = '@speak2sign_historico';

const HistoricoFavoritosContext = createContext<HistoricoFavoritosContexto | undefined>(undefined);

export const useHistoricoFavoritos = (): HistoricoFavoritosContexto => {
  const contexto = useContext(HistoricoFavoritosContext);
  if (!contexto) {
    throw new Error('useHistoricoFavoritos deve ser usado dentro de HistoricoFavoritosProvider');
  }
  return contexto;
};

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

const chaveHistorico = (item: Pick<ItemHistorico, 'tipo' | 'texto' | 'data'>): string =>
  `${item.tipo}:${item.texto}:${item.data}`;

const chaveFavorito = (item: Pick<ItemFavorito, 'tipo' | 'texto'>): string =>
  `${item.tipo}:${item.texto}`;

const criarEstatisticasVazias = (): EstatisticasTraducoes => ({
  total: 0,
  voz: 0,
  texto: 0,
  libras: 0,
});

const calcularEstatisticas = (itens: Array<Pick<ItemHistorico, 'tipo'>>): EstatisticasTraducoes => {
  return itens.reduce<EstatisticasTraducoes>((estatisticas, item) => {
    estatisticas.total += 1;
    estatisticas[item.tipo] += 1;
    return estatisticas;
  }, criarEstatisticasVazias());
};

export const HistoricoFavoritosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [historico, setHistorico] = useState<ItemHistorico[]>([]);
  const [favoritos, setFavoritos] = useState<ItemFavorito[]>([]);
  const { usuario } = useAuth();
  const { config } = useConfiguracoes();
  const sincronizouRef = useRef(false);

  const estatisticasHistorico = useMemo(() => calcularEstatisticas(historico), [historico]);
  const estatisticasFavoritos = useMemo(() => calcularEstatisticas(favoritos), [favoritos]);
  const textosFavoritos = useMemo<ReadonlySet<string>>(
    () => new Set(favoritos.map((favorito) => favorito.texto)),
    [favoritos]
  );

  useEffect(() => {
    carregarDadosLocais();
  }, []);

  // Sincronizar com backend quando o usuário está logado e a sincronização está ativa
  useEffect(() => {
    if (usuario && config.sincronizacaoAtivada && !sincronizouRef.current) {
      sincronizouRef.current = true;
      sincronizarComBackend();
    }
    if (!usuario || !config.sincronizacaoAtivada) {
      sincronizouRef.current = false;
    }
  }, [usuario, config.sincronizacaoAtivada]);

  const podeSincronizar = useCallback(() => {
    return Boolean(usuario && config.sincronizacaoAtivada);
  }, [usuario, config.sincronizacaoAtivada]);

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
    if (!usuario || !config.sincronizacaoAtivada) return;

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

      // Mesclar histórico sem eliminar repetições legítimas do mesmo texto.
      setHistorico((prev) => {
        const idsRemotos = new Set(historicoConvertido.map((h) => h.idRemoto));
        const chavesRemotas = new Set(historicoConvertido.map((h) => chaveHistorico(h)));
        const locaisPendentes = prev.filter(
          (item) => !item.idRemoto && !chavesRemotas.has(chaveHistorico(item))
        );
        const locaisSincronizadosAusentes = prev.filter(
          (item) => item.idRemoto && !idsRemotos.has(item.idRemoto)
        );

        locaisPendentes.forEach((item) => {
          adicionarHistoricoApi(usuario.id, { tipo: item.tipo, texto: item.texto })
            .then((resposta) => {
              atualizarHistoricoLocal((atuais) =>
                atuais.map((atual) =>
                  atual.id === item.id ? { ...atual, idRemoto: resposta.id } : atual
                )
              );
            })
            .catch(console.error);
        });

        const mesclado = [...locaisPendentes, ...locaisSincronizadosAusentes, ...historicoConvertido];
        AsyncStorage.setItem(CHAVE_HISTORICO, JSON.stringify(mesclado)).catch(console.error);
        return mesclado;
      });

      setFavoritos((prev) => {
        const idsRemotos = new Set(favoritosConvertidos.map((f) => f.idRemoto));
        const chavesRemotas = new Set(favoritosConvertidos.map((f) => chaveFavorito(f)));
        const locaisPendentes = prev.filter(
          (item) => !item.idRemoto && !chavesRemotas.has(chaveFavorito(item))
        );
        const locaisSincronizadosAusentes = prev.filter(
          (item) => item.idRemoto && !idsRemotos.has(item.idRemoto)
        );

        locaisPendentes.forEach((item) => {
          adicionarFavoritoApi(usuario.id, { tipo: item.tipo, texto: item.texto })
            .then((resposta) => {
              atualizarFavoritosLocal((atuais) =>
                atuais.map((atual) =>
                  atual.id === item.id ? { ...atual, idRemoto: resposta.id } : atual
                )
              );
            })
            .catch(console.error);
        });

        const mesclado = [...locaisPendentes, ...locaisSincronizadosAusentes, ...favoritosConvertidos];
        AsyncStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(mesclado)).catch(console.error);
        return mesclado;
      });
    } catch (e) {
      console.error('Erro ao sincronizar com backend:', e);
      // Falha silenciosa — mantém dados locais
    }
  };

  const atualizarHistoricoLocal = useCallback((atualizador: (prev: ItemHistorico[]) => ItemHistorico[]) => {
    setHistorico((prev) => {
      const atualizado = atualizador(prev);
      AsyncStorage.setItem(CHAVE_HISTORICO, JSON.stringify(atualizado)).catch(console.error);
      return atualizado;
    });
  }, []);

  const atualizarFavoritosLocal = useCallback((atualizador: (prev: ItemFavorito[]) => ItemFavorito[]) => {
    setFavoritos((prev) => {
      const atualizado = atualizador(prev);
      AsyncStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(atualizado)).catch(console.error);
      return atualizado;
    });
  }, []);

  // === HISTÓRICO ===

  const adicionarAoHistorico = useCallback((texto: string, tipo: TipoTraducao) => {
    const novoItem: ItemHistorico = {
      id: Date.now().toString(),
      tipo,
      texto,
      data: formatarData(),
    };

    atualizarHistoricoLocal((prev) => [novoItem, ...prev]);

    if (usuario && podeSincronizar()) {
      adicionarHistoricoApi(usuario.id, { tipo, texto })
        .then((resposta) => {
          atualizarHistoricoLocal((prev) =>
            prev.map((item) =>
              item.id === novoItem.id ? { ...item, idRemoto: resposta.id } : item
            )
          );
        })
        .catch(console.error);
    }
  }, [atualizarHistoricoLocal, podeSincronizar, usuario]);

  const removerDoHistorico = useCallback((id: string) => {
    const item = historico.find((h) => h.id === id);
    if (!item) return;

    if (!usuario || !podeSincronizar() || !item.idRemoto) {
      atualizarHistoricoLocal((prev) => prev.filter((h) => h.id !== id));
      return;
    }

    removerHistoricoApi(usuario.id, item.idRemoto)
      .then(() => {
        atualizarHistoricoLocal((prev) => prev.filter((h) => h.id !== id));
      })
      .catch(console.error);
  }, [atualizarHistoricoLocal, historico, podeSincronizar, usuario]);

  const limparTodoHistorico = useCallback(() => {
    if (!usuario || !podeSincronizar()) {
      atualizarHistoricoLocal(() => []);
      return;
    }

    limparHistoricoApi(usuario.id)
      .then(() => {
        atualizarHistoricoLocal(() => []);
      })
      .catch(console.error);
  }, [atualizarHistoricoLocal, podeSincronizar, usuario]);

  // === FAVORITOS ===

  const adicionarFavorito = useCallback((texto: string, tipo: TipoTraducao) => {
    const novoFavorito: ItemFavorito = {
      id: Date.now().toString(),
      tipo,
      texto,
      data: formatarData(),
    };

    atualizarFavoritosLocal((prev) => {
      const semDuplicado = prev.filter((item) => chaveFavorito(item) !== chaveFavorito(novoFavorito));
      return [novoFavorito, ...semDuplicado];
    });

    if (usuario && podeSincronizar()) {
      adicionarFavoritoApi(usuario.id, { tipo, texto })
        .then((resposta) => {
          atualizarFavoritosLocal((prev) =>
            prev.map((item) =>
              item.id === novoFavorito.id ? { ...item, idRemoto: resposta.id } : item
            )
          );
        })
        .catch(console.error);
    }
  }, [atualizarFavoritosLocal, podeSincronizar, usuario]);

  const removerFavorito = useCallback((id: string) => {
    const item = favoritos.find((f) => f.id === id);
    if (!item) return;

    if (!usuario || !podeSincronizar() || !item.idRemoto) {
      atualizarFavoritosLocal((prev) => prev.filter((f) => f.id !== id));
      return;
    }

    removerFavoritoApi(usuario.id, item.idRemoto)
      .then(() => {
        atualizarFavoritosLocal((prev) => prev.filter((f) => f.id !== id));
      })
      .catch(console.error);
  }, [atualizarFavoritosLocal, favoritos, podeSincronizar, usuario]);

  const limparDadosLocais = useCallback(async () => {
    await AsyncStorage.multiRemove([CHAVE_HISTORICO, CHAVE_FAVORITOS]);
    setHistorico([]);
    setFavoritos([]);
  }, []);

  const ehFavorito = useCallback((texto: string): boolean => {
    return textosFavoritos.has(texto);
  }, [textosFavoritos]);

  const alternarFavorito = useCallback((texto: string, tipo: TipoTraducao) => {
    if (textosFavoritos.has(texto)) {
      const existente = favoritos.find((f) => f.texto === texto);
      if (!existente) return;
      removerFavorito(existente.id);
    } else {
      adicionarFavorito(texto, tipo);
    }
  }, [favoritos, textosFavoritos, removerFavorito, adicionarFavorito]);

  const valorContexto = useMemo(() => ({
    historico,
    favoritos,
    estatisticasHistorico,
    estatisticasFavoritos,
    textosFavoritos,
    adicionarAoHistorico,
    removerDoHistorico,
    limparHistorico: limparTodoHistorico,
    limparDadosLocais,
    adicionarFavorito,
    removerFavorito,
    alternarFavorito,
    ehFavorito,
  }), [
    historico,
    favoritos,
    estatisticasHistorico,
    estatisticasFavoritos,
    textosFavoritos,
    adicionarAoHistorico,
    removerDoHistorico,
    limparTodoHistorico,
    limparDadosLocais,
    adicionarFavorito,
    removerFavorito,
    alternarFavorito,
    ehFavorito,
  ]);

  return (
    <HistoricoFavoritosContext.Provider
      value={valorContexto}
    >
      {children}
    </HistoricoFavoritosContext.Provider>
  );
};
