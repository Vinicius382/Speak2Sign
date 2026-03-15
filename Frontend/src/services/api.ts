import axios from 'axios';

const api = axios.create({
  baseURL: 'https://speak2sign.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

interface LoginPayload {
  email: string;
  senha: string;
}

interface CadastroPayload {
  nome: string;
  email: string;
  senha: string;
}

interface UsuarioResposta {
  id: number;
  nome: string;
  email: string;
}

export const loginUsuario = async (payload: LoginPayload): Promise<UsuarioResposta> => {
  const resposta = await api.post<UsuarioResposta>('/api/usuarios/login', payload);
  return resposta.data;
};

export const cadastrarUsuario = async (payload: CadastroPayload): Promise<UsuarioResposta> => {
  const resposta = await api.post<UsuarioResposta>('/api/usuarios/cadastrar', payload);
  return resposta.data;
};

export default api;
