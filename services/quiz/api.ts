import { Alert } from 'react-native';
import { Quiz, RespostaUsuario } from './type';

const API_BASE = 'http://localhost:5000/api/v1/quizzes';

export async function buscarQuiz(quizId: string): Promise<Quiz> {
  try {
    const response = await fetch(`${API_BASE}/buscarQuiz/${quizId}`);

    if (!response.ok) {
      throw new Error('Quiz não encontrado');
    }

    return await response.json();
  } catch (error) {
    Alert.alert('Erro', 'Falha ao carregar quiz');
    throw error;
  }
}

export async function submeterRespostas(
  quizId: string,
  respostas: RespostaUsuario[]
): Promise<{ pontuacao: number; total: number }> {
  try {
    const response = await fetch(`${API_BASE}/responder/${quizId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ respostas }),
    });

    if (!response.ok) {
      throw new Error('Erro ao enviar respostas');
    }

    return await response.json();
  } catch (error) {
    Alert.alert('Erro', 'Falha ao enviar respostas');
    throw error;
  }
}
