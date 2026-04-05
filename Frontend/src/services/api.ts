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

export default api;
