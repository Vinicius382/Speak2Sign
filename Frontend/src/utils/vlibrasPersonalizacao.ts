import type { PersonalizacaoVLibras } from '../contexts/ConfiguracoesProvider';
import { API_BASE_URL } from '../services/api';

const CAMPOS_PERSONALIZACAO: (keyof PersonalizacaoVLibras)[] = [
  'calca',
  'camisa',
  'cabelo',
  'corpo',
  'iris',
  'olhos',
  'sobrancelhas',
];

const obterNomeParametroVLibras = (campo: keyof PersonalizacaoVLibras): string => {
  if (campo === 'sobrancelhas') {
    return 'sombrancelhas';
  }

  return campo;
};

export const normalizarHex = (cor: string): string => {
  const semHash = cor.trim().replace(/^#/, '').toUpperCase();

  if (!/^[0-9A-F]{6}$/.test(semHash)) {
    return '#000000';
  }

  return `#${semHash}`;
};

export const montarUrlPersonalizacaoVLibras = (
  personalizacao: PersonalizacaoVLibras
): string => {
  const parametros = new URLSearchParams();

  CAMPOS_PERSONALIZACAO.forEach((campo) => {
    parametros.set(
      obterNomeParametroVLibras(campo),
      normalizarHex(personalizacao[campo]).replace('#', '')
    );
  });

  return `${API_BASE_URL}/api/vlibras/personalizacao?${parametros.toString()}`;
};
