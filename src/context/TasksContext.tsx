import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/Task';
import * as database from '../database/database';
import { agendarNotificacao, cancelarNotificacao } from '../services/notifications';

type FormValues = { titulo: string; descricao: string; prioridade: string; lembreteEm: string | null };
type TasksContextType = {
  tarefas: Task[];
  carregando: boolean;
  notificacoesAtivas: boolean;
  atualizar: () => Promise<void>;
  salvar: (values: FormValues, id?: number) => Promise<void>;
  alternar: (task: Task) => Promise<void>;
  excluir: (task: Task) => Promise<void>;
  alterarPreferencia: (active: boolean) => Promise<void>;
};
const Context = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tarefas, setTarefas] = useState<Task[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);

  const atualizar = useCallback(async () => {
    setTarefas(await database.listarTarefas());
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const pref = await AsyncStorage.getItem('@studytask:notificacoes');
        setNotificacoesAtivas(pref !== 'false');
        await atualizar();
      } catch (e) {
        console.warn('Falha ao carregar os dados:', e);
      } finally {
        setCarregando(false);
      }
    })();
  }, [atualizar]);

  const salvar = useCallback(async (values: FormValues, id?: number) => {
    const antiga = id === undefined ? null : await database.buscarTarefa(id);
    if (id !== undefined && !antiga) throw new Error('Tarefa não encontrada.');
    let novoId: string | null = null;
    let data: Date | null = null;
    if (values.lembreteEm) {
      data = new Date(values.lembreteEm);
      if (!Number.isFinite(data.getTime()) || data.getTime() <= Date.now()) {
        throw new Error('Escolha uma data e hora futuras.');
      }
    }
    try {
      if (data && notificacoesAtivas && !antiga?.concluida) {
        novoId = await agendarNotificacao(values.titulo, data);
      }
      const input = { ...values, notificationId: novoId };
      if (id === undefined) await database.adicionarTarefa(input);
      else await database.editarTarefa(id, input);
    } catch (e) {
      await cancelarNotificacao(novoId).catch(() => {});
      throw e;
    }
    // Só cancelar o alerta antigo depois de salvar com sucesso.
    if (antiga?.notificationId) {
      await cancelarNotificacao(antiga.notificationId).catch(console.warn);
    }
    await atualizar();
  }, [atualizar, notificacoesAtivas]);

  const alternar = useCallback(async (task: Task) => {
    await database.alternarTarefa(task.id);
    if (!task.concluida && task.notificationId) {
      await cancelarNotificacao(task.notificationId).catch(console.warn);
      await database.definirNotificacao(task.id, null);
    } else if (task.concluida && task.lembreteEm && notificacoesAtivas) {
      const data = new Date(task.lembreteEm);
      if (data.getTime() > Date.now()) {
        const id = await agendarNotificacao(task.titulo, data);
        await database.definirNotificacao(task.id, id);
      }
    }
    await atualizar();
  }, [atualizar, notificacoesAtivas]);

  const excluir = useCallback(async (task: Task) => {
    await database.excluirTarefa(task.id);
    await cancelarNotificacao(task.notificationId).catch(console.warn);
    await atualizar();
  }, [atualizar]);

  const alterarPreferencia = useCallback(async (active: boolean) => {
    await AsyncStorage.setItem('@studytask:notificacoes', String(active));
    setNotificacoesAtivas(active);
    // Desativar cancela lembretes programados, inclusive os de tarefas existentes.
    if (!active) {
      for (const task of await database.listarTarefas()) {
        if (task.notificationId) {
          await cancelarNotificacao(task.notificationId).catch(console.warn);
          await database.definirNotificacao(task.id, null);
        }
      }
    } else {
      for (const task of await database.listarTarefas()) {
        if (task.concluida || !task.lembreteEm || task.notificationId) continue;
        const data = new Date(task.lembreteEm);
        if (data.getTime() <= Date.now()) continue;
        const id = await agendarNotificacao(task.titulo, data);
        await database.definirNotificacao(task.id, id);
      }
    }
    await atualizar();
  }, [atualizar]);

  const value = useMemo(() => ({
    tarefas, carregando, notificacoesAtivas, atualizar, salvar, alternar, excluir, alterarPreferencia,
  }), [tarefas, carregando, notificacoesAtivas, atualizar, salvar, alternar, excluir, alterarPreferencia]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useTasks() {
  const value = useContext(Context);
  if (!value) throw new Error('useTasks exige TasksProvider');
  return value;
}
