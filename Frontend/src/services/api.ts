import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_TOKEN = '@speak2sign_token';
let tokenAutenticacao: string | null = null;

const api = axios.create({
  baseURL: 'https://speak2sign.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const configurarTokenAutenticacao = (token: string | null) => {
  tokenAutenticacao = token;

  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

api.interceptors.request.use(async (config) => {
  if (!tokenAutenticacao) {
    tokenAutenticacao = await AsyncStorage.getItem(CHAVE_TOKEN);
  }

  if (tokenAutenticacao) {
    config.headers.Authorization = `Bearer ${tokenAutenticacao}`;
  }

  return config;
});

// === Tipos ===

interface LoginPayload {
  email: string;
  senha: string;
}

interface CadastroPayload {
  nome: string;
  email: string;
  senha: string;
}

interface EsqueciSenhaPayload {
  email: string;
}

interface RedefinirSenhaPayload {
  email: string;
  token: string;
  novaSenha: string;
}

interface AtualizarPerfilPayload {
  nome: string;
}

interface AlterarSenhaPayload {
  senhaAtual: string;
  novaSenha: string;
}

export interface UsuarioResposta {
  id: number;
  nome: string;
  email: string;
}

export interface LoginResposta {
  token: string;
  usuario: UsuarioResposta;
}

interface MensagemResposta {
  mensagem: string;
}

interface ErroApiResposta {
  mensagem?: string;
  message?: string;
}

interface HistoricoPayload {
  tipo: string;
  texto: string;
}

interface HistoricoResposta {
  id: number;
  tipo: string;
  texto: string;
  dataCriacao: string;
}

interface FavoritoPayload {
  tipo: string;
  texto: string;
}

interface FavoritoResposta {
  id: number;
  tipo: string;
  texto: string;
  dataCriacao: string;
}

// === Autenticação ===

export const loginUsuario = async (payload: LoginPayload): Promise<LoginResposta> => {
  const resposta = await api.post<LoginResposta>('/api/usuarios/login', payload);
  return resposta.data;
};

export const cadastrarUsuario = async (payload: CadastroPayload): Promise<UsuarioResposta> => {
  const resposta = await api.post<UsuarioResposta>('/api/usuarios/cadastrar', payload);
  return resposta.data;
};

export const solicitarRedefinicaoSenha = async (payload: EsqueciSenhaPayload): Promise<MensagemResposta> => {
  const resposta = await api.post<MensagemResposta>('/api/usuarios/esqueci-senha', payload, { timeout: 30000 });
  return resposta.data;
};

export const redefinirSenha = async (payload: RedefinirSenhaPayload): Promise<MensagemResposta> => {
  const resposta = await api.post<MensagemResposta>('/api/usuarios/redefinir-senha', payload);
  return resposta.data;
};

// === Histórico ===

export const listarHistorico = async (): Promise<HistoricoResposta[]> => {
  const resposta = await api.get<HistoricoResposta[]>('/api/usuario/historico');
  return resposta.data;
};

export const adicionarHistoricoApi = async (payload: HistoricoPayload): Promise<HistoricoResposta> => {
  const resposta = await api.post<HistoricoResposta>('/api/usuario/historico', payload);
  return resposta.data;
};

export const removerHistoricoApi = async (itemId: number): Promise<MensagemResposta> => {
  const resposta = await api.delete<MensagemResposta>(`/api/usuario/historico/${itemId}`);
  return resposta.data;
};

export const limparHistoricoApi = async (): Promise<MensagemResposta> => {
  const resposta = await api.delete<MensagemResposta>('/api/usuario/historico');
  return resposta.data;
};

// === Favoritos ===

export const listarFavoritos = async (): Promise<FavoritoResposta[]> => {
  const resposta = await api.get<FavoritoResposta[]>('/api/usuario/favoritos');
  return resposta.data;
};

export const adicionarFavoritoApi = async (payload: FavoritoPayload): Promise<FavoritoResposta> => {
  const resposta = await api.post<FavoritoResposta>('/api/usuario/favoritos', payload);
  return resposta.data;
};

export const removerFavoritoApi = async (itemId: number): Promise<MensagemResposta> => {
  const resposta = await api.delete<MensagemResposta>(`/api/usuario/favoritos/${itemId}`);
  return resposta.data;
};

// === Perfil ===

export const atualizarPerfil = async (payload: AtualizarPerfilPayload): Promise<UsuarioResposta> => {
  const resposta = await api.put<UsuarioResposta>('/api/usuario/perfil', payload);
  return resposta.data;
};

export const alterarSenhaApi = async (payload: AlterarSenhaPayload): Promise<MensagemResposta> => {
  const resposta = await api.put<MensagemResposta>('/api/usuario/senha', payload);
  return resposta.data;
};

export const extrairMensagemErroApi = (erro: unknown, mensagemPadrao: string): string => {
  const data = (erro as any)?.response?.data as ErroApiResposta | string | undefined;

  if (typeof data === 'string') {
    return data;
  }

  if (data?.mensagem) {
    return data.mensagem;
  }

  if (data?.message) {
    return data.message;
  }

  return mensagemPadrao;
};

export default api;
