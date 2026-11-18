import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTasks } from '../context/TasksContext';
import { agendarNotificacao } from '../services/notifications';

export default function HomeScreen({ navigation }: any) {
  const { tarefas, atualizar, notificacoesAtivas, alterarPreferencia } = useTasks();
  const [alterando, setAlterando] = useState(false);
  useFocusEffect(React.useCallback(() => { atualizar().catch(console.warn); }, [atualizar]));
  const resumo = useMemo(() => ({
    total: tarefas.length,
    pendentes: tarefas.filter(t => !t.concluida).length,
    concluidas: tarefas.filter(t => t.concluida).length,
  }), [tarefas]);

  async function testar() {
    try {
      const data = new Date(Date.now() + 10000);
      await agendarNotificacao('Teste de notificação', data);
      Alert.alert('Teste agendado', 'Coloque o app em segundo plano. Aviso em cerca de 10 segundos.');
    } catch (e) { Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao notificar.'); }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>StudyTask</Text>
      <Text style={styles.subtitle}>Seu planejamento de estudos em um só lugar.</Text>
      <View style={styles.summary}>
        <Text style={styles.counter}>Total: {resumo.total}</Text>
        <Text style={styles.counter}>Pendentes: {resumo.pendentes}</Text>
        <Text style={styles.counter}>Concluídas: {resumo.concluidas}</Text>
      </View>
      <Pressable style={styles.button} onPress={() => navigation.navigate('Tarefas')}><Text style={styles.buttonText}>Minhas tarefas</Text></Pressable>
      <Pressable style={styles.button} onPress={() => navigation.navigate('NovaTarefa')}><Text style={styles.buttonText}>Cadastrar tarefa</Text></Pressable>
      <Pressable style={styles.button} onPress={() => navigation.navigate('Dicas')}><Text style={styles.buttonText}>Conselho da API</Text></Pressable>
      <View style={styles.pref}>
        <Text style={styles.counter}>Lembretes habilitados</Text>
        <Switch value={notificacoesAtivas} disabled={alterando} onValueChange={async v => {
          setAlterando(true);
          try { await alterarPreferencia(v); }
          catch (e) { Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao alterar preferência.'); }
          finally { setAlterando(false); }
        }}/>
      </View>
      {notificacoesAtivas && <Pressable style={styles.test} onPress={testar}><Text style={styles.buttonText}>Testar notificação (10s)</Text></Pressable>}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { padding: 22, gap: 17, flexGrow: 1, backgroundColor: '#F7F7FD' },
  header: { fontSize: 34, fontWeight: 'bold', color: '#443CA9' },
  subtitle: { fontSize: 16, color: '#666' },
  summary: { backgroundColor: '#fff', padding: 18, borderRadius: 16, gap: 8 },
  counter: { fontSize: 16, color: '#222' },
  button: { backgroundColor: '#6257D7', padding: 16, borderRadius: 12, alignItems: 'center' },
  test: { backgroundColor: '#477E74', padding: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  pref: { backgroundColor: '#fff', borderRadius: 12, padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
