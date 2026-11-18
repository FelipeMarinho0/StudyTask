
export async function buscarConselho(): Promise<string> {
  const resposta = await fetch(
    'https://api.adviceslip.com/advice',
    { headers: { 'Cache-Control': 'no-cache' } }
  );

  if (!resposta.ok) {
    throw new Error('Falha ao consultar a API.');
  }

  const dados = await resposta.json();

  return dados.slip.advice;
}
