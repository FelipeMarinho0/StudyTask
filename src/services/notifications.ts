
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
});

export async function configurarNotificacoes() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('lembretes', {
      name: 'Lembretes',
      importance: Notifications.AndroidImportance.HIGH
    });
  }

  const permissao = await Notifications.requestPermissionsAsync();

  return permissao.status === 'granted';
}

export async function agendarNotificacao(
  titulo: string,
  segundos: number = 5
) {
  const permitido = await configurarNotificacoes();

  if (!permitido) {
    throw new Error('Permissão de notificação negada.');
  }

  return await Notifications.scheduleNotificationAsync({
    content: {
      title: 'StudyTask - Lembrete',
      body: `Está na hora de: ${titulo}`
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: segundos,
      channelId: 'lembretes'
    }
  });
}

export async function cancelarNotificacao(id: string) {
  await Notifications.cancelScheduledNotificationAsync(id);
}
