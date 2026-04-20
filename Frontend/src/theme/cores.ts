export type Cores = {
  fundo: string;
  superficie: string;
  textoPrincipal: string;
  textoSecundario: string;
  textoSuave: string;
  primarioInicio: string;
  primarioFim: string;
  destaque: string;
  iconeTeal: string;
  inputBorda: string;
  inputBordaFocado: string;
  inputFundo: string;
  inputPlaceholder: string;
  erro: string;
  sucesso: string;
  tipoVoz: string;
  tipoTexto: string;
  tipoLibras: string;
  favorito: string;
  sombra: string;
  divisor: string;
  fundoIcone: string;
  seletorFundo: string;
  favoritoFundo: string;
  favoritoAtivoFundo: string;
  erroFundo: string;
  erroBorda: string;
  perigo: string;
  codigoPreenchidoFundo: string;
};

export const coresClaro: Cores = {
  fundo: '#F8F9FA',
  superficie: '#FFFFFF',
  textoPrincipal: '#1A1A2E',
  textoSecundario: '#6C757D',
  textoSuave: '#ADB5BD',
  primarioInicio: '#43A047',
  primarioFim: '#1B5E20',
  destaque: '#2E7D32',
  iconeTeal: '#5BA4A4',
  inputBorda: '#E0E0E0',
  inputBordaFocado: '#2E7D32',
  inputFundo: '#FFFFFF',
  inputPlaceholder: '#ADB5BD',
  erro: '#E74C3C',
  sucesso: '#2ECC71',
  tipoVoz: '#2DD4BF',
  tipoTexto: '#94A3B8',
  tipoLibras: '#6366F1',
  favorito: '#FBBF24',
  sombra: '#000000',
  divisor: '#F0F0F0',
  fundoIcone: '#F0F4F4',
  seletorFundo: '#F0F2F5',
  favoritoFundo: '#F5F5F5',
  favoritoAtivoFundo: '#FFFBEB',
  erroFundo: '#FFF5F5',
  erroBorda: '#FECACA',
  perigo: '#FDECEA',
  codigoPreenchidoFundo: '#F0F8F0',
};

export const coresEscuro: Cores = {
  fundo: '#18191A',
  superficie: '#242526',
  textoPrincipal: '#E4E6EB',
  textoSecundario: '#B0B3B8',
  textoSuave: '#8A8D91',
  primarioInicio: '#43A047',
  primarioFim: '#1B5E20',
  destaque: '#4CAF50',
  iconeTeal: '#6EC6C6',
  inputBorda: '#3A3B3C',
  inputBordaFocado: '#4CAF50',
  inputFundo: '#3A3B3C',
  inputPlaceholder: '#B0B3B8',
  erro: '#EF5350',
  sucesso: '#66BB6A',
  tipoVoz: '#2DD4BF',
  tipoTexto: '#94A3B8',
  tipoLibras: '#818CF8',
  favorito: '#FBBF24',
  sombra: '#000000',
  divisor: '#3A3B3C',
  fundoIcone: '#3A3B3C',
  seletorFundo: '#18191A',
  favoritoFundo: '#3A3B3C',
  favoritoAtivoFundo: '#3D3520',
  erroFundo: '#3D2020',
  erroBorda: '#5C2020',
  perigo: '#3D2020',
  codigoPreenchidoFundo: '#283628',
};

// Mantido temporariamente para compatibilidade com os componentes não atualizados ainda
export const cores = coresClaro;
