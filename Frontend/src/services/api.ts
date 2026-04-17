import axios from 'axios';

const api = axios.create({
  baseURL: 'https://speak2sign.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
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

interface UsuarioResposta {
  id: number;
  nome: string;
  email: string;
}

interface MensagemResposta {
  mensagem: string;
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

export const loginUsuario = async (payload: LoginPayload): Promise<UsuarioResposta> => {
  const resposta = await api.post<UsuarioResposta>('/api/usuarios/login', payload);
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

export const listarHistorico = async (usuarioId: number): Promise<HistoricoResposta[]> => {
  const resposta = await api.get<HistoricoResposta[]>(`/api/usuarios/${usuarioId}/historico`);
  return resposta.data;
};

export const adicionarHistoricoApi = async (usuarioId: number, payload: HistoricoPayload): Promise<HistoricoResposta> => {
  const resposta = await api.post<HistoricoResposta>(`/api/usuarios/${usuarioId}/historico`, payload);
  return resposta.data;
};

export const removerHistoricoApi = async (usuarioId: number, itemId: number): Promise<MensagemResposta> => {
  const resposta = await api.delete<MensagemResposta>(`/api/usuarios/${usuarioId}/historico/${itemId}`);
  return resposta.data;
};

export const limparHistoricoApi = async (usuarioId: number): Promise<MensagemResposta> => {
  const resposta = await api.delete<MensagemResposta>(`/api/usuarios/${usuarioId}/historico`);
  return resposta.data;
};

// === Favoritos ===

export const listarFavoritos = async (usuarioId: number): Promise<FavoritoResposta[]> => {
  const resposta = await api.get<FavoritoResposta[]>(`/api/usuarios/${usuarioId}/favoritos`);
  return resposta.data;
};

export const adicionarFavoritoApi = async (usuarioId: number, payload: FavoritoPayload): Promise<FavoritoResposta> => {
  const resposta = await api.post<FavoritoResposta>(`/api/usuarios/${usuarioId}/favoritos`, payload);
  return resposta.data;
};

export const removerFavoritoApi = async (usuarioId: number, itemId: number): Promise<MensagemResposta> => {
  const resposta = await api.delete<MensagemResposta>(`/api/usuarios/${usuarioId}/favoritos/${itemId}`);
  return resposta.data;
};

export default api;
