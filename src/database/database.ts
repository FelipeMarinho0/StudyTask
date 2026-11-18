
import * as SQLite from 'expo-sqlite';
import { Task } from '../types/Task';

type TaskRow = Omit<Task, 'concluida'> & {
  concluida: number;
};

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

export async function listarTarefas(): Promise<Task[]> {
  const db = await dbPromise;

  const rows = await db.getAllAsync<TaskRow>(
    'SELECT * FROM tarefas ORDER BY id DESC'
  );

  return rows.map(row => ({
    ...row,
    concluida: row.concluida === 1
  }));
}

export async function adicionarTarefa(
  titulo: string,
  descricao: string,
  prioridade: string,
  lembreteEm: string | null = null,
  notificationId: string | null = null
) {
  const db = await dbPromise;

  await db.runAsync(
    `INSERT INTO tarefas
     (titulo, descricao, prioridade, lembreteEm, notificationId)
     VALUES (?, ?, ?, ?, ?)`,
    titulo,
    descricao,
    prioridade,
    lembreteEm,
    notificationId
  );
}

export async function alternarTarefa(id: number) {
  const db = await dbPromise;

  await db.runAsync(
    `UPDATE tarefas
     SET concluida = CASE WHEN concluida = 1
     THEN 0 ELSE 1 END
     WHERE id = ?`,
    id
  );
}

export async function excluirTarefa(id: number) {
  const db = await dbPromise;

  await db.runAsync(
    'DELETE FROM tarefas WHERE id = ?',
    id
  );
}
