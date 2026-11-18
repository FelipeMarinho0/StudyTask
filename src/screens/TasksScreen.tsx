import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Task } from '../types/Task';
import TaskCard from '../components/TaskCard';
import { useTasks } from '../context/TasksContext';

type Filtro = 'Todas' | 'Pendentes' | 'Concluídas';
export default function TasksScreen({ navigation }: any) {
  const { tarefas, carregando, atualizar, alternar, excluir } = useTasks();
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('Todas');
  useFocusEffect(useCallback(() => { atualizar().catch(console.warn); }, [atualizar]));
  const exibidas = useMemo(() => tarefas.filter(t => {
    const match = `${t.titulo} ${t.descricao}`.toLowerCase().includes(busca.toLowerCase());
    return match && (filtro === 'Todas' || (filtro === 'Pendentes' ? !t.concluida : t.concluida));
  }), [tarefas, busca, filtro]);
  const erro = (e: unknown) => Alert.alert('Erro', e instanceof Error ? e.message : 'Não foi possível concluir a operação.');
  const concluir = async (t: Task) => { try { await alternar(t); } catch (e) { erro(e); } };
  const remover = async (t: Task) => { try { await excluir(t); } catch (e) { erro(e); } };
  return (
    <View style={styles.container}>
      <TextInput value={busca} onChangeText={setBusca} placeholder="Buscar tarefas" style={styles.input} />
      <View style={styles.filters}>
        {(['Todas', 'Pendentes', 'Concluídas'] as Filtro[]).map(f =>
          <Pressable key={f} onPress={() => setFiltro(f)} style={[styles.filter, filtro === f && styles.selected]}>
            <Text style={filtro === f ? styles.white : styles.dark}>{f}</Text>
          </Pressable>
        )}
      </View>
      {carregando ? <ActivityIndicator /> : <FlatList
        data={exibidas}
        keyExtractor={item => String(item.id)}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma tarefa encontrada.</Text>}
        renderItem={({ item }) => <TaskCard
          tarefa={item}
          onToggle={() => concluir(item)}
          onEdit={() => navigation.navigate('NovaTarefa', { id: item.id })}
          onDelete={() => remover(item)}
        />}
      />}
      <Pressable style={styles.add} onPress={() => navigation.navigate('NovaTarefa')}><Text style={styles.white}>+ Nova tarefa</Text></Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F7F7FD', gap: 12 },
  input: { backgroundColor: '#fff', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#ddd' },
  filters: { flexDirection: 'row', gap: 6 },
  filter: { borderRadius: 10, paddingVertical: 10, paddingHorizontal: 11, backgroundColor: '#e9e9f4' },
  selected: { backgroundColor: '#6257D7' },
  white: { color: '#fff', fontWeight: '600' },
  dark: { color: '#373452' },
  empty: { textAlign: 'center', marginTop: 50, color: '#777' },
  add: { alignItems: 'center', backgroundColor: '#6257D7', borderRadius: 12, padding: 16 },
});
