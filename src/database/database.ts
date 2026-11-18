import * as SQLite from 'expo-sqlite';
import { Task } from '../types/Task';

type TaskRow = Omit<Task, 'concluida'> & { concluida: number };

const dbPromise = (async () => {
  const db = await SQLite.openDatabaseAsync('studytask.db');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tarefas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descricao TEXT NOT NULL DEFAULT '',
      prioridade TEXT NOT NULL DEFAULT 'Media',
      concluida INTEGER NOT NULL DEFAULT 0,
      lembreteEm TEXT,
      notificationId TEXT
    );
  `);
  return db;
})();

function toTask(row: TaskRow): Task {
  return { ...row, concluida: row.concluida === 1 };
}

export async function listarTarefas(): Promise<Task[]> {
  const db = await dbPromise;
  return (await db.getAllAsync<TaskRow>('SELECT * FROM tarefas ORDER BY id DESC')).map(toTask);
}

export async function buscarTarefa(id: number): Promise<Task | null> {
  const db = await dbPromise;
  const row = await db.getFirstAsync<TaskRow>('SELECT * FROM tarefas WHERE id = ?', id);
  return row ? toTask(row) : null;
}

export type TaskInput = Pick<Task, 'titulo' | 'descricao' | 'prioridade' | 'lembreteEm' | 'notificationId'>;

export async function adicionarTarefa(input: TaskInput): Promise<void> {
  const db = await dbPromise;
  await db.runAsync(
    `INSERT INTO tarefas (titulo, descricao, prioridade, lembreteEm, notificationId)
     VALUES (?, ?, ?, ?, ?)`,
    input.titulo, input.descricao, input.prioridade, input.lembreteEm, input.notificationId
  );
}

export async function editarTarefa(id: number, input: TaskInput): Promise<void> {
  const db = await dbPromise;
  await db.runAsync(
    `UPDATE tarefas SET titulo = ?, descricao = ?, prioridade = ?, lembreteEm = ?, notificationId = ? WHERE id = ?`,
    input.titulo, input.descricao, input.prioridade, input.lembreteEm, input.notificationId, id
  );
}

export async function alternarTarefa(id: number): Promise<void> {
  const db = await dbPromise;
  await db.runAsync(`UPDATE tarefas SET concluida = CASE WHEN concluida = 1 THEN 0 ELSE 1 END WHERE id = ?`, id);
}

export async function definirNotificacao(id: number, notificationId: string | null): Promise<void> {
  const db = await dbPromise;
  await db.runAsync('UPDATE tarefas SET notificationId = ? WHERE id = ?', notificationId, id);
}

export async function excluirTarefa(id: number): Promise<void> {
  const db = await dbPromise;
  await db.runAsync('DELETE FROM tarefas WHERE id = ?', id);
}
