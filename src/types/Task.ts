
export type Task = {
  id: number;
  titulo: string;
  descricao: string;
  prioridade: string;
  concluida: boolean;
  lembreteEm: string | null;
  notificationId: string | null;
};
