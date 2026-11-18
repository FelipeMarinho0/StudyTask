
import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList,
  Button, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  listarTarefas,
  alternarTarefa,
  excluirTarefa
} from '../database/database';

import { Task } from '../types/Task';

export default function TasksScreen() {
  const [tarefas, setTarefas] = useState<Task[]>([]);

  async function carregar() {
    const resultado = await listarTarefas();
    setTarefas(resultado);
  }

  useFocusEffect(
    useCallback(() => {
      carregar().catch(() =>
        Alert.alert('Erro', 'Não foi possível carregar.')
      );
    }, [])
  );

  async function concluir(id: number) {
    await alternarTarefa(id);
    await carregar();
  }

  async function excluir(id: number) {
    await excluirTarefa(id);
    await carregar();
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={tarefas}
        keyExtractor={item => String(item.id)}
        ListEmptyComponent={
          <Text>Nenhuma tarefa cadastrada.</Text>
        }
        renderItem={({ item }) => (
          <View style={{
            padding: 16,
            marginBottom: 12,
            backgroundColor: '#EEEEEE',
            borderRadius: 10
          }}>
            <Text style={{ fontWeight: 'bold' }}>
              {item.titulo}
            </Text>

            <Text>{item.descricao}</Text>
            <Text>
              {item.concluida ? 'Concluída' : 'Pendente'}
            </Text>

            <Button
              title={item.concluida ? 'Reabrir' : 'Concluir'}
              onPress={() => concluir(item.id)}
            />

            <Button
              title="Excluir"
              color="red"
              onPress={() => excluir(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
}
