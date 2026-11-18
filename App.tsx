
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import TasksScreen from './src/screens/TasksScreen';
import NewTaskScreen from './src/screens/NewTaskScreen';
import TipsScreen from './src/screens/TipsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicio">
        <Stack.Screen
          name="Inicio"
          component={HomeScreen}
          options={{ title: 'StudyTask' }}
        />

        <Stack.Screen
          name="Tarefas"
          component={TasksScreen}
          options={{ title: 'Minhas Tarefas' }}
        />

        <Stack.Screen
          name="NovaTarefa"
          component={NewTaskScreen}
          options={{ title: 'Nova Tarefa' }}
        />

        <Stack.Screen
          name="Dicas"
          component={TipsScreen}
          options={{ title: 'Dicas e Conselhos' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
