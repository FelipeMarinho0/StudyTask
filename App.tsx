import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TasksProvider } from './src/context/TasksContext';
import HomeScreen from './src/screens/HomeScreen';
import TasksScreen from './src/screens/TasksScreen';
import NewTaskScreen from './src/screens/NewTaskScreen';
import TipsScreen from './src/screens/TipsScreen';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <TasksProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Inicio" screenOptions={{ headerTintColor: '#6257D7' }}>
          <Stack.Screen name="Inicio" component={HomeScreen} options={{ title: 'StudyTask' }} />
          <Stack.Screen name="Tarefas" component={TasksScreen} options={{ title: 'Minhas tarefas' }} />
          <Stack.Screen name="NovaTarefa" component={NewTaskScreen} options={{ title: 'Cadastrar / editar' }} />
          <Stack.Screen name="Dicas" component={TipsScreen} options={{ title: 'Conselhos da API' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </TasksProvider>
  );
}
