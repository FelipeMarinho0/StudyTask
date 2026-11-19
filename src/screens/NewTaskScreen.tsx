import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useTasks } from '../context/TasksContext';
import { buscarTarefa } from '../database/database';

const prioridades = ['Baixa', 'Media', 'Alta'];

// Data digitada em horário local: 2026-11-24 19:30.
function parseHorario(text: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})$/.exec(text.trim());
  if (!m) return null;
  const [, ano, mes, dia, hora, minuto] = m.map(Number);
  const d = new Date(ano, mes - 1, dia, hora, minuto);
  return d.getFullYear() === ano && d.getMonth() === mes - 1 && d.getDate() === dia && d.getHours() === hora && d.getMinutes() === minuto ? d : null;
}

function formatarLocal(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function NewTaskScreen({ route, navigation }: any) {
  const id: number | undefined = route.params?.id;
  const { salvar, notificacoesAtivas } = useTasks();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState('Media');
  const [comLembrete, setComLembrete] = useState(false);
  const [horario, setHorario] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (id === undefined) return;
    buscarTarefa(id).then(t => {
      if (!t) return;
      setTitulo(t.titulo);
      setDescricao(t.descricao);
      setPrioridade(t.prioridade);
      setComLembrete(!!t.lembreteEm);
      if (t.lembreteEm) setHorario(formatarLocal(new Date(t.lembreteEm)));
    }).catch(() => Alert.alert('Erro', 'Não foi possível carregar a tarefa.'));
  }, [id]);

  async function enviar() {
    if (!titulo.trim()) return Alert.alert('Atenção', 'Digite o título da tarefa.');
    let lembreteEm: string | null = null;
    if (comLembrete) {
      const data = parseHorario(horario);
      if (!data || data.getTime() <= Date.now()) {
        return Alert.alert('Horário inválido', 'Use AAAA-MM-DD HH:MM com data e hora futuras.');
      }
      lembreteEm = data.toISOString();
    }
    setSalvando(true);
    try {
      await salvar({ titulo: titulo.trim(), descricao: descricao.trim(), prioridade, lembreteEm }, id);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Não foi possível salvar a tarefa.');
    } finally { setSalvando(false); }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Título *</Text>
      <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder="Estudar para a prova" />
      <Text style={styles.label}>Descrição</Text>
      <TextInput style={[styles.input, { minHeight: 85 }]} multiline value={descricao} onChangeText={setDescricao} placeholder="Detalhes da atividade" />
      <Text style={styles.label}>Prioridade</Text>
      <View style={styles.row}>
        {prioridades.map(p => <Pressable key={p} onPress={() => setPrioridade(p)} style={[styles.option, prioridade === p && styles.selected]}><Text style={prioridade === p ? styles.white : styles.dark}>{p === 'Media' ? 'Média' : p}</Text></Pressable>)}
      </View>
      <View style={styles.rowBetween}>
        <Text style={styles.label}>Ativar lembrete</Text>
        <Switch value={comLembrete} onValueChange={setComLembrete} />
      </View>
      {comLembrete && <>
        <Text style={styles.label}>Data e hora (AAAA-MM-DD HH:MM)</Text>
        <TextInput style={styles.input} value={horario} onChangeText={setHorario} placeholder="2026-11-24 19:30" autoCapitalize="none" />
        {!notificacoesAtivas && <Text style={styles.warning}>Lembretes estão desativados na tela inicial. A data será salva, mas não será disparado um aviso.</Text>}
      </>}
      <Pressable disabled={salvando} onPress={enviar} style={[styles.submit, salvando && { opacity: 0.5 }]}><Text style={styles.white}>{salvando ? 'Salvando...' : id === undefined ? 'Cadastrar tarefa' : 'Salvar alterações'}</Text></Pressable>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, gap: 12, backgroundColor: '#F7F7FD' },
  label: { fontSize: 16, fontWeight: '600', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, backgroundColor: '#fff' },
  row: { flexDirection: 'row', gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  option: { backgroundColor: '#e9e9f4', padding: 12, borderRadius: 9 },
  selected: { backgroundColor: '#6257D7' },
  white: { color: '#fff', fontWeight: 'bold' },
  dark: { color: '#333' },
  warning: { color: '#985D17' },
  submit: { backgroundColor: '#6257D7', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 10 },
});
