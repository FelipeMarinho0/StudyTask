
import React from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet
} from 'react-native';

import { agendarNotificacao } from '../services/notifications';

export default function HomeScreen({ navigation }: any) {

  async function testarNotificacao() {
    try {
      await agendarNotificacao('Estudar React Native');

      Alert.alert(
        'Pronto!',
        'A notificação foi agendada para daqui a 5 segundos.'
      );
    } catch {
      Alert.alert(
        'Erro',
        'Não foi possível agendar. Verifique as permissões.'
      );
    }
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        StudyTask
      </Text>

      <Text>Organize seus estudos!</Text>

      <Button
        title="Minhas Tarefas"
        onPress={() => navigation.navigate('Tarefas')}
      />

      <Button
        title="Nova Tarefa"
        onPress={() => navigation.navigate('NovaTarefa')}
      />

      <Button
        title="Dicas e Conselhos"
        onPress={() => navigation.navigate('Dicas')}
      />

      {/* Botão para testar notificações */}
      <Button
        title="Testar notificação"
        onPress={testarNotificacao}
        color="#6C63FF"
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 16,
    backgroundColor: '#F8F9FC'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
