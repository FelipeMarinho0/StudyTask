import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Task } from '../types/Task';

type Props = { tarefa: Task; onToggle: () => void; onEdit: () => void; onDelete: () => void };
export default function TaskCard({ tarefa, onToggle, onEdit, onDelete }: Props) {
  return (
    <View style={styles.card}>
      <Text style={[styles.title, tarefa.concluida && styles.completed]}>{tarefa.titulo}</Text>
      {!!tarefa.descricao && <Text style={styles.description}>{tarefa.descricao}</Text>}
      <Text style={styles.meta}>Prioridade: {tarefa.prioridade} · {tarefa.concluida ? 'Concluída' : 'Pendente'}</Text>
      {!!tarefa.lembreteEm && <Text style={styles.meta}>Lembrete: {new Date(tarefa.lembreteEm).toLocaleString('pt-BR')}</Text>}
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" onPress={onToggle} style={styles.button}><Text style={styles.buttonText}>{tarefa.concluida ? 'Reabrir' : 'Concluir'}</Text></Pressable>
        <Pressable accessibilityRole="button" onPress={onEdit} style={styles.button}><Text style={styles.buttonText}>Editar</Text></Pressable>
        <Pressable accessibilityRole="button" onPress={() => Alert.alert('Excluir tarefa?', tarefa.titulo, [
          { text: 'Cancelar', style: 'cancel' }, { text: 'Excluir', style: 'destructive', onPress: onDelete },
        ])} style={[styles.button, styles.delete]}><Text style={styles.buttonText}>Excluir</Text></Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 12, gap: 8, elevation: 2 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#25253B' },
  completed: { textDecorationLine: 'line-through', color: '#888' },
  description: { color: '#444' },
  meta: { color: '#64647A', fontSize: 13 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 6, flexWrap: 'wrap' },
  button: { backgroundColor: '#6257D7', paddingHorizontal: 13, paddingVertical: 10, borderRadius: 9 },
  delete: { backgroundColor: '#BD3D49' },
  buttonText: { color: 'white', fontWeight: '600' },
});
