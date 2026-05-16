import { MaterialCommunityIcons } from '@expo/vector-icons';

export type NomeIconeDicionario = keyof typeof MaterialCommunityIcons.glyphMap;

export type CategoriaDicionarioId =
  | 'saudacoes'
  | 'sentimentos'
  | 'transporte'
  | 'esportes-lazer'
  | 'casa-moveis'
  | 'escola-tecnologia'
  | 'vestuario'
  | 'alimentos-bebidas'
  | 'animais';

export type PalavraDicionario = {
  id: string;
  texto: string;
  icone: NomeIconeDicionario;
};

export type CategoriaDicionario = {
  id: CategoriaDicionarioId;
  titulo: string;
  itens: PalavraDicionario[];
};

export const categoriasDicionario: CategoriaDicionario[] = [
  {
    id: 'saudacoes',
    titulo: 'Saudações',
    itens: [
      { id: 'oi', texto: 'Oi', icone: 'hand-wave' },
      { id: 'bom-dia', texto: 'Bom dia', icone: 'weather-sunny' },
      { id: 'boa-tarde', texto: 'Boa tarde', icone: 'weather-sunset' },
      { id: 'boa-noite', texto: 'Boa noite', icone: 'weather-night' },
      { id: 'tudo-bem', texto: 'Tudo bem?', icone: 'thumb-up-outline' },
      { id: 'obrigado', texto: 'Obrigado', icone: 'hand-heart-outline' },
      { id: 'desculpa', texto: 'Desculpa', icone: 'emoticon-sad-outline' },
      { id: 'com-licenca', texto: 'Com licença', icone: 'account-arrow-right-outline' },
      { id: 'tchau', texto: 'Tchau', icone: 'hand-wave-outline' },
    ],
  },
  {
    id: 'sentimentos',
    titulo: 'Sentimentos',
    itens: [
      { id: 'feliz', texto: 'Feliz', icone: 'emoticon-happy-outline' },
      { id: 'triste', texto: 'Triste', icone: 'emoticon-sad-outline' },
      { id: 'bravo', texto: 'Bravo', icone: 'emoticon-angry-outline' },
      { id: 'cansado', texto: 'Cansado', icone: 'sleep' },
      { id: 'doente', texto: 'Doente', icone: 'thermometer' },
      { id: 'com-fome', texto: 'Com fome', icone: 'silverware-fork-knife' },
      { id: 'com-sede', texto: 'Com sede', icone: 'cup-water' },
      { id: 'medo', texto: 'Medo', icone: 'alert-circle-outline' },
    ],
  },
  {
    id: 'transporte',
    titulo: 'Transporte',
    itens: [
      { id: 'carro', texto: 'Carro', icone: 'car' },
      { id: 'onibus', texto: 'Ônibus', icone: 'bus' },
      { id: 'moto', texto: 'Moto', icone: 'motorbike' },
      { id: 'bicicleta', texto: 'Bicicleta', icone: 'bicycle' },
      { id: 'aviao', texto: 'Avião', icone: 'airplane' },
      { id: 'trem', texto: 'Trem', icone: 'train' },
      { id: 'caminhao', texto: 'Caminhão', icone: 'truck' },
    ],
  },
  {
    id: 'esportes-lazer',
    titulo: 'Esportes e Lazer',
    itens: [
      { id: 'bola', texto: 'Bola', icone: 'soccer' },
      { id: 'jogo', texto: 'Jogo', icone: 'gamepad-variant' },
      { id: 'brinquedo', texto: 'Brinquedo', icone: 'toy-brick-outline' },
      { id: 'piscina', texto: 'Piscina', icone: 'pool' },
      { id: 'boneca', texto: 'Boneca', icone: 'teddy-bear' },
      { id: 'videogame', texto: 'Videogame', icone: 'controller-classic-outline' },
    ],
  },
  {
    id: 'casa-moveis',
    titulo: 'Casa e Móveis',
    itens: [
      { id: 'cama', texto: 'Cama', icone: 'bed' },
      { id: 'mesa', texto: 'Mesa', icone: 'table-furniture' },
      { id: 'cadeira', texto: 'Cadeira', icone: 'chair-rolling' },
      { id: 'sofa', texto: 'Sofá', icone: 'sofa' },
      { id: 'televisao', texto: 'Televisão', icone: 'television' },
      { id: 'geladeira', texto: 'Geladeira', icone: 'fridge-outline' },
      { id: 'porta', texto: 'Porta', icone: 'door' },
      { id: 'janela', texto: 'Janela', icone: 'window-closed' },
    ],
  },
  {
    id: 'escola-tecnologia',
    titulo: 'Escola e Tecnologia',
    itens: [
      { id: 'livro', texto: 'Livro', icone: 'book-open' },
      { id: 'caderno', texto: 'Caderno', icone: 'notebook-outline' },
      { id: 'lapis', texto: 'Lápis', icone: 'pencil' },
      { id: 'caneta', texto: 'Caneta', icone: 'pen' },
      { id: 'borracha', texto: 'Borracha', icone: 'eraser' },
      { id: 'mochila', texto: 'Mochila', icone: 'bag-personal-outline' },
      { id: 'computador', texto: 'Computador', icone: 'laptop' },
      { id: 'celular', texto: 'Celular', icone: 'cellphone' },
    ],
  },
  {
    id: 'vestuario',
    titulo: 'Vestuário',
    itens: [
      { id: 'camisa', texto: 'Camisa', icone: 'tshirt-crew-outline' },
      { id: 'calca', texto: 'Calça', icone: 'human-male' },
      { id: 'tenis', texto: 'Tênis', icone: 'shoe-sneaker' },
      { id: 'sapato', texto: 'Sapato', icone: 'shoe-formal' },
      { id: 'chinelo', texto: 'Chinelo', icone: 'shoe-print' },
      { id: 'casaco', texto: 'Casaco', icone: 'hanger' },
      { id: 'oculos', texto: 'Óculos', icone: 'glasses' },
    ],
  },
  {
    id: 'alimentos-bebidas',
    titulo: 'Alimentos e Bebidas',
    itens: [
      { id: 'agua', texto: 'Água', icone: 'water' },
      { id: 'arroz', texto: 'Arroz', icone: 'rice' },
      { id: 'feijao', texto: 'Feijão', icone: 'seed-outline' },
      { id: 'carne', texto: 'Carne', icone: 'food-steak' },
      { id: 'pao', texto: 'Pão', icone: 'bread-slice' },
      { id: 'maca', texto: 'Maçã', icone: 'food-apple' },
      { id: 'banana', texto: 'Banana', icone: 'fruit-pear' },
      { id: 'leite', texto: 'Leite', icone: 'baby-bottle' },
    ],
  },
  {
    id: 'animais',
    titulo: 'Animais',
    itens: [
      { id: 'cachorro', texto: 'Cachorro', icone: 'dog' },
      { id: 'gato', texto: 'Gato', icone: 'cat' },
      { id: 'passaro', texto: 'Pássaro', icone: 'bird' },
      { id: 'peixe', texto: 'Peixe', icone: 'fish' },
      { id: 'cavalo', texto: 'Cavalo', icone: 'horse' },
      { id: 'leao', texto: 'Leão', icone: 'paw' },
      { id: 'vaca', texto: 'Vaca', icone: 'cow' },
    ],
  },
];
