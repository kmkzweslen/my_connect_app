import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { buscarQuiz, submeterRespostas } from '../../services/quiz/api';
import { Pergunta, RespostaUsuario } from '../../services/quiz/type';

export default function TelaQuiz() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [quiz, setQuiz] = useState<any>(null);
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostasUsuario, setRespostasUsuario] = useState<{ [key: string]: number }>({});
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (id) {
      carregarQuiz();
    }
  }, [id]);

  async function carregarQuiz() {
    try {
      setCarregando(true);
      const quizData = await buscarQuiz(String(id));
      setQuiz(quizData);
    } catch (error) {
      console.error(error);
    } finally {
      setCarregando(false);
    }
  }

  function selecionarOpcao(indice: number) {
    if (!quiz) return;
    const perguntaId = quiz.perguntas[perguntaAtual].id;
    setRespostasUsuario(prev => ({
      ...prev,
      [perguntaId]: indice,
    }));
  }

  function proximaPergunta() {
    if (!quiz) return;
    if (perguntaAtual < quiz.perguntas.length - 1) {
      setPerguntaAtual(perguntaAtual + 1);
    }
  }

  function anteriorPergunta() {
    if (perguntaAtual > 0) {
      setPerguntaAtual(perguntaAtual - 1);
    }
  }

  async function finalizarQuiz() {
    if (!quiz) return;

    const respostas: RespostaUsuario[] = quiz.perguntas.map((p: Pergunta) => ({
      perguntaId: p.id,
      opcaoSelecionada: respostasUsuario[p.id],
    }));

    const algumaSemResposta = respostas.some(
      r => r.opcaoSelecionada === undefined || r.opcaoSelecionada === null,
    );

    if (algumaSemResposta) {
      Alert.alert('Atenção', 'Responda todas as perguntas antes de finalizar.');
      return;
    }

    try {
      const resultado = await submeterRespostas(String(id), respostas);
      Alert.alert(
        'Quiz Finalizado',
        `Você acertou ${resultado.pontuacao} de ${resultado.total} perguntas.`,
      );
    } catch (error) {
      console.error(error);
    }
  }

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text>Carregando quiz...</Text>
      </View>
    );
  }

  if (!quiz) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text>Quiz não encontrado</Text>
      </View>
    );
  }

  const perguntaAtualObj: Pergunta = quiz.perguntas[perguntaAtual];

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
      {/* Cabeçalho / Navegação de perguntas */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
          {quiz.titulo}
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={anteriorPergunta}
            disabled={perguntaAtual === 0}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: perguntaAtual === 0 ? '#e5e5e5' : '#d4d4d4',
            }}
          >
            <Text>Anterior</Text>
          </TouchableOpacity>

          <Text style={{ fontSize: 16, fontWeight: '600' }}>
            {perguntaAtual + 1} / {quiz.perguntas.length}
          </Text>

          <TouchableOpacity
            onPress={proximaPergunta}
            disabled={perguntaAtual === quiz.perguntas.length - 1}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor:
                perguntaAtual === quiz.perguntas.length - 1 ? '#e5e5e5' : '#d4d4d4',
            }}
          >
            <Text>Próxima</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pergunta e opções */}
      <ScrollView style={{ flex: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 16 }}>
          {perguntaAtualObj.enunciado}
        </Text>

        <View>
          {perguntaAtualObj.opcoes.map((opcao: string, indice: number) => {
            const selecionada = respostasUsuario[perguntaAtualObj.id] === indice;
            return (
              <TouchableOpacity
                key={indice}
                onPress={() => selecionarOpcao(indice)}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: selecionada ? '#2563eb' : '#d4d4d4',
                  backgroundColor: selecionada ? '#dbeafe' : '#f9fafb',
                }}
              >
                <Text style={{ fontSize: 16 }}>{opcao}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Botão Finalizar */}
      <TouchableOpacity
        onPress={finalizarQuiz}
        style={{
          marginTop: 16,
          paddingVertical: 12,
          borderRadius: 8,
          backgroundColor: '#2563eb',
        }}
      >
        <Text
          style={{
            color: '#fff',
            textAlign: 'center',
            fontSize: 18,
            fontWeight: '600',
          }}
        >
          Finalizar Quiz
        </Text>
      </TouchableOpacity>
    </View>
  );
}
