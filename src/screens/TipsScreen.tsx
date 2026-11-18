
import React, { useState, useEffect } from 'react';
import {
  View, Text, Button,
  ActivityIndicator, StyleSheet
} from 'react-native';

import { buscarConselho } from '../services/api';

export default function TipsScreen() {
  const [conselho, setConselho] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function carregar() {
    try {
      setCarregando(true);
      setErro('');

      const resultado = await buscarConselho();
      setConselho(resultado);
    } catch {
      setErro('Não foi possível buscar o conselho.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Conselho do Dia
      </Text>

      {carregando ? (
        <ActivityIndicator size="large" />
      ) : (
        <Text style={styles.conselho}>
          {erro || conselho}
        </Text>
      )}

      <Button
        title="Buscar outro conselho"
        onPress={carregar}
        disabled={carregando}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 24
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  conselho: {
    fontSize: 18,
    textAlign: 'center'
  }
});
