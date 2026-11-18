
import React, { useState } from 'react';
import {
  View, Text, TextInput,
  Button, Alert, StyleSheet
} from 'react-native';

import { adicionarTarefa } from '../database/database';

export default function NewTaskScreen({ navigation }: any) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');

  async function salvar() {
    if (!titulo.trim()) {
      Alert.alert('Atenção', 'Digite o título da tarefa.');
      return;
    }

    try {
      await adicionarTarefa(
        titulo.trim(),
        descricao.trim(),
        'Media'
      );

      Alert.alert('Sucesso', 'Tarefa cadastrada!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar.');
    }
  }

  return (
    <View style={styles.container}>
      <Text>Título da tarefa</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Estudar para a prova"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text>Descrição</Text>
      <TextInput
        style={styles.input}
        placeholder="Descreva sua atividade"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      <Button title="Salvar tarefa" onPress={salvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12
  }
});
