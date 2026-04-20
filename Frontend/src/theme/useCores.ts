import { useConfiguracoes } from '../contexts/ConfiguracoesProvider';
import { coresClaro, coresEscuro, Cores } from './cores';

export const useCores = (): { cores: Cores; estaEscuro: boolean; fatorFonte: number } => {
  const { config } = useConfiguracoes();
  
  const estaEscuro = config.temaEscuro;
  const cores = estaEscuro ? coresEscuro : coresClaro;

  let fatorFonte = 1;
  if (config.tamanhoFonte === 'pequeno') {
    fatorFonte = 0.85;
  } else if (config.tamanhoFonte === 'grande') {
    fatorFonte = 1.15;
  }

  return { cores, estaEscuro, fatorFonte };
};
