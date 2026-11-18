import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function configurarNotificacoes(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('lembretes', {
      name: 'Lembretes de tarefas',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
  const atual = await Notifications.getPermissionsAsync();
  const permissao = atual.granted ? atual : await Notifications.requestPermissionsAsync();
  return permissao.granted;
}

export async function agendarNotificacao(titulo: string, data: Date): Promise<string> {
  if (!Number.isFinite(data.getTime()) || data.getTime() <= Date.now()) {
    throw new Error('O horário do lembrete deve estar no futuro.');
  }
  if (!(await configurarNotificacoes())) {
    throw new Error('Permissão para notificações negada.');
  }
  return Notifications.scheduleNotificationAsync({
    content: { title: 'StudyTask — Lembrete', body: `Está na hora de: ${titulo}` },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: data,
      ...(Platform.OS === 'android' ? { channelId: 'lembretes' } : {}),
    },
  });
}

export async function cancelarNotificacao(id: string | null): Promise<void> {
  if (id) await Notifications.cancelScheduledNotificationAsync(id);
}
