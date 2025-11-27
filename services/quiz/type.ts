export interface Pergunta {
  id: string;
  enunciado: string;
  opcoes: string[];
  correta?: number;
}

export interface Quiz {
  id: string;
  titulo: string;
  perguntas: Pergunta[];
}

export interface RespostaUsuario {
  perguntaId: string;
  opcaoSelecionada: number;
}
